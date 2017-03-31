define([ "dojo/_base/declare",
		"../presenters/dialogContentPresenter",		
		"dijit/Dialog"
		

], function(declare, dialogContentPresenter,  Dialog) {

	return declare([ ], {
		name : "Dialog view",
		 

		registerDialogEvent : function() {
			var self = this;
			dialogContentPresenter.subscribeNewDialog(function(data) {
				
				var configuration = data.configuration;
				var dialogData = data.dialogData;
				console.log("subscribeNewDialog " , configuration);
				var listOfArgs = self._prepareListOfArgs(dialogData,
						configuration.dialogProperties);				
				
				var errorDialog = new Dialog({
					closable :configuration.closeAble,
					title : configuration.dialogTitle,
					content : self._formatString(configuration.dialogContent, listOfArgs)
				});
				errorDialog.show();
			});
		},

		_prepareListOfArgs : function(dialogData, dialogProperties) {
			var result = []
			for ( var i in dialogProperties) {
				result.push(eval("dialogData." + dialogProperties[i]));
			}
			return result;
		},

		_formatString : function(string, listOfArgs) {
			var formatted = string;
			for (var i = 0; i < listOfArgs.length; i++) {
				var regexp = new RegExp('\\{' + i + '\\}', 'gi');
				formatted = formatted.replace(regexp, listOfArgs[i]);
			}
			return formatted;
		}

	});
});