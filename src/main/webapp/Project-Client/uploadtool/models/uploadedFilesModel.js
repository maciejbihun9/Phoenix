define(["dojo/_base/declare" , "dstore/Rest", "dstore/Memory" , "dstore/Trackable", "dojo/_base/config"], function (declare, Rest, Memory, Trackable ,config) {

	var restUploadToolOperation = "rest/uploadtool/operation/";
	
    var targetURL = 'rest/uploadtool/fileUpload/'+config.app.operationId+'/'; 
    var proccessUploadedContentUrl = restUploadToolOperation + config.app.operationId + "/processUpload";
    var filesWithoutMetadataUrl = restUploadToolOperation + config.app.operationId + "/filesWithNoMetadata";
    var applyUploadUrl = restUploadToolOperation + config.app.operationId + "/applyUpload";
    var validationInfoUrl = "rest/uploadtool/operation/" + config.app.operationId + "/validation";

    //rest store to manage all rest requests
    var restStore = new Rest({target: targetURL});
    
    var uploadFileStores = new declare([Memory, Trackable])() ;
    
    //Synchronize status with backend
    var fetchStoredInBackendFilesDefered = restStore.fetch();
    fetchStoredInBackendFilesDefered.then(function(results){

    	results.forEach(function(item){
    		item.backend = true ;
    		uploadFileStores.add(item);
    		
    	});
    });
    
    //register event
    //When we remove items from backend
    //we send delete request also
    uploadFileStores.on('delete', function(event){
    	if(event.target.backend){
	    	restStore.remove(event.target.id).then(function(data){
	    			
	    		},
	    		//on error
	    		//we put back object to store
	    		function(error){
	    			console.log('error id ' , event.target.id , ' error = ' , error);
	    			uploadFileStores.add(event.target);
	    		}
    		);
    	}    	
    });
    
    
    
    //Simple model definition
    var ModelDefinition = declare([],{
    		
    		getTargetURL : function(){
    			return targetURL;
    		},
    		
    		getProcessUploadUrl : function(){
    			return proccessUploadedContentUrl;
    		},
    		
    		getFilesWithoutMetadataUrl : function(){
    			return filesWithoutMetadataUrl;
    		},
                
    		getValidationInfoUrl : function(){
                return validationInfoUrl;
            },    
    		
    		getApplyUploadUrl : function(){
    			return applyUploadUrl;
    		},
            
            //Method returns store to display in view.
            //Contains uploaded file data and currently uploaded file. 
            //
            //returns dstore/Memory mixed with dstore/Trackable
            getUploadFileStore : function(){
            	return uploadFileStores;
            },
            
            //Returns defered with stored in backend files. 
            getFetchStoredInBackendFilesDefered: function(){
            	return fetchStoredInBackendFilesDefered;
            }
            
        }
    );

    var model = new ModelDefinition();

    return model;
});