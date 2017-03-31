define([ "dojo/dom", 
         "dojo/dom-construct",
         "./views/UploadingView",
         "./views/HeaderView",
         "./views/PreviewView",
         "./views/LoadingView",
         "./views/MainPageLayoutView",
         "./views/EndingView",
         "./views/DialogView",
         "./presenters/uploadedFilePresenter",
         "./router"],
	function(dom, domConstruct, uploadingViews, HeaderView, PreviewView, LoadingView, MainPageLayoutView, EndingView, DialogView, uploadedFilePresenter, router ) {

		var mainLayout = new MainPageLayoutView({top : true, center : true});
		mainLayout.placeAt(document.body)
		
		var headerView = new HeaderView();	
		var uploadingView = new uploadingViews();	
		var previewView = new PreviewView();
		var endingView = new EndingView();
		var processPreviewView = new LoadingView({requestMethod :  uploadedFilePresenter.processUploadToolOperationResource,  routerOnCompleteURL : "/previewView"});
		
		new DialogView().registerDialogEvent();
		
		mainLayout.setHeader(headerView);
	
		router.setUpMainFrame(mainLayout);
		
		router.registerView("/main", uploadingView);
		router.registerView("/processPreviewView", processPreviewView);
		router.registerView("/previewView", previewView);
		router.registerView("/endingView", endingView);

		
		headerView.startup();	
		
		router.startup();
		mainLayout.startup();
		
		function createAndAppendDiv() {
			return domConstruct.create("div", null, "viewContainer");
		}
});