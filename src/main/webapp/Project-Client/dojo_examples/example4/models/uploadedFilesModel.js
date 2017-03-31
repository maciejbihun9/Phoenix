define(["dojo/_base/declare" , "dstore/Rest", "dstore/Memory" , "dstore/Trackable", "dojo/_base/config"], function (declare, Rest, Memory, Trackable ,config) {

    var targetURL = 'rest/uploadtool/fileUpload/'+config.app.operationId+'/'; 

    //rest store to manage all rest requests
    var restStore = new Rest({target: targetURL});
    
    
    var uploadFileStores = new declare([Memory, Trackable])() ;
    
    //Synchronize status with backend
    var initialDefered = restStore.fetch();
    initialDefered.then(function(results){

    	results.forEach(function(item){
    		item.backend = true ;
    		uploadFileStores.add(item);
    		
    	})
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
    		)
    	}    	
    });
    
    
    
    //Simple model definition
    var ModelDefinition = declare([],{
    		
    		getTargetURL : function(){
    			return targetURL;
    		},
            
            //Method returns store to display in view.
            //Contains uploaded file data and currently uploaded file. 
            //
            //returns dstore/Memory mixed with dstore/Trackable
            getUploadFileStore : function(){
            	return uploadFileStores;
            },
            
            getInitialDefered: function(){
            	return initialDefered;
            }
            
        }
    );

    var model = new ModelDefinition();

    return model;
});