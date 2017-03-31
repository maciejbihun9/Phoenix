define(["dojo/router"] , function(router){
	var views = {};
	
	var mainFrame = null;
	
	function setUpMainFrame(mainFrameView){
		mainFrame = mainFrameView;
	}
	
	function registerView(url, view){
		views[url] = view;
		router.register(url , function(e){
			navigateTo(view,e);
		});
	}  
	
	function navigateTo(view , e){
		mainFrame.setCenter(view, true);
		if(view.onShow){
			view.onShow();
		}
	}
	
	function startup(){
		for(var i in views){
			var view = views[i];
			view.startup();
		}
		router.startup("/main");
	}
	
	return {
		registerView: registerView,
		startup : startup,
		setUpMainFrame: setUpMainFrame
	};
});