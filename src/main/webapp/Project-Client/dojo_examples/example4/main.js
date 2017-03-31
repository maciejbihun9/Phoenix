define([ "dojo/dom", "dojo/dom-construct", "./views/UploadingView" , "./views/HeaderView" , "./views/ErrorView", "./views/MainPageLayoutView" ,"./router" ],
	function(dom, domConstruct, uploadingViews, HeaderView ,  ErrorView , MainPageLayoutView , router ) {

	var mainLayout = new MainPageLayoutView({top : true, center : true});
	mainLayout.placeAt(document.body)
	
	var headerView = new HeaderView();	
	var uploadingView = new uploadingViews();
	
	
	
	mainLayout.setHeader(headerView);
	

	router.setUpMainFrame(mainLayout);
	
	router.registerView("/main", uploadingView);
	
		
	headerView.startup();	
	
	router.startup();
	mainLayout.startup();
	
	function createAndAppendDiv() {
		return domConstruct.create("div", null, "viewContainer");
	}
});