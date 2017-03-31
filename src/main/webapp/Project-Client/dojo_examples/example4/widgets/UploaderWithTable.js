//UploaderWithTable  -  widget to maintain multiple file loading with posibility to delete files and abort upload.
//
//Main object passed to widget is uploaderPresenter. 
//
//Uploader presenter should implement following method
//
//getUploadFileURL() - return url where uploader should send post with selected files
//
//getStore() - return store with data to present
//
//addUploadedFile(fileName) - method to create uploaded file in store
//
//addUploadingFiles(uploaderWidget) - method to create uploading files in store 
//									UploadedFile , UploadingFile are different object - 
//									UploadingFile is not uploaded on server yet, but UploadedFile is uploaded. :)
//
//removeFile(object)	- method to remove table row - method should recognize objects and make different logic for them  
//
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./template/UploaderWithTable.html",
    "dojo/on",
    
    "./Uploader",
        
    "dijit/form/Button",		
	"./UploaderProgressBar",
    "dgrid/OnDemandGrid"

], function (declare, lang, domConstruct, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
              on,  Uploader , Button, UploaderProgressBar, OnDemandGrid ) {
   
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        requiredCSS: [],
        name: "Upload with table",

        templateString: template,

        uploaderPresenter : null , 
        
        postCreate: function () {
            this.inherited(arguments);

            this._setupChildWidgets();            
        },
        
        //Create child widget or set parameters for child widgets
        _setupChildWidgets : function(){

        	this.recreateUploader();
            var self = this;
            
        	var grid = new OnDemandGrid({
                collection: self.uploaderPresenter.getStore(), // a dstore store
                showHeader: false,
                columns: {
						name: {		
							renderCell: lang.hitch(self , self._renderNameColumn)
						},
						progressBar : {
							renderCell: lang.hitch(self ,self._renderProgressBarColumn)
						},
						button: {														
							renderCell: lang.hitch(self ,self._renderDeleteButtonColumn)
						}             
                }
            }, this.grid );
        	
        	grid.startup();
        },
        
        
        //After each upload we need to recreate uploader
        //It is needed to correctly maintain multiple loading in the same time.
        //Problem was when we start uploading two big files starting one after one. Then 
        //when we monitor event 'progress' we can see there events from two different request
        //but it is not possible to recognize them. :( 
        //
        //So we recreate on the beggining of each uploading
        recreateUploader : function(){
        	//delete othere uploaders
        	domConstruct.empty(this.uploader);

        	//create new Uploader
        	this.currentUploader = new Uploader({url : this.uploaderPresenter.getUploadFileURL()});
        	//and put it to container
        	this.currentUploader.placeAt(this.uploader)
        	
        	//register event 
        	//
        	//on begin add item to list
        	//and recreate uploader
        	on(this.currentUploader, 'begin', lang.hitch(this, function(event){
        		 this.uploaderPresenter.addUploadingFiles(this.currentUploader); 
        		 this.recreateUploader();
        	}))
        	
            //startup uploader
        	this.currentUploader.startup();
        },
        
        //Method to create File name column in grid
        _renderNameColumn : function(object, value, node){
			//when it is uploading file
        	if(object.nameList){
				var construct = domConstruct.create("div", null , node);
				object.nameList.forEach(function(item){
					domConstruct.create("div", {innerHTML: item.name}, construct);
				})
			}
        	//when it is uploaded file
			else{
				domConstruct.create("div", { innerHTML: value }, node);
			}
		},
		
		//Method to create ProgressBar column in grid
		//
		//we render progress bar only for uploading files
		_renderProgressBarColumn : function(object, value, node){			
			var self = this;
			if(object.uploader){
				var onCompleteFunction = function(){
					self.uploaderPresenter.removeFile(object);
	        		
	        		object.nameList.forEach(function(item){
	        			self.uploaderPresenter.addUploadedFile(item.name);
	        		});
				};
				
				var progressBar = new UploaderProgressBar( {uploader : object.uploader , onComplete :  onCompleteFunction}, node.appendChild(document.createElement("div")));
				progressBar.startup();
			}
		},
		
		//Method to create Delete button column in grid
		_renderDeleteButtonColumn : function(object, value, node){
			var self = this; 
			var label = 'Remove' ;
			
			//when it is uploading file 
			if(object.uploader){
				label = 'Cancel';
			}
			
			new Button({label: label , onClick : function(){									
				//For uploading files 
				//we abort request and delete file from store				
				if(object.uploader){										
					object.uploader.xhr.abort();			
					self.uploaderPresenter.removeFile(object);
				} 
				//for uploaded file we simply delete file from store
				else {
					self.uploaderPresenter.removeFile(object);
				}
			}}, node.appendChild(document.createElement("div")) );
		}

    });
});