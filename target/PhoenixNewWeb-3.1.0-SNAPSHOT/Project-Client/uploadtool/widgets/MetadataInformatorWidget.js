define([
    "dojo/_base/declare",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetBase",
    "dijit/_WidgetsInTemplateMixin",
    "../presenters/dialogContentPresenter",
    "dojo/on",
    "dojo/dom",
    "dojo/router",
    "dojo/domReady!"
], function (declare, _TemplatedMixin, _WidgetBase, _WidgetsInTemplateMixin, dialogContentPresenter, on, dom, router, domReady) {
    
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        readMoreButton : "readMoreButton",
        
        buildRendering: function () {
        	this._onReadMoreButtonClick();
        },
        
        _onReadMoreButtonClick : function(){
        	var self = this;
        	on(this.readMoreButton, "click", function () {
        		console.log("read more btn works");
        		self._showReadMoreDialog();
            });
        },
        
        _showReadMoreDialog : function(){
			var self = this;
			var data = ""
			 dialogContentPresenter.infoDialog("MetadataReadMore",
					 {message : self._prepareInformationMessage(data, ", ")});
        },
        
        _prepareInformationMessage : function(listOfMessages, separator){
            var message = "";
            for (var i=0 ; i < listOfMessages.length ; i++) {
                message += listOfMessages[i] + separator;
            }                
            return message;
        },
        
    });
});
