define([
    "dojo/_base/declare",
    "dijit/Tree"
], function (declare, Tree) {

    return declare([Tree], {
        id: null,
        model: null,
        openOnClick: true,
        showRoot: false,
        persist: true,
        baseClass: 'myTreeClass',
        getIconClass: function (object, opened) {
            switch (object.nodeType) {
                case "D":
                    return "iconDocument";
            }
            return opened ? 'dijitFolderOpened' : 'dijitFolderClosed';
        },
        getLabelClass: function (object, opened) {
            var validClass = !object.valid ? "notValid" : "";
            var newVersionClass = object.newVersion ? "newVersion" : "";
            return validClass + " " + newVersionClass;
        }
    });
});