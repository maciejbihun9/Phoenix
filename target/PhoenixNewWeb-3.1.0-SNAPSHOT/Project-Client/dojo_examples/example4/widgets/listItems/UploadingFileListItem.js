define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/Destroyable",
    "dojo/text!./template/UploadingFileListItem.html",
    "dojo/on",
    "dojo/topic",
    //in template
    "dijit/ProgressBar"
], function (declare, lang, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Destroyable, template, on, topic) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ,Destroyable], {
        onCompleteTopic : '',
    	uploader : null,
        fileNames : '',
        templateString: template,
        buildRendering : function(){        	
        	this.prepareFileNames();
        	this.own(
	        	on(this.uploader, 'progress', lang.hitch(this, function(event){        		
	        		this.progressBar.set("value" , event.percent);	        		
	        	})),	        	
	        	on(this.uploader, 'complete', lang.hitch(this, function(event){
	        		this.destroy();
	            	topic.publish(this.onCompleteTopic, []);
	        	}))
        	);        	
        	this.inherited(arguments);
        },        
        prepareFileNames : function(){
        	var self = this;
        	this.uploader.getFileList().forEach(function(item){
        		console.log(item)
        		if(self.fileNames!='')
        			self.fileNames=self.fileNames + ',';
        		self.fileNames=self.fileNames + item.name ;
        	})
        },        
        _uploadCompleted : function(){
        	this.destroy();
        	topic.publish(this.onCompleteTopic);
        },        
        cancel: function(e){        	
        	this.uploader.xhr.abort();
        	this.destroy();
        }
    });
});