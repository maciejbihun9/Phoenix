define([
    "dojo/_base/declare",
    "dijit/form/TextBox"
], function (declare, TextBox) {

    return declare([TextBox], {
        disabled: true,
        constructor: function (data) {
            this.label = data.name;
            this.value = data.value;
        }
    });
});