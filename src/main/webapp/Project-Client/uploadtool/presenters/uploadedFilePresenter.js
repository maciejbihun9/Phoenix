define(["dojo/_base/declare" , "../models/uploadedFilesModel",  "./errorPresenter" , "dojo/promise/all", "dojo/request" ], function (declare, uploadedFileModel, errorPresenter, all, request) {

	var sequence = -1;		
	
	var store = uploadedFileModel.getUploadFileStore();
	
	var processUploadUrl = uploadedFileModel.getProcessUploadUrl();
	
	var filesWithoutMetadataUrl = uploadedFileModel.getFilesWithoutMetadataUrl();
        
    var validationInfoUrl = uploadedFileModel.getValidationInfoUrl();
	
	var applyUploadUrl =  uploadedFileModel.getApplyUploadUrl();
	
	
	//Declare presenter body
    var PresenterDefinition = declare([],{
    	
    	    applyUploadRequest : function(){
    	    	var promises = request(applyUploadUrl, {
                    handleAs: "json",
                    sync : false
                });
				promises.then(null, errorPresenter.handle);
				return promises;
    	    },
    	
    		processUploadToolOperationResource : function (){
    			var promises = request(processUploadUrl);
    			promises.then(null, errorPresenter.handle)
    			return promises;
    		},
    		
    		requestForValidation : function(){
                var promises = request(validationInfoUrl, {
                    handleAs: "json",
                    sync : true
                });
				promises.then(null, errorPresenter.handle);
				return promises;
    		},    
                
    		requestForFilesWithoutMetadata : function (){
    			var promises = request(filesWithoutMetadataUrl, {
                            handleAs: "json",
                            sync : true
                        });

				promises.then(null, errorPresenter.handle);
				return promises;
    		},
	    	//Method query all uploaded files asynchronous
			//
			//onLoadAction - is fired when we get response.
			getUploadedFiles : function(onLoadAction){
	            return store.fetch().then(onLoadAction , errorPresenter.handle);
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
            
            //Register action on event Uploading File Is Not Empty and All Files Are Uploaded value change
            //
            //Function is called with parameter boolean
            //when we are not uploading and store is not empty then callFunction is called with true
            //in other case with false. :)
            registerEventOnUploadedFileListIsNotEmptyAndAllFilesAreUploaded: function (callFunction){
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
            	
            	//getFetchStoredInBackendFilesDefered check if 
            	//defered returns some files from backend
        		uploadedFileModel.getFetchStoredInBackendFilesDefered().then(function(data){
           			callFunction(data.length>0);
            	});

            }
            
        }
    );
    
    // Create single instance of presenter
    var presenter = new PresenterDefinition();

    return presenter;
});