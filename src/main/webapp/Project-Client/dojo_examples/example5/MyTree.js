define([
    "dojo/_base/declare",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_WidgetBase",
    "dojo/text!./template/myTree.html",
    "dijit/Tree",
    "dojo/store/JsonRest",
    "dijit/tree/ObjectStoreModel",
    "dojo/topic",
    "dijit/layout/BorderContainer",    
    "dijit/layout/ContentPane",
    "dijit/form/Button"
], function(declare, _TemplatedMixin, _WidgetsInTemplateMixin, _WidgetBase , template, Tree, JsonRest ,ObjectStoreModel, topic) {
    return declare([_WidgetBase, _TemplatedMixin , _WidgetsInTemplateMixin], {
        templateString: template ,
        postCreate: function(){
        	this.inherited(arguments);
        	var self= this;
         	topic.subscribe("/tree/valid/", function(data){
        		var object_id = data.object_id;
        		var validated = data.validated ;        	
        		console.log("/tree/valid/", data);
        		if(object_id){
	        		var node = self.myTree.getNodesByItem(""+object_id);
	        		
	        		console.log("node", node);
	        		node[0].setValid(validated);
        		}
        	});
        	
        	
        	this.treeViewStore = new JsonRest({
        		target:'rest/filesystem/tree',
        		getChildren: function(object){
                    return this.get(object.id).then(function(fullObject){
                         return fullObject.children;
                     });
        		}
        	})
        	
        	this.myModel = new ObjectStoreModel({store:this.treeViewStore,
        		getRoot : function(onItem){
        			this.store.get("-1").then(onItem);    
        		}});
        	
        	
        	var MyNode = declare(Tree._TreeNode, {
        		
        		setNewLabel : function(label){
        			this._setLabelAttr(label);
        		},
        		
        		setValid : function(valid){
        			console.log("valid" , valid );
        			valid = valid != undefined && valid ; 
        			console.log("valid" , valid );
        			console.log("this.item.validated" , this.item.validated);
        			if(valid!=this.item.validated){
	        			this.item.validated = valid;
	        			this._updateItemClasses(this.item);
	        			if(!valid){
	        				topic.publish("/tree/valid/", {object_id : this.item.parentId, validated: false});
	        			}else{
	        				var parentValid = true;
	        				var childs = this.getParent().getChildren();
	        				for(var index in childs){
	        					var child=childs[index];
	        					if(child.getValid()!=undefined && !child.getValid()){
	        						parentValid = false;
	        					}
	        				
	        				}
	        				console.log(this.getParent());
	        				
	        				topic.publish("/tree/valid/", {object_id : this.item.parentId, validated: parentValid});
	        				
	        			}
        			}
        		},
        		
        		getValid : function(){
        			return this.item.validated;
        		}
        		
        		
        	});
        	
        	
		     var MyTree = declare(Tree, {
    			  _createTreeNode: function(args) {
    					return new MyNode(args);
    				},
    				getLabelClass: function(object, opened){
                        var validated = object.validated == false ? "notValidated" : "" ;
                        console.log("getLabelClass" , validated); 
                        return validated;
                    },
                    
                    postCreate: function(){
                    	this.inherited(arguments);
                   
                    }
    		  });
        	
        	this.myTree = new MyTree({model: this.myModel,openOnClick:false,showRoot:false} , this.tree);
        },
        
        changeLabel: function(){
        	console.log("this ", this);
        	var tree = this.myTree;
      
    		
    		var object = tree.selectedItem;
    		console.log("before object " , object);
    		object.name ="Test"
    		
   			console.log("afret object " , object);
    		var treeNode = tree.getNodesByItem(object);        		
    		console.log("test " , treeNode)        		
    		
    		treeNode[0].setNewLabel("xxxxxxxxxx");
    		
    		console.log("Parent " , treeNode[0].getParent());
        	
        },
        changeValid: function(){
        	console.log("ON CLICK!!!!!!!!");
        	var tree = this.myTree;
        	
        	var object = tree.selectedItem;
        	
        	var treeNode = tree.getNodesByItem(object);
        	
        	var node = treeNode[0]
        	console.log(node.getValid());
        	
        	topic.publish("/tree/valid/", {object_id : object.id , validated: !node.getValid()});
        	
        },
        
        startup: function(){
            this.inherited(arguments);   
            this.border.startup();
            
        }
    })
});