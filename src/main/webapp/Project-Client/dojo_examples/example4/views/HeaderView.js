define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./template/HeaderView.html",
    "../widgets/Header",
    "../presenters/headerPresenter"

], function(declare, _WidgetBase ,_TemplatedMixin , _WidgetsInTemplateMixin, template , header, headerPresenter){
    return declare([_WidgetBase, _TemplatedMixin , _WidgetsInTemplateMixin], {
    	requiredCSS: [],
        name: "Header View",
        templateString: template,
        buildRendering : function(){
            this.inherited(arguments);
            var self = this;
            headerPresenter.getHeaderInfo(function(data){
            	new header(data , self.header);
            });
        }

    });
});