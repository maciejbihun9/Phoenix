define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./template/UploadedFileListItem.html",
    "dojo/topic"
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, topic) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        removeTopic : '',
        data : null,
        templateString: template,
        remove: function(e){
            topic.publish(this.removeTopic, this.data);
        }
    });
});