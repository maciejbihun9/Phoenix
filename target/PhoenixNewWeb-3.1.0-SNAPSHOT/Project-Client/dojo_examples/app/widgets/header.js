define([
    "dojo/_base/declare",    
    "dijit/_TemplatedMixin",
    "app/utils/templateMixinWithCSS",
    "dojo/text!./template/header.html"
], function(declare,  _TemplatedMixin, templateMixinWithCSS ,template) {
    return declare([templateMixinWithCSS, _TemplatedMixin], {
        templateString: template ,
        cssRequirements: [{cssFile:"/copymanager/Project-Client/app/widgets/css/header.css",mediaType:"screen"}],
        title : "basicTitle",
        version: "basicVersion",
        revision: "basicRevision",
        timestamp: "basicTimestamp"       
    });

});