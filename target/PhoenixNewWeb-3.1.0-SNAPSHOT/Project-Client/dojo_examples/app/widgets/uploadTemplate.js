define([
    "dojo/_base/declare",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "app/utils/templateMixinWithCSS",    
	"dojo/dom-class",
	"dijit/ProgressBar",
    "dojo/text!./template/uploadTemplate.html",
    "dojox/form/Uploader"
], function(declare, _TemplatedMixin,_WidgetsInTemplateMixin, templateMixinWithCSS , domClass, ProgressBar ,template) {
    return declare([templateMixinWithCSS, _TemplatedMixin , _WidgetsInTemplateMixin], {
        templateString: template ,
        cssRequirements: [{ cssFile : '/copymanager/Project-Client/dojo-1.10.4/dojox/form/resources/UploaderFileList.css'}]	,
        currentProgressBar : null,
        postCreate: function(){
        	this.inherited(arguments);
        	this.connect(this.uploader, "onProgress", "_progress");
        	this.connect(this.uploader, "onBegin", "_addNode");
        	this.connect(this.uploader, "onComplete", "_moveProgressBar");
        	this.uploader.startup();
        	this.currentProgressBar
        },
        _progress: function(_b) {        
        	this.currentProgressBar.set("value" , _b.percent );
        },
        _addNode: function(node){        
        	console.log("MPTest", node)
        	var c, r = this.listNode.insertRow(-1);			
			c = r.insertCell(-1);
			domClass.add(c, "dojoxUploaderIcon");
			c.innerHTML = node[0].name;
			c = r.insertCell(-1);
			domClass.add(c, "dojoxUploaderFileName");
			this.currentProgressBar = new ProgressBar(null, c);
						
        },
        _moveProgressBar: function(){        	
        	this.currentProgressBar.destroy();
        	this.progressBar.placeAt(this.hiddenContainer);
        	console.log(this.uploader.getFileList());
        }
        
    	
    });
});