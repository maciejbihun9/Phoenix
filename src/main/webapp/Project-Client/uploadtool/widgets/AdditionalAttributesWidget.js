define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./template/AdditionalAttributesWidget.html",
    "../widgets/dynamicAttribute/AttrTextBox",
    "../widgets/dynamicAttribute/AttrCheckBox",
    "../widgets/dynamicAttribute/AttrSelectBox",
    "../widgets/dynamicAttribute/AttrNumberTextBox",
    "../widgets/dynamicAttribute/AttrDateTextBox",
    //template
    "dojox/layout/TableContainer"
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, AttrTextBox, AttrCheckBox, AttrSelectBox, AttrNumberTextBox, AttrDateTextBox) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetTitle: null,
        data: [],
        buildRendering: function () {
            this.inherited(arguments);
            this._populateContainer();
        },
        _populateContainer: function () {
            for (var i = 0; i < this.data.length; i++) {
                this.attributesContainer.addChild(this._getBoxNode(this.data[i]));
            }
        },
        _getBoxNode: function (data) {
            switch (data.type) {
                case 'TEXT':
                    return new AttrTextBox(data);
                case 'SELECT':
                    return new AttrSelectBox(data);
                case 'CHECKBOX':
                    return new AttrCheckBox(data);
                case 'NUMERIC':
                    return new AttrNumberTextBox(data);
                case 'DATE':
                    return new AttrDateTextBox(data);
            }
        },
        onShow: function () {
            this.resize();
        }
    });
});