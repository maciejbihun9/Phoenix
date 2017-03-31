define([
    "dojo/_base/declare",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_WidgetBase",
    "dojo/text!./template/myTree.html",
    "dojo/store/JsonRest",
    "dijit/tree/ObjectStoreModel",
    "dijit/layout/BorderContainer",
    "dijit/Tree",
    "dijit/layout/ContentPane"
], function(declare, _TemplatedMixin, _WidgetsInTemplateMixin, _WidgetBase , template) {
    return declare([_WidgetBase, _TemplatedMixin , _WidgetsInTemplateMixin], {
        templateString: template ,
        startup: function(){
            this.inherited(arguments);   
            this.border.startup();  
        }
    })
});