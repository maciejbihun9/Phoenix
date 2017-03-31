define([
    "dojo/_base/declare",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetBase",
    "dijit/_WidgetsInTemplateMixin",
    "../presenters/uploadedFilePresenter",
    "dojo/text!./template/ApplyUploadWidget.html",
    "dojo/on",
    "dojo/dom",
    "dojo/router",
    "dojo/domReady!",
    
    //template
    "dijit/form/Button"
], function (declare, _TemplatedMixin, _WidgetBase, _WidgetsInTemplateMixin, filePresenter, template, on, dom, router, domReady) {
    
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template,
        _invalidDocumentsExists: null,
        
        postCreate: function () {
            this._navigateToEndingView();
            this.inherited(arguments);
        },
        
        _documentsValidated: function () {
            var self = this;
            filePresenter.requestForValidation().then(function (invalidDocuments) {
                console.log("List elements : " + invalidDocuments);
                self._invalidDocumentsExists = invalidDocuments.length > 0;
            });
        },
        
        _navigateToEndingView: function () {
            var self = this;
            var endingViewUrl = "/endingView";
            console.log("apply button : " + this.applyButtonId);
            this._documentsValidated();
            on(this.applyButtonId, "click", function () {
                router.go(endingViewUrl);
                self._applyUpload();
            });
        },
        
        _applyUpload: function () {
            filePresenter.applyUploadRequest().then(function (data) {
                console.log("Mocked data rest length : " + data.length);
                console.log("start applyUploadRest : " + data);
            });
        },
        
        validate: function(/*dijit.Tree*/ tree) {
            var self = this;
            tree.model.store.get(-1).then(function (data) {
                var valid = false;
                for(var x in data.children) {
                    valid = data.children[x].valid;
                    if (!valid) {
                        break;
                    }
                }
                self.applyButtonId.setDisabled(this._invalidDocumentsExists || !valid);
            });
        }
    });
});
