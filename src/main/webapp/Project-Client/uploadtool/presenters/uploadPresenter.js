define([ "dojo/_base/declare", "./errorPresenter", "../models/uploadModel" ], function(declare,errorPresenter,
		 model) {

	var uploadPresenter = declare([], {

		getUploadProgres : function (onCompleteAction){
			return model.getUploadProgres().then(onCompleteAction, errorPresenter.handle);
		}
	});

	var presenter = new uploadPresenter();
	return presenter;

})