define(["dojo/request","dojo/_base/config"], function(request, config){
  
//	var url = 'rest/uploadtool/uploadProgres/progres';
	var url = 'rest/uploadtool/operation/' + config.app.operationId + '/uploadProgres/';
	
    return {
    	getUploadProgres : function(){
   			return request(url, {
   			    handleAs: "json",
   			    sync : true
   			  });
    	}
    }
})