define([
    "dojo/_base/declare",
    "dojox/form/Uploader"
], function(declare, Uploader ) {
    return declare([Uploader], {
        xhr : null ,
        enctype: 'multipart/form-data',
        type: 'file',
        name: 'file',
        multiple: true,
        label: 'Browse',
        uploadOnSelect: true,
        force: 'html5',
        url : '',
        method: 'POST',
    	createXhr : function(){
    		this.xhr = this.inherited(arguments);    	
    		console.log('createXhr' , this.xhr);
    		return this.xhr;
    	}
    });
});