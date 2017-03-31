define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./template/UploadingView.html",
    
    "../presenters/uploadedFilePresenter",
    "../presenters/operationPresenter" , 
    
    "../widgets/UploaderWithTable",
    
    //in template
    "dijit/form/Button",
    'dijit/layout/LayoutContainer',
    'dijit/layout/ContentPane'

], function (declare, lang, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
              uploadedFilePresenter, operationPresenter , Uploader ) {
   
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        requiredCSS: [],
        name: "Upload tool view",

        templateString: template,
        uploaderWidget: null,
        buildRendering: function () {
            this.inherited(arguments);
            
            this.uploaderWidget = new Uploader({uploaderPresenter : uploadedFilePresenter , baseClass: 'uploaderWithTable'}, this.uploader);            
            this.uploaderWidget.startup();

            var self = this;
            //register action on ready state change
            uploadedFilePresenter.registerActionIsReadyChange(function(isReady){            
            	self.previewButton.setDisabled(!isReady);
            });
            
            this._setupDestinationFolderName();
        },   

        _setupDestinationFolderName : function(){
            operationPresenter.getCurrentOperation(lang.hitch(this, function(data){
                this.destinationFolderName.innerHTML= data.folder.path ;
                console.log('setupDestinationFolderName' , data);
            }));
        },        
        resize: function () {
        	//It is important!!!!
        	//when we use Layout container inside widget template
            this.cont.resize(arguments);

            this.inherited(arguments);
        }

    });
});