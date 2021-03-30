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
        Services: {
            link: "/V3/Northwind/Northwind.svc/Products"
        },
        ids: {
            FRAGMENTS: {
                FormDialog: "formDialog"
            }
        },
        routes: {
            main: "MainEjercicioIntegrador2", 
            routeMain: "RouteMainEjercicioIntegrador2",
            routeDetail: "RouteDetailView1",
            FRAGMENTS: { 
                FormDialog: "EjercicioIntegrador2.EjercicioIntegrador2.fragments.FormDialog",
                SortDialog: "EjercicioIntegrador2.EjercicioIntegrador2.fragments.SortDialog",
                FilterDialog: "EjercicioIntegrador2.EjercicioIntegrador2.fragments.FilterDialog"
            }
        }

    };
}, true)