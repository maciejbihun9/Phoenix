define([ 
                "dojo/_base/declare", 
                "dojo/_base/lang", 
                "dijit/_WidgetBase",
		"dijit/_TemplatedMixin", 
                "dijit/_WidgetsInTemplateMixin",
		"dojo/text!./template/UploadingView.html",
		"../presenters/uploadedFilePresenter",
		"../presenters/operationPresenter",
		"../widgets/MetadataInformatorWidget",
		"../widgets/UploaderWithTable",
                "dojo/on", 
                "dojo/router",
		// in template
		"dijit/form/Button", 'dijit/layout/LayoutContainer',
		'dijit/layout/ContentPane'

], function(declare, lang, _WidgetBase, _TemplatedMixin,
		_WidgetsInTemplateMixin, template, uploadedFilePresenter,
		operationPresenter, MetadataInformatorWidget , Uploader, on, router) {

	return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
		requiredCSS : [],
		name : "Upload tool view",
		templateString : template,
		uploaderWidget : null,
		buildRendering : function() {
			this.inherited(arguments);

			this.uploaderWidget = new Uploader({
				uploaderPresenter : uploadedFilePresenter,
				baseClass : 'uploaderWithTable'
			}, this.uploader);
			this.uploaderWidget.startup();

			var self = this;
			// register action on event uploaded file list is not empty and all files are uploaded change :) 
			uploadedFilePresenter
					.registerEventOnUploadedFileListIsNotEmptyAndAllFilesAreUploaded(function(isReady) {
						self.previewButton.setDisabled(!isReady);
					});

			this._setupDestinationFolderName();
			this._navigateToPreviewView();
			this._setupMetadataInformator();
		},
		
		_setupMetadataInformator : function(){
			new MetadataInformatorWidget({readMoreButton : this.readMoreButton});
		},
		

		_setupDestinationFolderName : function() {
			operationPresenter.getCurrentOperation(lang.hitch(this, function(data) {
				this.destinationFolderName.innerHTML = data.folder.path;
				console.log('setupDestinationFolderName', data);
			}));
		},

		_navigateToPreviewView : function() {
			var previewViewUrl = "/processPreviewView";
			on(this.previewButton, "click", function() {
				router.go(previewViewUrl);
			});
		},

		resize : function() {
			// It is important!!!!
			// when we use Layout container inside widget template
			this.cont.resize(arguments);
			this.inherited(arguments);
		}

	});
});