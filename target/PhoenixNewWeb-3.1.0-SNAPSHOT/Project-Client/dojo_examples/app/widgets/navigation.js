define([
    "dojo/_base/declare",
    "dijit/_TemplatedMixin",
    "app/utils/templateMixinWithCSS",
    "dojo/text!./template/navigation.html",
    "dojo/router"
], function(declare,  _TemplatedMixin, templateMixinWithCSS ,template , router) {
    return declare([templateMixinWithCSS, _TemplatedMixin], {
        templateString: template ,
        cssRequirements: [{cssFile:"/copymanager/Project-Client/app/widgets/css/navigation.css",mediaType:"screen"}],
        nextValue : null,
        backValue: null ,
        next: null,
        back: null,
        goNext: function(){
            router.go(this.next);
        },
        goBack: function(){
            router.go(this.back);
        }

    });

});