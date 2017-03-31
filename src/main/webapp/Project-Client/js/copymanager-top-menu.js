require(["dojox/layout/ContentPane","dijit/registry", "dojo/on", "dojo/ready" ], function(ContentPane, registry, on, ready) {
	console.log("copymanager-top-menu.js start");
	ready(function(){
	
	//
	// Handle action of "History of changes" button.
	//
	var historyBtnAction = registry.byId("historyBtn");
	on(historyBtnAction, "click", function(e) {
		var pane = registry.byId("middleFrameTabs"),
		    historyPane = registry.byId("middleFrameTabs_History");
		
		if (typeof historyPane != "undefined") {
			pane.removeChild(historyPane);
			historyPane.destroy();
		}
		
	    historyPane = new ContentPane({
		    id : "middleFrameTabs_History",
		    title : "History of changes",
		    closable : true
		});
		
	    historyPane.set("href", "history/index.do");
	    pane.addChild(historyPane);		
		pane.selectChild(historyPane);
	});
	}
	);
	console.log("copymanager-top-menu.js stop");
	
});
