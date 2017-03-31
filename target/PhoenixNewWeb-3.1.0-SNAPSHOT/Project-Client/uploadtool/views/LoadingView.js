define([
    "dojo/_base/declare", 
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./template/LoadingView.html",
    "dijit/ProgressBar",
    "dojo/router",
    "../presenters/dialogContentPresenter",
    "../presenters/uploadPresenter"
    ,

], function (declare, lang, _WidgetBase, _TemplatedMixin,  template ,ProgressBar, router, dialogContentPresenter,uploadPresenter) {
   
	return declare([_WidgetBase, _TemplatedMixin], {
        name: "loading view",
        templateString: template,
        
        requestMethod : null,
        routerOnCompleteURL : null,
        
        _invokeProcessingContents : function(){ 
        	var i = 0;
    	    var myProgressBar = new ProgressBar({
    	        style: "width: 300px"
    	    }).placeAt(this.loaderFile);
    	    
    	    myProgressBar.startup();
    	    var interval = setInterval(function(){
    	    		
    	        uploadPresenter.getUploadProgres(function(data){
    	    	if(data.totalNumerOfDocuments > 0){
    	    	myProgressBar.set("value", (data.numerOfDocumentsProcesed*100) / data.totalNumerOfDocuments); 
    	    		if (data.numerOfDocumentsProcesed - data.totalNumerOfDocuments == 0) {
    	    	    clearInterval(interval);
    	    	  }
    	        }
             })},5000
            );
    	    
        	var self = this;        	
			// process contents
			// start showing progress circle
        	this.requestMethod().then(function(responseEntityData){
        		console.log('completed');
        	
     		router.go(self.routerOnCompleteURL);
			});
        },
        
        _prepareInformationMessage : function(listOfMessages, separator){
            var message = "";
            for (var i=0 ; i < listOfMessages.length ; i++) {
                message += listOfMessages[i] + separator;
            }                
            return message
        },
        
        onShow : function(){
        	this._invokeProcessingContents();
        }

    });
});