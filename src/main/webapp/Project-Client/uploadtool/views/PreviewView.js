define([
    "dojo/_base/declare", 
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./template/PreviewView.html",
    "../presenters/previewViewPresenter",
    "../presenters/operationPresenter",
    "../widgets/ProcessedTree",
    "../widgets/ApplyUploadWidget",
    "dojo/topic",
    "../presenters/uploadedFilePresenter",
    "../presenters/dialogContentPresenter",
    '../views/MetadataView',
    
    //in template
    "dijit/form/Button",
    'dijit/layout/LayoutContainer',
    'dijit/layout/ContentPane'

], function (declare, lang, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, previewViewPresenter, operationPresenter, ProcessedTree, ApplyUploadWidget,  topic, filePresenter,  dialogContentPresenter, MetadataView) {

   
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        name: "tree node view",
        filesWereProcessed : false,
        templateString: template,
        tree: null,
        uploadWidget: null,
        attachementTable: null,
        metadataView: null,
        
        buildRendering: function () {
        	this.inherited(arguments);
                this._setupDestinationFolderName();
                this._setupApplyUploadWidget();
        },
        
        _createMetadataView : function(nodeId){
                if(this.metadataView !== null) {
                    this.metadataView.destroy();
                }
                this.metadataView = new MetadataView({treeNodeId: nodeId});
                this.metadataView.placeAt(this.metadataViewContainer);
        },
        
        _setupApplyUploadWidget : function(){
        	this.uploadWidget = new ApplyUploadWidget();
        	this.uploadWidget.placeAt(this.applyButtonContainer);
        },
		
        _setupDestinationFolderName : function() {
                operationPresenter.getCurrentOperation(lang.hitch(this, function(data) {
                        this.destinationFolderName.innerHTML = data.folder.path;
                        console.log('setupDestinationFolderName', data);
                }));
        },

        _invokeProcessingContents : function(){ 
        	var self = this;
                
                this.tree = new ProcessedTree({
                        id: 'utTree', //required by 'persist' attr;
                        model: previewViewPresenter.getTreeModel(),
                        
                        onClick: function (object) {
                            if (object.nodeType === 'D') {
                                self._createMetadataView(object.id);
                            }
                        }
                });
                this.tree.placeAt(self.processedFilesTree);
                
                //applyUploadButton disabling;
                this.uploadWidget.validate(this.tree);
                
                filePresenter.requestForFilesWithoutMetadata().then(function(data){
                    if(data.length > 0){
                            dialogContentPresenter.infoDialog("MissingMetadataWarn", {message : self._prepareInformationMessage(data, ", ", null)});
                    }
                });
                    
                filePresenter.requestForValidation().then(function(data){
                    if(data.length > 0){
                            dialogContentPresenter.warnDialog("ValidationError", {message : self._prepareInformationMessage(data, ",<br/>", ["conflict", "folderPath"])});
                    }
                });
        },
        
        _prepareInformationMessage : function(listOfMessages, separator, fieldList) {
            var message = "";
            for (var i=0 ; i < listOfMessages.length ; i++) {
                if (fieldList === null || fieldList.length === 0) {
                    message += listOfMessages[i] + separator;
                }
                else {
                    for (var j=0; j < fieldList.length ; j++) {
                        message += fieldList[j] + ": " + listOfMessages[i][fieldList[j]];
                        if (fieldList.length !== j+1) {
                            message += " - ";
                        }
                    }
                    message += separator;
                }
            }                
            return message;
        },
        
        invokeViewRest : function(){
            this._invokeProcessingContents();
        },
        
        onShow : function(){
            this.resize();
            this._invokeProcessingContents();
        },
       
        resize: function () {
        	//It is important!!!!
        	//when we use Layout container inside widget template
            this.cont.resize(arguments);
            if(this.metadataView !== null) {
                this.metadataView.resize();
            }
            this.inherited(arguments);
        }
    });
});