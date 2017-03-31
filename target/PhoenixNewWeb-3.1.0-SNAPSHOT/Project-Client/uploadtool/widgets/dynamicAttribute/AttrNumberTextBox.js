define([
    "dojo/_base/declare",
    "dijit/form/NumberTextBox"
], function (declare, NumberTextBox) {

    return declare([NumberTextBox], {
        disabled: true,
        constructor: function (data) {
            this.label = data.name;
            this.value = data.value;
        }
    });
});