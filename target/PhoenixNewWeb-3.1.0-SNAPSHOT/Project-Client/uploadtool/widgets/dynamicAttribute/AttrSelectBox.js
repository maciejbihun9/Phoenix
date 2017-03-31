define([
    "dojo/_base/declare",
    "dijit/form/Select"
], function (declare, Select) {

    return declare([Select], {
        disabled: true,
        options: [],
        constructor: function (data) {
            this.label = data.name;
            this.options[0] = {
                label: data.value,
                value: data.value,
                selected: true
            };
        }
    });
});