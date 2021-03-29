jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.define([ 
     "EjercicioIntegrador2/EjercicioIntegrador2/util/Services",
],
	
	function (Services) {
		"use strict";
        return{
            formatValor: function(valor){
                valor = parseFloat(valor).toFixed(2);
                return valor;
            },
            formatStockStatusText: function(unidadesEnStock){
                let oObjectStatus = this.getView().byId('stockStatus');
                if(unidadesEnStock>10){
                    oObjectStatus.setText("In Stock");
                    return oObjectStatus.getText();
                } else if (unidadesEnStock>0 && unidadesEnStock<10){
                    oObjectStatus.setText("Few Stock");
                    return oObjectStatus.getText();
                } else{
                    oObjectStatus.setText("Out of Stock");
                    return oObjectStatus.getText();
                }
            },
            formatStockStatusState: function(unidadesEnStock){
                let oObjectStatus = this.getView().byId('stockStatus');
                if(unidadesEnStock>10){
                    oObjectStatus.setState("Success");
                    return oObjectStatus.getState();
                } else if (unidadesEnStock>0 && unidadesEnStock<10){
                    oObjectStatus.setState("Warning");
                    return oObjectStatus.getState();
                } else{
                    oObjectStatus.setState("Error");
                    return oObjectStatus.getState();
                }
            }
        }
		
	}, true);