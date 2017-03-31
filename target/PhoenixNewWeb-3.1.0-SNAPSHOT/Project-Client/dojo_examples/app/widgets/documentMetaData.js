define([
    "dojo/_base/declare",
    "dijit/_TemplatedMixin",
    "app/utils/templateMixinWithCSS",
    "dojo/text!./template/documentMetaData.html",
    "dojo/router"
], function(declare,  _TemplatedMixin, templateMixinWithCSS ,template , router) {
    return declare([templateMixinWithCSS, _TemplatedMixin], {
        templateString: template ,
        cssRequirements: [],
        metaData: {}
    });

});