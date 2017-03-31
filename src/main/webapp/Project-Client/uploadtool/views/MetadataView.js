define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./template/MetadataView.html",
    "../presenters/attributePresenter",
    //in template
    'dijit/layout/LayoutContainer',
    'dojox/layout/TableContainer',
    'dijit/layout/ContentPane'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, attributePresenter) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        treeNodeId: null,
        templateString: template,
        buildRendering: function () {
            this.inherited(arguments);

            attributePresenter.placeStaticMetadataWidget(this.treeNodeId, this.staticMetadataWidgetContainer);
            attributePresenter.placeMandatoryAttributeWidget(this.treeNodeId, this.mandatoryMetadataWidgetContainer);
            attributePresenter.placeOptionalAttributeWidget(this.treeNodeId, this.optionalMetadataWidgetContainer);
            attributePresenter.placeAttachmentsWidget(this.treeNodeId, this.attachementTableContainer);
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