define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./template/StaticMetadataWidget.html",
    //in template
    'dijit/layout/LayoutContainer',
    'dijit/form/TextBox',
    'dojo/parser'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        doc: {},
        constructor: function (data) {
            this.doc = data;
        },
        buildRendering: function () {
            this.inherited(arguments);
        },
        onShow: function () {
            this.resize();
        },
        resize: function () {
            //It is important!!!!
            //when we use Layout container inside widget template
            this.inherited(arguments);
        }
    });
});