define(["dojo/router"] , function(router){
	var views = {};
	
	function registerView(url, view){
		views[url] = view;
		
		router.register(url , function(e){
			navigateTo(view,e);
		});
	}  
	
	function navigateTo(view , e){
		var hiddeOthers = e.params.hideOther != "false" ;
		console.log(hiddeOthers);
		for(var i in views){
			var v = views[i];
			if(view == v){
				v.domNode.style.display="";
				if(v.show){
					v.show(e);
				}
			}
			else if(hiddeOthers){
				if(v.hide)
					v.hide(e);
				v.domNode.style.display="none";
			}
		}
	}
	
	function startup(){
		router.startup("/main");
	}
	
	return {
		registerView: registerView,
		startup : startup
		
	} 
});