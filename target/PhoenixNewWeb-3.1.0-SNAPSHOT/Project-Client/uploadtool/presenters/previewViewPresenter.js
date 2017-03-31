define([
    "dojo/_base/declare",
    "../models/treeModel"
], function (declare, treeModel) {

    var PreviewViewPresenterPresenter = declare([],
            {
                getTreeModel: function () {
                    return treeModel.getTreeModel();
                }
            });

    var presenter = new PreviewViewPresenterPresenter();

    return presenter;
});