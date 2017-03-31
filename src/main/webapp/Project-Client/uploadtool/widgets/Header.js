define([
    "dojo/_base/declare",    
    "dijit/_TemplatedMixin",
    "dijit/_WidgetBase",
    "dojo/text!./template/Header.html"
], function(declare,  _TemplatedMixin, _WidgetBase ,template) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template ,
        cssRequirements: [{cssFile:"/copymanager/Project-Client/app/widgets/css/Header.css",mediaType:"screen"}],
        title : "basicTitle",
        version: "basicVersion",
        revision: "basicRevision",
        timestamp: "basicTimestamp"       
    });

});