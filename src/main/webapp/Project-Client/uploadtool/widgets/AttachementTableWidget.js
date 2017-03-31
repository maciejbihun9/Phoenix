define([
    "dojo/_base/declare",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetBase",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./template/AttachementTableWidget.html",
    "dgrid/OnDemandGrid",
    'dstore/RequestMemory',
    "dstore/Memory"
], function (declare, _TemplatedMixin, _WidgetBase, _WidgetsInTemplateMixin, template, OnDemandGrid, RequestMemory, Memory) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        attachements: [],
        constructor: function (data) {
            this.attachements = data;
        },
        postCreate: function () {
            this._setupTable();
        },
        _setupTable: function () {
            var attachementGridTable = new OnDemandGrid({
                collection: new RequestMemory(new Memory({data: this.attachements, idProperty: "name"})),
                columns: {
                    name: "Filename"
                },
                loadingMessage: 'Loading attachements...',
                noDataMessage: 'No attachements'
            }, this.attachementGridTableContainer);
            attachementGridTable.startup();
        }
    });
});