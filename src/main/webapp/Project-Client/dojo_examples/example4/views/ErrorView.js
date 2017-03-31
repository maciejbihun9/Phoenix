//Simple view with list of occured errors
//
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./template/ErrorView.html",
    
    "../widgets/listItems/ErrorListItem",
    "../presenters/errorPresenter",
    //in template
    "../widgets/List"
    

], function (declare, lang, domConstruct, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, ErrorListItem , errorPresenter) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        name: "Error list item",
        templateString: template,

        postCreate: function () {
            this.inherited(arguments);
            this.setupChildWidgets();
        },
        
        //Create child widget or set parameters for child widgets
        setupChildWidgets : function(){
            this.errorList.set('itemWidgetFactory', lang.hitch(this, this._errorListItemFactory));        
            errorPresenter.subscribeChanges(lang.hitch(this, this.reloadErrors))
        },
        
        reloadErrors : function(){        	
             this.errorList.refreshWithItemList(errorPresenter.getErrors());            
        },

        clear : function(){
        	errorPresenter.clearErrors();
        },

        _errorListItemFactory : function(data){
            return new ErrorListItem({data : data });
        }
        


    });
});