define([
    "dojo/_base/declare",
    "dijit/ProgressBar",
    "dojo/on"
], function(declare, ProgressBar , on ) {
    return declare([ProgressBar], {
    	uploader : null,
    	onComplete : null , 
    	postCreate : function(){
    		this.inherited(arguments);
    		var self = this;
    		this.own(
	        	on(this.uploader, 'progress',function(event){     
	        		self.set("value" , event.percent);	        		
	        	}),	        	
	        	on(this.uploader, 'complete',  function(event){		 
	        		self.onComplete();		        		
	        	})
        	);   
    	}
    	
    });
});