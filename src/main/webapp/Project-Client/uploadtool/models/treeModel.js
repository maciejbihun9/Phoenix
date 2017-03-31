define(["dojo/_base/declare", "dojo/_base/config", "dojo/store/JsonRest", "dijit/tree/ObjectStoreModel"], function (declare, config, JsonRest, ObjectStoreModel) {

    var targetURL = 'rest/uploadtool/operation/' + config.app.operationId + '/getOperationChildTreeNode/';

    var treeStore = new JsonRest({
        target: targetURL,
        getChildren: function (parent, options) {
            return this.get(parent.id).then(function (fullObject) {
                return fullObject.children;
            });
        }
    });

    var TreeModel = declare([], {
        getTreeModel: function () {
            return new ObjectStoreModel({
                store: treeStore,
                getRoot: function (onItem, onError) {
                    this.store.get(-1).then(onItem, onError);
                },
                mayHaveChildren: function (object) {
                    return object.nodeType === "S";
                }
            });
        }
    });

    var treeModel = new TreeModel();
    return treeModel;
});