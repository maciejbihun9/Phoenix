define(["dojo/_base/declare" ,"dojox/data/JsonRestStore" , "dojo/_base/config"], function (declare, JsonRestStore , config) {
	
    var targetURL = 'rest/uploadtool/operation/';
    var idAttribute = 'id';
    
    //idAttribute - represents which field of json should be tread as id 
    //				and will be put in some Rest request i.e. DELETE
    var jsonRestStoreInstance = new JsonRestStore({
            target : targetURL,
            idAttribute: idAttribute
    });

    //Simple model definition
    var ModelDefinition = declare([],{
    		
    		getTargetURL : function(){
    			return targetURL;
    		},
    	
            getRestStore : function(){
                return jsonRestStoreInstance;
            }
        }
    );

    var model = new ModelDefinition();

    return model;
});