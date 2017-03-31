define([
    "dojo/_base/declare",
    "dijit/form/CheckBox"
], function (declare, CheckBox) {

    return declare([CheckBox], {
        disabled: true,
        constructor: function (data) {
            this.label = data.name;
            this.checked = data.value;
        }
    });
});