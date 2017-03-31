define([
    "dojo/_base/declare",
    "../models/attributeModel",
    "../widgets/StaticMetadataWidget",
    "../widgets/AttachementTableWidget",
    "../widgets/AdditionalAttributesWidget"
], function (declare, attributeModel, StaticMetadataWidget, AttachementTableWidget, AdditionalAttributesWidget) {

    var AttributePresenter = declare([], {
        placeStaticMetadataWidget: function (documentId, container) {
            attributeModel.getStaticAttributes(documentId).then(function (data) {
                new StaticMetadataWidget(data).placeAt(container);
            });
        },
        placeMandatoryAttributeWidget: function (documentId, container) {
            this._placeAttributeWidgetBase(container, attributeModel.getMandatoryAttributes(documentId), 'Mandatory Attributes');
        },
        placeOptionalAttributeWidget: function (documentId, container) {
            this._placeAttributeWidgetBase(container, attributeModel.getOptionalAttributes(documentId), 'Optional Attributes');
        },
        placeAttachmentsWidget: function (documentId, container) {
            attributeModel.getAttachments(documentId).then(function (data) {
                new AttachementTableWidget(data).placeAt(container);
            });
        },
        _placeAttributeWidgetBase: function (container, request, title) {
            request.then(function (data) {
                new AdditionalAttributesWidget({
                    widgetTitle: title,
                    data: data
                }).placeAt(container);
            });
        }
    });

    var presenter = new AttributePresenter();

    return presenter;
});