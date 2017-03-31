//View to handle main page layout
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./template/MainPageLayoutView.html",
    "dijit/layout/ContentPane",
    "../presenters/errorPresenter",
    //in template
    "dijit/layout/BorderContainer"
], function (declare, lang,  array, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, ContentPane , errorPresenter) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    	templateString: template ,

    	//Layout configuration
    	//which regions should be configured
    	top: false,
    	right: false,
    	center: false,
    	left: false,
    	bottom: false,
    	
    	//Regions content pane holders
    	_topContainer: null,
    	_rightContainer: null,
    	_centerContainer: null,
    	_leftContainer: null,
    	_bottomContainer: null,
		
    	
    	buildRendering : function(){
    		this.inherited(arguments);    		
    		this._createContainers();    		    		
    	},    	
    	
    	//Method creates layout containers according to layout setting
    	_createContainers : function(){
    		this._topContainer = this._createContainer(this.top, 'top' , 'padding: 0px');
    		
    		this._leftContainer = this._createContainer(this.left, 'left');
    		this._centerContainer = this._createContainer(this.center, 'center');
    		this._rightContainer = this._createContainer(this.right, 'right');
    		
    		this._bottomContainer = this._createContainer(this.bottom, 'bottom' , 'padding: 0px');
    	},
    	
    	//Methods creating and setup layout containers
    	//
    	//create - boolean - should be container be created
    	//region - string - where container should be placed
    	//style - string - additionall styles - default empty    	
    	_createContainer: function(create , region , style){
    		var container = null;
    		if(create){
    			container = new ContentPane({region: region , style : style});
    			this.layoutContainer.addChild(container);

    		}
    		return container;
    	},
    	
    	// Views setters    	
    	setHeader : function(headerView, remove){
    		this._setChildViewToContainer(this._topContainer, headerView, remove );    		
    	},
    	
    	setFooter : function(footerView, remove){
    		this._setChildViewToContainer(this._bottomContainer, footerView, remove );    		
    	},

    	setCenter : function(centerView, remove){
    		this._setChildViewToContainer(this._centerContainer, centerView, remove );   		
    	},
    	
    	setLeft :  function(leftView, remove){
    		this._setChildViewToContainer(this._leftContainer, leftView, remove );    		
    	},
    	
    	setRight : function(rightView, remove){
    		this._setChildViewToContainer(this._rightContainer, rightView, remove );
    		
    	},
    	
    	//Set view in content pane
    	//If remove == true - we remove all existing views in center content pane.
    	//
    	//when we try to put view to not existing container
    	//error is pushed to errorPresenter
    	_setChildViewToContainer : function(container, view, remove){
    		if(container){
	    		if(remove){    			
	    			array.forEach(container.getChildren(),  function(widget){
	    				container.removeChild(widget);
	    			});
	    		}
	    		container.addChild(view);
    		}
    		else{
    			errorPresenter.handle(new Error('View cannot be added to missing container'));
    		}
    	},
    	
    	//Startup child widgets
    	startup: function(){
    		this.inherited(arguments);
    		this.layoutContainer.startup();
    	}
    });
});