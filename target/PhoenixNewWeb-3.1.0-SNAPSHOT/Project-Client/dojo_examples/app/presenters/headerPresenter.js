define([ "dojo/_base/declare", "../models/headerModel" ], function(declare,
		 model) {

	var headerPresenter = declare([], {

		getHeaderInfo : function (){
			return model.headerData ;
		}
		
	});

	var presenter = new headerPresenter();
	return presenter;

})