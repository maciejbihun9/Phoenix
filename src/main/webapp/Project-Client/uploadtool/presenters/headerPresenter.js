define([ "dojo/_base/declare", "./errorPresenter", "../models/headerModel" ], function(declare,errorPresenter,
		 model) {

	var headerPresenter = declare([], {

		getHeaderInfo : function (onCompleteAction){
			return model.getHeaderDataRequest().then(onCompleteAction, errorPresenter.handle);
		}
	});

	var presenter = new headerPresenter();
	return presenter;

})