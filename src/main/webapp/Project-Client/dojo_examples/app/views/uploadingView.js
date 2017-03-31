define([
    "dojo/_base/declare",
    "app/utils/templateMixinWithCSS",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./template/uploadingView.html",
    "../widgets/navigation",
    "../widgets/uploadTemplate",
    "dojox/form/Uploader",
    "dijit/form/Button"
], function(declare, templateMixinWithCSS ,_TemplatedMixin , _WidgetsInTemplateMixin, template , navigation){
    return declare([templateMixinWithCSS, _TemplatedMixin , _WidgetsInTemplateMixin], { 
    	requiredCSS: [],
        name: "TagViews",
        templateString: template,
        postCreate: function(){

            this.inherited(arguments);
            new navigation( {next : "/metaData" , nextValue: "Preview" , back: null} , this.navigation);

        }
    });
});