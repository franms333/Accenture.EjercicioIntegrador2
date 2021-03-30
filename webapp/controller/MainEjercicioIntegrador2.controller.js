sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "EjercicioIntegrador2/EjercicioIntegrador2/util/Services",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "EjercicioIntegrador2/EjercicioIntegrador2/util/Formatters",
        "EjercicioIntegrador2/EjercicioIntegrador2/util/Constants",
        "sap/m/library",
        "sap/ui/Device",
        "sap/ui/model/Sorter"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Services, Filter, FilterOperator, Formatters, Constants, mLibrary, Device, Sorter) {
        "use strict";

        return Controller.extend("EjercicioIntegrador2.EjercicioIntegrador2.controller.MainEjercicioIntegrador2", {
            formatter: Formatters,
            onInit: function () {
                sap.ui.getCore().getConfiguration().setLanguage("EN");
                this.loadModelProduct();
                this.getOwnerComponent().getRouter().getRoute(Constants.routes.routeMain).attachPatternMatched(this._onRouteMatched, this);
                this._ViewSettingsDialog = {};
            },
            // LOADMODEL DONDE SE INICIAN LOS MODELOS DE: "productos", "longitud de productos", "producto Seleccionado"
            loadModelProduct: async function () {
                const oResponse = await Services.getProductos();
                const oDataProduct = oResponse[0];
                var oModelProduct = new JSONModel();
                oModelProduct.setData(oDataProduct);
                this.getOwnerComponent().setModel(oModelProduct, "ProductosJSON");
                
                let oLength = oModelProduct.getData();
                oLength = oLength.value.length;
                

                let oModelProductsLength = new JSONModel();
                oModelProductsLength.setData(oLength);
                this.getOwnerComponent().setModel(oModelProductsLength, "ProductosLengthJSON");

                var oProductoSeleccionado = oModelProduct.getProperty("/value/0");
                let productModel = new JSONModel();
                productModel.setData(oProductoSeleccionado);
                this.getOwnerComponent().setModel(productModel, "ProductoSeleccionadoJSON");
                
            },

            //PERMITE MOSTRAR LA VISTA DEL DETALLE
            _onRouteMatched: function () {
                this.getOwnerComponent().getRouter().navTo(Constants.routes.routeDetail);
            },
            // FUNCIÓN ON SORT
            onSort: function () {
                this.createViewSettingsDialog(Constants.routes.FRAGMENTS.SortDialog).open();
            },

            // FUNCIÓN ON FILTER
            onFilter: function (oEvent) {
                this.createViewSettingsDialog(Constants.routes.FRAGMENTS.FilterDialog).open();
            },

            // AL PRESIONAR UN ITEM DE LA LISTA, MOSTRARÁ EN LA VISTA DEL DETALLE LOS DATOS DEL PRODUCTO
            onListItemPress: async function (oEvent) {

                var oItem = oEvent.getSource();
                var oBindingContext = oItem.getBindingContext("ProductosJSON");
                var oModel = this.getOwnerComponent().getModel("ProductosJSON");
                var oProductoSeleccionado = oModel.getProperty(oBindingContext.getPath());

                let oModelProduct = this.getOwnerComponent().getModel("ProductoSeleccionadoJSON");
                oModelProduct.setData(oProductoSeleccionado);

                let productID = oProductoSeleccionado.ProductID;

                const oResponse = await Services.getProveedor(productID);
                const oDataProveedor = oResponse[0];
                var oModelProveedor = new JSONModel();
                oModelProveedor.setData(oDataProveedor);
                this.getOwnerComponent().setModel(oModelProveedor, "ProveedorJSON");

            },

            // PERMITE FILTRAR LOS PRODUCTOS AL ESCRIBIR EN LA BARRA DE BÚSQUEDA Y ACTUALIZAR EL CONTADOR
            onSearch: function(evt){
                let oModelContador = this.getOwnerComponent().getModel("ProductosLengthJSON");

                var aFilters = [];
                var sQuery = evt.getSource().getValue();
                if(sQuery && sQuery.length > 0){
                    var oFilter = new Filter("ProductName", FilterOperator.Contains, sQuery);
                    aFilters.push(oFilter);

                    var oFilters = new Filter(aFilters);
                }
                var oList = this.getView().byId("idListProducts");
                var oBindingInfo = oList.getBinding("items"); 

                
                oBindingInfo.filter(oFilters, "Application"); 

                let oLength = oList.getItems().length;
                let oContador = new JSONModel();
                oContador.setData(oLength);
                this.getOwnerComponent().setModel(oContador, "ProductosLengthJSON");

            },

            // SORT Y FILTERS
            createViewSettingsDialog: function (sDialogFragmentName) {
                var oDialog;
                oDialog = this._ViewSettingsDialog[sDialogFragmentName];

                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
                    this.getView().addDependent(oDialog);
                    this._ViewSettingsDialog[sDialogFragmentName] = oDialog;
                }

                oDialog.setFilterSearchOperator(mLibrary.StringFilterOperator.Contains);
                if (Device.system.desktop) {
                    oDialog.addStyleClass("sapUiSizeCompact");
                }
                if (sDialogFragmentName === Constants.routes.FRAGMENTS.FilterDialog) {
                    var oModelJSON = this.getOwnerComponent().getModel("ProductosJSON");
                    var modelOriginal = oModelJSON.getProperty("/value");

                    var jsonProductName = JSON.parse(JSON.stringify(modelOriginal, ["ProductName"]));
                    var jsonPrice = JSON.parse(JSON.stringify(modelOriginal, ["UnitPrice"]));
                    var jsonProductID = JSON.parse(JSON.stringify(modelOriginal, ["ProductID"]));

                    oDialog.setModel(oModelJSON);

                    jsonProductName = jsonProductName.filter(function (currentObject) {
                        
                        if (currentObject.ProductName in jsonProductName) {
                            return false;
                        } else {
                            jsonProductName[currentObject.ProductName] = true;
                            return true;
                        }
                    }),
                    jsonPrice = jsonPrice.filter(function (currentObject) {
                        
                        if (currentObject.UnitPrice in jsonPrice) {
                            return false;
                        } else {
                            jsonPrice[currentObject.UnitPrice] = true;
                            return true;
                        }
                    }),
                    jsonProductID = jsonProductID.filter(function (currentObject){
                        
                        if (currentObject.ProductID ?. jsonProductID) {
                            return false;
                        } else {
                            
                             jsonProductID[currentObject.ProductID-1] = true;
                             return true;
                        }
                    })
                    var ProductNameFilter = [];
                    for (var i = 0; i < jsonProductName.length; i++) {
                        ProductNameFilter.push(
                            new sap.m.ViewSettingsItem({
                                text: jsonProductName[i].ProductName,
                                key: 'ProductName'
                            })
                        )
                    }
                    var ProductPriceFilter = [];
                    for (var i = 0; i < jsonPrice.length; i++) {
                        ProductPriceFilter.push(
                            new sap.m.ViewSettingsItem({
                                text: jsonPrice[i].UnitPrice,
                                key: 'UnitPrice'
                            })
                        )
                    }
                    var ProductIDFilter = [];
                    for (var i = 0; i < jsonProductID.length; i++) {
                        ProductIDFilter.push(
                            new sap.m.ViewSettingsItem({
                                text: jsonProductID[i].ProductID,
                                key: 'ProductID'
                            })
                        )
                    }
                }
                if(oDialog.getFilterItems().length==1){
                        oDialog.destroyFilterItems();
                        oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                            key: "ProductName",
                            text: "Nombre",
                            items: ProductNameFilter
                        }));

                        oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                            key: "UnitPrice",
                            text: "Precio",
                            items: ProductPriceFilter
                        }));
                        oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                            key: "ProductID",
                            text: "ID Producto",
                            items: ProductIDFilter
                        }));
                }
                
                return oDialog;
            },

            // FUNCIÓN AL CONFIRMAR EL ITEM POR EL CUAL ORDENAR
            onSortDialogConfirm: function (oEvent) {
                var oList = this.byId('idListProducts'),
                    mParams = oEvent.getParameters(),
                    oBinding = oList.getBinding("items"),
                    sPath,
                    bDescending,
                    aSorters = [];
                sPath = mParams.sortItem.getKey();
                bDescending = mParams.sortDescending;
                aSorters.push(new Sorter(sPath, bDescending));
                oBinding.sort(aSorters);
            },
            
            // FUNCIÓN AL CONFIRMAR EL ITEM DE FILTRADO
            onFilterDialogConfirm: function (oEvent) {
                var oList = this.byId("idListProducts"),
                    mParams = oEvent.getParameters(),
                    oBinding = oList.getBinding("items"),
                    aFilters = [];
                mParams.filterItems.forEach(function (oItem) {
                    var sPath = oItem.getKey(),
                        sOperator = FilterOperator.EQ,
                        sValue1 = oItem.getText();
                    var oFilter = new Filter(sPath, sOperator, sValue1);
                    aFilters.push(oFilter);
                });
                oBinding.filter(aFilters);
            }
        });
    });
