define([ "dojo/_base/declare", "../models/headerModel" ], function(declare,
		 model) {

	var headerPresenter = declare([], {

		getHeaderInfo : function (onCompleteAction){
			return model.getHeaderDataRequest().then(onCompleteAction);
		}
	});

	var presenter = new headerPresenter();
	return presenter;

})