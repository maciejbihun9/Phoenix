define([
    "dojo/_base/declare",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetBase",
    "dojo/text!./template/navigation.html",
    "dojo/router"
], function(declare,  _TemplatedMixin, _WidgetBase ,template , router) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template ,
        nextValue : null,
        backValue: null ,
        next: null,
        back: null,
        postCreate: function(){
        	this.inherited(arguments);
        	console.log("nextDiv" , this.nextDiv);
        	console.log("backDiv" , this.backDiv);
        	
        },        
        goNext: function(){
            console.log("ON next")
        },
        goBack: function(){
        	console.log("ON back")
        }

    });

});