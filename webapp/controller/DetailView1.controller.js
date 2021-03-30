sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment",
        "EjercicioIntegrador2/EjercicioIntegrador2/util/Constants",
        "EjercicioIntegrador2/EjercicioIntegrador2/util/Formatters",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/model/json/JSONModel",
        "EjercicioIntegrador2/EjercicioIntegrador2/util/Services",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, Constants, Formatters, MessageBox, MessageToast, JSONModel, Services) {
        "use strict";

        return Controller.extend("EjercicioIntegrador2.EjercicioIntegrador2.controller.DetailView1", {
            formatter: Formatters,
            onInit: function () {
                sap.ui.getCore().getConfiguration().setLanguage("EN");
                this.getOwnerComponent().getModel("ProductoSeleccionadoJSON");
                this.getOwnerComponent().getModel("ProveedorJSON")
            },
            
            abrirDialogo: function () {
                const oView = this.getView();
                //INICIALIZAR EL DIÁLOGO
                if (!this.pDialog) {
                    this.pDialog = Fragment.load({
                        id: oView.getId(),
                        name: Constants.routes.FRAGMENTS.FormDialog,
                        controller: this
                    }).then(function (oDialog) {
                        
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }

                //ABRIR EL DIÁLOGO
                this.pDialog.then(function (oDialog) {
                    oDialog.open();
                });
            },
            cerrarFragmento: function () {
                this.byId(Constants.ids.FRAGMENTS.FormDialog).close();
                
            },
            abrirMessage: function(){
                MessageBox.confirm("¿Desea borrar los datos?");
            },
            abrirMessageToast: function(){
                var msg = 'Copiado en el portapapeles';
			    MessageToast.show(msg);
            }

        });
    });