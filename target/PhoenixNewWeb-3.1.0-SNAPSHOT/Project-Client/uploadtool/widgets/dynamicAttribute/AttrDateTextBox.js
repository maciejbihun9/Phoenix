define([
    "dojo/_base/declare",
    "dijit/form/DateTextBox"
], function (declare, DateTextBox) {

    return declare([DateTextBox], {
        disabled: true,
        constructor: function (data) {
            this.label = data.name;
            this.value = data.value;
        }
    });
});