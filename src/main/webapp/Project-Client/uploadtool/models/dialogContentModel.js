//Model to store dialog content
//
//
//	Dialog content model - stores configuration to create dialogs.
//
//	Structure of dialogContentModel.json:
//	
//		-Simple dialog content
//			{		
//			 	"dialogCategory" :"CategoryName",
//				"dialogTitle" : "Displayed title",
//				"dialogContent" : "Displayed content ( can contains placeholders {0}. {1})",
//				"dialogProperties" : ["propertiesOfDialogData" ]  
//			 }
//			 
//		 	- dialogCategory - (i.e. RequestError) using this we specify witch definition will be displayed
//		 	- dialogTitle - displayed dialog title
//		 	- dialogContent - displayed dialog content. Can contains place holders {0}{1} and will be replaced using values calculated using 'dialogProperties'
//		 	- dialogProperties - optional . Properties to calculate and use it for placeholders. :)
//	
//	 	- Complex dialog content
//	 	
//	 		{
//				"dialogCategory" : "CategoryName",
//				"idDefinitionProperty" : "property.to.split.for.single.category",		
//				"definitions" : {
//					"possibleValueOfIdDefinitionProperty" : @SimpleDialogContentJson,
//					"default" : @SimpleDialogContentJson		
//				}
//			}
//			- dialogCategory - the same as in Simple dialog content
//			- idDefinitionProperty - property to specify submodel for object. For example dialogCategory: "RequestBody"  and we want to display
//									other dialog for different response body or response Code. We calcualte value of idDefinitionProperty and using this value 
//									we take definition from property definitions.
//			- definitions - map  possibleValue -> Simple dialog content model . If values is not mapped takes default value
//
//
define(["dojo/_base/declare", "dojo/store/Memory",	"dojo/text!./conf/dialogContentModel.json" , "dojo/json"], function (declare, Memory, conf, JSON){

	//define simple memory storage
	var dialogContentStore =  new Memory({idProperty: "dialogCategory"});
	
	//Load all dialog contents from 
	//JSON configuration file.
	//It is readable when it is in separate file. :) 
	var dialogContentList = JSON.parse(conf);	
	for(var i in dialogContentList){
		dialogContentStore.add(dialogContentList[i]);
	}


	var DialogContentModel = declare([],{
    		getStore : function(){
    			return dialogContentStore;
    		}
        } 
    );

    var model = new DialogContentModel();

    return model;
});