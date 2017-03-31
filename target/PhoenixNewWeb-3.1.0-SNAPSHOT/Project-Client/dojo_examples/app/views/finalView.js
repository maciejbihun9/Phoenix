define([
    "dojo/_base/declare",
    "app/utils/templateMixinWithCSS",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./template/finalView.html",
    "../widgets/navigation"
], function(declare, templateMixinWithCSS ,_TemplatedMixin , _WidgetsInTemplateMixin, template , navigation){
    return declare([templateMixinWithCSS, _TemplatedMixin , _WidgetsInTemplateMixin], {
        requiredCSS: [{cssFile:"/copymanager/Project-Client/dojo-1.10.4/dijit/themes/claro/claro.css"}],
        name: "TagViews",
        templateString: template,
        postCreate: function(){
            this.inherited(arguments);
            new navigation( {next : "/main" , nextValue: "Confirm" , back: "/metaData", backValue: " Back"} , this.navigation);                    	
        }
    });
});