//Model to store unexprected errors
//
define(["dojo/_base/declare", "dojo/store/Memory"], function (declare, Memory ){
	//define simple memory storage 
	//errors will be not send to Backend
	var errorStore =  new Memory();
	
    var ErrorModel = declare([],{
    		
    		getStore : function(){
    			return errorStore;
    		}
        } 
    );

    var model = new ErrorModel();

    return model;
});