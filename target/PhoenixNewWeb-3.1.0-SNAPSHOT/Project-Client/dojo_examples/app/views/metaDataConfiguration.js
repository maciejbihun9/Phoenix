define([
    "dojo/_base/declare",
    "app/utils/templateMixinWithCSS",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./template/metaDataConfiguration.html",
    "../widgets/navigation",
    "dojo/store/JsonRest",
    "dijit/tree/ObjectStoreModel",
    "dijit/layout/BorderContainer",
    "dijit/Tree",
    "dijit/layout/ContentPane",
    
    "../widgets/documentMetaData"
], function(declare, templateMixinWithCSS ,_TemplatedMixin , _WidgetsInTemplateMixin, template , navigation){
    return declare([templateMixinWithCSS, _TemplatedMixin , _WidgetsInTemplateMixin], {
        requiredCSS: [{cssFile:"/copymanager/Project-Client/dojo-1.10.4/dijit/themes/claro/claro.css"}],
        name: "TagViews",
        templateString: template,
        postCreate: function(){
            this.inherited(arguments);
            new navigation({next : "/final" , nextValue: "Apply upload" , back: "/main" , backValue: "Back"} , this.navigation);
            this.border.startup();        	
        }
    });
});