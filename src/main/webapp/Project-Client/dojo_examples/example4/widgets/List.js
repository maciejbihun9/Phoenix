define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/dom-construct",
    "dojo/text!./template/List.html"
], function (declare, lang,  _WidgetBase, _TemplatedMixin, domConstruct, template) {
    return declare([_WidgetBase, _TemplatedMixin], {

        itemWidgetFactory : null,
        templateString: template,

        refreshWithItemList : function(itemList){
            domConstruct.empty(this.innerTable);
            itemList.forEach(lang.hitch(this, function(item){
            	this.addItemToList(item);
            }));
        },
        addItemToList : function(item){
             this.itemWidgetFactory(item).placeAt(this.innerTable);
        }
    	
    });
});