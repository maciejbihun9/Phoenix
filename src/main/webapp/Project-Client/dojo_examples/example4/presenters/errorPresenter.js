//Error presenter definition
//
// handle - method is used to handle errors( i.e. from request communication) 
// getErrors - returns all collected errors. Can be used in errorView
// clearErrors - deletes all collected error
// subscribeChanges - register change lister
define(["dojo/_base/declare", "../models/errorModel", "dojo/topic"], function (declare, errorModel , topic) {

	var errorStoreChangeTopic = 'application/error/change'
	
	var sequence = 0;
		
    var ErrorPresenter = declare([],{
    	
    		handle : function(errorData){
    			var json = {    					
    					id  : sequence++ ,
    					time : new Date(),
    					error : errorData
    					
    			}
    			errorModel.getStore().add(json);    	
    			console.error('handle' , json);
    			topic.publish(errorStoreChangeTopic , null);
    		},    	
    	
    		getErrors : function(){
    			return errorModel.getStore().query({});
    		},
    		
    		clearErrors : function(){
    			this.getErrors().forEach(function(item){
    				errorModel.getStore().remove(item.id)
    			})
    			topic.publish(errorStoreChangeTopic , null);
    		} ,
    		
    		subscribeChanges : function(action){
    			topic.subscribe(errorStoreChangeTopic , action);
    		}

    		
        }
    );

    var presenter = new ErrorPresenter();

    return presenter;
});