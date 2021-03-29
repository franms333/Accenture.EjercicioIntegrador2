sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "EjercicioIntegrador2/EjercicioIntegrador2/util/Services",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "EjercicioIntegrador2/EjercicioIntegrador2/util/Formatters",
        "sap/base/Log"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Services, Filter, FilterOperator, Formatters, Log) {
        "use strict";

        return Controller.extend("EjercicioIntegrador2.EjercicioIntegrador2.controller.MainEjercicioIntegrador2", {
            formatter: Formatters,
            onInit: function () {
                sap.ui.getCore().getConfiguration().setLanguage("EN");
                this.loadModelProduct();
                this.getOwnerComponent().getRouter().getRoute("RouteMainEjercicioIntegrador2").attachPatternMatched(this._onRouteMatched, this);
            },
            loadModelProduct: async function () {
                const oResponse = await Services.getProductos();
                const oDataProduct = oResponse[0];
                var oModelProduct = new JSONModel();
                oModelProduct.setData(oDataProduct);
                this.getOwnerComponent().setModel(oModelProduct, "ProductosJSON");
                
                let oLength = oModelProduct.getData();
                oLength = oLength.value.length;
                console.log(oLength);

                let oModelProductsLength = new JSONModel();
                oModelProductsLength.setData(oLength);
                this.getOwnerComponent().setModel(oModelProductsLength, "ProductosLengthJSON");

                var oProductoSeleccionado = oModelProduct.getProperty("/value/0");
                let productModel = new JSONModel();
                productModel.setData(oProductoSeleccionado);
                this.getOwnerComponent().setModel(productModel, "ProductoSeleccionadoJSON");
                
            },

            _onRouteMatched: function () {
                this.getOwnerComponent().getRouter().navTo("RouteDetailView1");
            },
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

                console.log(oProductoSeleccionado.ProductName);
                console.log(oBindingContext);
            },
            onSearch: function(evt){
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
            }
        });
    });
