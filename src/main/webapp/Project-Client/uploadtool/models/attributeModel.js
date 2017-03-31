define([
    "dojo/_base/declare",
    "dojo/request"
], function (declare, request) {

    var targetURL = 'rest/uploadtool/metadata/';

    var staticAttrUrl = targetURL + 'getUploadToolOperationDocument/';
    var mandatoryAttrUrl = targetURL + 'getDocumentMandatoryAttrValues/';
    var optionalAttrUrl = targetURL + 'getDocumentOptionalAttrValues/';
    var attachmentsUrl = targetURL + 'getDocumentAttachements/';

    var AttributeModel = declare([], {
        getStaticAttributes: function (documentId) {
            return this._myAsyncRequest(staticAttrUrl, documentId);
        },
        getMandatoryAttributes: function (documentId) {
            return this._myAsyncRequest(mandatoryAttrUrl, documentId);
        },
        getOptionalAttributes: function (documentId) {
            return this._myAsyncRequest(optionalAttrUrl, documentId);
        },
        getAttachments: function (documentId) {
            return this._myAsyncRequest(attachmentsUrl, documentId);
        },
        _myAsyncRequest: function (url, documentId) {
            return request(url + documentId, {
                handleAs: "json"
            });
        }
    });

    var model = new AttributeModel();
    return model;
});