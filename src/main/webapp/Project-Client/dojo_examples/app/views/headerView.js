define([
    "dojo/_base/declare",
    "app/utils/templateMixinWithCSS",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./template/headerView.html",
    "../widgets/header",
    "../presenters/headerPresenter"

], function(declare, templateMixinWithCSS ,_TemplatedMixin , _WidgetsInTemplateMixin, template , header, headerPresenter){
    return declare([templateMixinWithCSS, _TemplatedMixin , _WidgetsInTemplateMixin], {
    	requiredCSS: [],
        name: "Header View",
        templateString: template,
        postCreate: function(){
            this.inherited(arguments);
            new header(headerPresenter.getHeaderInfo(), this.header);

        }

    });
});