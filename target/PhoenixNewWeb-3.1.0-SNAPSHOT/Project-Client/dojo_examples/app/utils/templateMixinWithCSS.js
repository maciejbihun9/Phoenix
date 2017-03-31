define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin"
], function(declare, _WidgetBase) {

    return declare([_WidgetBase], {        
        cssRequirements: [], 
        buildRendering: function(){
        	    var head  = document.getElementsByTagName('head')[0];
        	    for(var i=0 ; i <this.cssRequirements.length ; i++){
        	    	var cssReq = this.cssRequirements[i];
        	    	var link  = document.createElement('link');        	    
        	    	link.rel  = 'stylesheet';
        	    	link.type = 'text/css';        	    
        	    	link.href = cssReq.cssFile;        	    
	        	    link.media = 'all';
	        	    head.appendChild(link);
        	    };
        	    this.inherited(arguments);
        }
    
    });

});