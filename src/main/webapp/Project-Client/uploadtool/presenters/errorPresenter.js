//Error presenter definition
//
// handle - method is used to handle errors( i.e. from request communication) 
// getErrors - returns all collected errors. Can be used in errorView
// clearErrors - deletes all collected error
// subscribeChanges - register change lister
define(["dojo/_base/declare", "../models/errorModel", "./dialogContentPresenter", "dojo/topic"], function (declare, errorModel , dialogContentPresenter ,topic) {

	var newErrorTopic = 'application/error/new'
	
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
    			dialogContentPresenter.errorDialog(json);
    		},    	
    	
    		getErrors : function(){
    			return errorModel.getStore().query({});
    		},
    		
    		
    		subscribeNewErrors : function(action){
    			topic.subscribe(newErrorTopic , action);
    		}

    		
        }
    );

    var presenter = new ErrorPresenter();

    return presenter;
});