define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/Destroyable",
    "dojo/text!./template/ErrorListItem.html"    
    
], function (declare, lang, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Destroyable, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ,Destroyable], {
        templateString: template,
        data : null        
    });
});