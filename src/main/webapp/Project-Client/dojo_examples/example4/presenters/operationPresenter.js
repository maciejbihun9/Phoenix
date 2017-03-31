define(["dojo/_base/declare" ,"../models/operationModel" ,  "./errorPresenter", "dojo/_base/config"], function (declare, operationModel, errorPresenter , config) {

	//Declare presenter body
    var PresenterDefinition = declare([],{
    		
    		//Method returns current operation
    		//operation id is taken from config.app.operationId
    		//
    		//onLoadAction - is fired when we get response.
    		getCurrentOperation : function(onLoadAction){
    			operationModel.getRestStore().fetchItemByIdentity({identity: config.app.operationId , onItem: onLoadAction , onError: errorPresenter.handle });
            }
        }
    );
    // Create single instance of presenter
    var presenter = new PresenterDefinition();

    return presenter;
});