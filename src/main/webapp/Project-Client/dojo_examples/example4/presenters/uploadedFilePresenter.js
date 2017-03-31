define(["dojo/_base/declare" , "../models/uploadedFilesModel",  "./errorPresenter" , "dojo/promise/all" ], function (declare, uploadedFileModel, errorPresenter, all) {

	var sequence = -1;		
	
	var store = uploadedFileModel.getUploadFileStore();
	
	
	//Declare presenter body
    var PresenterDefinition = declare([],{
    		
	    	//Method query all uploaded files asynchronous
			//
			//onLoadAction - is fired when we get response.
			getUploadedFiles : function(onLoadAction){
	            return store.fetch().then(onLoadAction , errorPresenter.handleError);
	        },    	
    	
    		//returns store to display in View
            getStore : function(){
            	return store;
            },
            
            //Adds to store currently uploaded files            
            addUploadingFiles: function(uploader){
            	store.add({ id : sequence-- , nameList : uploader.getFileList() , uploader : uploader});	
            },
            
            //Adds to store currently uploaded file 
            addUploadedFile: function(fileName){            	
            	var encoding = window.btoa(fileName);            	
            	store.add({ id : encoding  , name: fileName , backend : true});	
            },
            
            //Deletes uploading files
            //
            //For UploadingFiles:
            //should be called when it was canceled
            //or if was completed.
            //
            //For UploadedFiles:
            //should be called when user dont
            //want to use uploaded file.
            removeFile: function(object){
            	store.remove(object.id);
            },
            
            //Returns target URL
            //
            //Target URL is needed to configure correctly File Uploader.            
            getUploadFileURL : function(){
                return uploadedFileModel.getTargetURL();
            },
            
            //Register action on event readyChange change
            //
            //Function is called with parameter boolean
            //when when store status is ready - not uploading and not empty then callFunction is called with true
            //in other case with false. :)
            registerActionIsReadyChange: function (callFunction){
            	store.on('add, delete' , function(event){            		
            		//find first uploaded
            		var firstUploaded = store.filter({ backend: true });
            		var firstUploadedPromises =firstUploaded.fetchRange({start: 0, end: 1})
            		
            		//find first uploading
            		var firstUploading = store.filter({ backend: undefined });
            		var firstUploadingPromises = firstUploading.fetchRange({start: 0, end: 1});
        		    
            		//join promises
            		all([firstUploadedPromises , firstUploadingPromises ]).then(function(results){
						//check if not exists one uploaded
	           			var isStoreEmpty = results[0].length==0;
	           			//check if exists one in uploading state
            			var isUploadingFile = results[1].length > 0;
            			
            			callFunction(!isStoreEmpty && !isUploadingFile);	            			
            		});
            	});
            	
        		uploadedFileModel.getInitialDefered().then(function(data){
           			callFunction(data.length>0);
            	});

            }
            
        }
    );
    
    // Create single instance of presenter
    var presenter = new PresenterDefinition();

    return presenter;
});