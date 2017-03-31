define(["dojo/_base/declare", "../models/dialogContentModel", "dojo/topic"], function (declare, dialogContentModel , topic) {

	var showDialogTopic = 'application/show/dialog'
	
	var sequence = 0;
	
	var defaultIdentifier = "default";
		
    var DialogContentPresenter = declare([],{
    	
    		infoDialog : function(dialogName , objectData, useDefault){
    			this._pushDialog(dialogName , objectData, useDefault);
    		},
    		
    		warnDialog : function(dialogName , objectData, useDefault){
    			this._pushDialog(dialogName , objectData, useDefault);
    		},
    		
    		errorDialog : function(errorJson){    		    			
    			this._pushDialog(errorJson.error.name , errorJson, true);
    		},
    		
    		_pushDialog : function( dialogCategory , objectData, useDefault){
    			var dialogCategoryModel = this._getDialogCategoryModel(dialogCategory, useDefault)    			
    			
    			var configuration = dialogCategoryModel;
    			
    			if(dialogCategoryModel.idDefinitionProperty){
    				configuration = dialogCategoryModel.definitions[ eval("objectData."+dialogCategoryModel.idDefinitionProperty)];

    				if(!configuration){
    					configuration = dialogCategoryModel.definitions[defaultIdentifier];
    				}
    			}
    			
    			topic.publish(showDialogTopic , {configuration :  configuration, dialogData : objectData});
    		},
    		
    		_getDialogCategoryModel : function(dialogCategory, useDefault){
    			var configuration = dialogContentModel.getStore().get(dialogCategory)
    			
    			if(useDefault && !configuration){
    				configuration = dialogContentModel.getStore().get(defaultIdentifier)
    			}
    			return configuration;
    		},
    		
    		
    		subscribeNewDialog : function(action){
    			topic.subscribe(showDialogTopic , action);
    		}
    		
    		
    });

    var presenter = new DialogContentPresenter();

    return presenter;
});