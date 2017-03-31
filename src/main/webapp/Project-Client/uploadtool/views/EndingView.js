define([
    "dojo/_base/declare", 
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./template/EndingView.html",


], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {

   
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    	
    	templateString: template,
    	buildRendering: function () {
        	this.inherited(arguments);
        },
        
        onShow : function(){
        	this.resize();
        },
       
        resize: function () {
        	//It is important!!!!
        	//when we use Layout container inside widget template
            //this.cont.resize(arguments);
            this.inherited(arguments);
        }

    });
});