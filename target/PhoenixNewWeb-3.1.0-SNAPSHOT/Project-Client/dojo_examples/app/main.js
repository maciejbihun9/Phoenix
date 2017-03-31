define([ "dojo/dom", "dojo/dom-construct", "./views/uploadingView" ,"./views/headerView", "./views/metaDataConfiguration", "./router" , "./views/finalView"],
	function(dom, domConstruct, uploadingViews, headerView , metaDataConfiguration, router , FinalView) {

	var headerView = new headerView( null, dom.byId("menu"));
	var uploadingView = new uploadingViews(null, createAndAppendDiv());
	var metaDataView = new metaDataConfiguration(null , createAndAppendDiv());
	var finalView = new FinalView(null,createAndAppendDiv() );
	
	router.registerView("/main", uploadingView);
	router.registerView("/metaData" , metaDataView);
	router.registerView("/final" , finalView);
	
	router.startup();

	function createAndAppendDiv() {
		return domConstruct.create("div", null, "viewContainer");
	}
})