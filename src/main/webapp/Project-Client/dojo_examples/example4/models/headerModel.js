define(["dojo/request"], function(request){
  
	var url = 'rest/headerdata/versioninfo';
	
	var request = request(url, {
	    handleAs: "json",
	    sync : true
	  });
	
    return {
    	getHeaderDataRequest : function(){
   			return request;
    	}
    }
})