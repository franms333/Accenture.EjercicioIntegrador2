sap.ui.define([], function() {
    "use strict";
    return {
        model: {
            I18N: "i18n",
        },
        properties: {
            TOOLS_MODE: {
                name: "/name"
            }
        },
        ids: {
            FRAGMENTS: {
                FormDialog: "formDialog"
            }
        },
        routes: {
            main: "MainEjercicioIntegrador2", 
            
            FRAGMENTS: { 
                FormDialog: "EjercicioIntegrador2.EjercicioIntegrador2.fragments.FormDialog"
            }
        }

    };
}, true)