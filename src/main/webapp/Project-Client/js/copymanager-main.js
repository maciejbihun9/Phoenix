require([
    "dojo/parser", "dojo/on", "dijit/registry", "dojo/aspect", "dijit/layout/TabContainer", "dijit/layout/ContentPane",
    "dojox/grid/EnhancedGrid", "dojox/grid/enhanced/plugins/Pagination", "dojox/grid/enhanced/plugins/IndirectSelection",
    "dojox/grid/enhanced/plugins/GridSource", "dojox/data/JsonRestStore", "dojo/dnd/Source", "dojo/_base/array",
    "dojo/store/Observable", "dojox/grid/enhanced/plugins/DnD", "dojox/grid/enhanced/plugins/Selector",
    "dojo/request/xhr", "dojo/_base/connect", "dijit/form/Button", "dojo/dom-style", 
    "dojox/collections/ArrayList", "dojo/ready", "dojo/domReady!"],
            
    function(parser, on, registry, aspect, TabContainer, ContentPane, EnhancedGrid, Pagination, IndirectSelection,
            GridSource, Source, JsonRestStore, array, Observable, DnD, Selector, xhr, connect, Button, domStyle, arrayList, ready) {
		console.log("copymanager-main.js start");
        ready(function(){
        
        var filesystemStore = new dojox.data.JsonRestStore({
            identifier: 'id',
            target: 'rest/filesystem/folderdetail'
        });
        
        var fmtImage = function(cellValue, rowIndex, object)  {
            var type = cellValue;
            var bussinessAdmin = filesystemGrid.getItem(rowIndex).bussinessAdmin;
            
            if(filesystemGrid.getItem(rowIndex).parentId != null || type === 'D'){
                bussinessAdmin = true;
            }
            
            var IconClass = !bussinessAdmin ? ' dijitGridImageDisabled dijitGridImageDisabledIcon' + type :'';
            
            return new dijit.form.Button ({
                iconClass:'dijitPhoenixToolbarIcon dijitPhoenixToolbarIcon'+ type + IconClass,
                showLabel:false,
                disabled:!bussinessAdmin,
                label:(type=='M'?'Master folder':type=='S'?'Slave folder':'Document')
            })
        };
        
        var pane = registry.byId("middleFrameTabs");
        var bussinessAdmin;
        
        // Copy Manager introduction info. Shown in the middle window as a tab. 
		pane.addChild(new ContentPane({
			title: 'Copy Manager Introduction',
			href: "copyManagerEntryInformation.html",
			closable: true
		}));

        
        var filesystemGrid = new EnhancedGrid({
            store: filesystemStore,
            title: "\\",
            query: {},
            keepSelection: false,
            structure:[
                       {name: 'BussinessAdmin', field: 'bussinessAdmin', hidden: true},
                       {name: 'Type', field: 'type', 'width': '6%', type: dojox.grid.cells._Widget, formatter: fmtImage},
                       {name: 'Title', field: 'name', 'width': '32%'},
                       {name: 'Family', field: 'family', 'width': '15%'},
                       {name: 'Doc type', field: 'docType', 'width': '12%'},
                       {name: 'Version', field: 'version', 'width': '7%'},
                       {name: 'Author', field: 'ownerRealname', 'width': '12%'},
                       {name: 'Date', field: 'date', 'width': '7%'},
                       {name: 'Status', field: 'status', 'width': '7%'},
                       {name: 'ParentId', field: 'parentId', hidden: true},
                       {name: 'PathId', field: 'pathId', hidden: true}],
            plugins: {
                indirectSelection: { headerSelector: true },
                selector: {col: "disabled", cell: "disabled"},
                dnd: {
                    copyOnly: true,
                    dndConfig: {row:{within:false}}
                },
                pagination: {
                    position:'top',
                    defaultPageSize: 10
                }
            }
        });
        pane.addChild(filesystemGrid);
        pane.startup();
        dojo.byId("pathId").value = "";

        //
        // apply events
        //
        var node_id, pathId, folderPath, pathText, node_pathText, treePath, vRootFAdmin, focusedRowIndex, focusedCellIndex, isClickcheckbox;
        var firstPage = false;
        var srcTree = registry.byId("srcfileSystemTree");
        filesystemGrid.on("RowDblClick", function(event){
            var item;
            firstPage = true;
            if (event.caller_id == "srcfileSystemTree") {
                var focusNode = dijit.byId("srcfileSystemTree").lastFocused;
                // return if click disabeld node
                if(focusNode.disabled) return;
                item = {"id": event.id, "type": event.type, "path": event.path, "parentId": event.parentId, "pathId": event.pathId };
            } else {
                // return if click disabled grid
                if(filesystemGrid.rowSelectCell.disabledMap[event.rowIndex]) return;
                item = filesystemGrid.getItem(event.rowIndex);
            }            
            
            if (item.type == "M" || item.type == "S") {
                this.setQuery({ id : item.id });
                this.set('title', item.path);
                
                dojo.byId("pathId").value = "-1" + item.pathId;
                dojo.byId("pathText").value = item.path;
                
                if (event.caller_id != "srcfileSystemTree") {
                    treePath = dojo.byId("pathId").value.split(":");
                    srcTree.set('paths', [treePath] );
                }
            }
        }, true);
        
        on(srcTree, "DblClick", function (event) {
            event.caller_id = "srcfileSystemTree";
            on.emit(filesystemGrid, "RowDblClick", event);
            pane.selectChild(filesystemGrid);
        });
        
        filesystemGrid.on("mouseover", function(event){            
            focusedCellIndex = event.cellIndex;
            focusedRowIndex = event.rowIndex;
        });
        
        filesystemGrid.on("pointerdown", function(event){
        	dojo.byId("autoExpandNodeFlg").value = "true";
        	if(focusedRowIndex === -1) return;
            isClickcheckbox = focusedCellIndex===0 ? false : true;
            if(!isClickcheckbox){
                for(var i = 0; i < filesystemGrid.rowCount; i++){
                    if(filesystemGrid.rowSelectCell.disabledMap[i]) {
                        filesystemGrid.selection.setSelected(i, false);
                    }
                }
            }
        });
        
        filesystemGrid.on("pointerup", function(event){
        	dojo.byId("autoExpandNodeFlg").value = "false";
            var items = filesystemGrid.selection.getSelected();
            var focusedRowItem = focusedRowIndex != -1 ? filesystemGrid.getItem(focusedRowIndex) : null;
            var showAlert = true;
            
            if(filesystemGrid._focused){
                for(var i = 0; i < items.length; i++){
                    if(focusedRowItem && items[i].id === focusedRowItem.id) {
                        showAlert = false;
                    }
                }
                if(focusedRowItem && items.length > 0 && showAlert && isClickcheckbox) alert("You can drag and drop selected item(s) only to the 'Right Tree'.");
            }
        });
        
        //
        // Handle action of "naviup" button.
        //
        var naviupBtnAction = registry.byId("naviup");
        on(naviupBtnAction, "click", function(event) {
            registry.byId("naviup").set('disabled', true);
            firstPage = true;
            node_id = node_id == "-1" ? null : node_id;
            
            if(pathId != null && pathId != "-1"){
            	
                filesystemGrid.setQuery({ id : node_id });
                filesystemGrid.set('title', node_pathText);
                
                dojo.byId("pathId").value = pathId.substring(0, pathId.lastIndexOf(":"));
                dojo.byId("pathText").value = node_pathText;
                
                treePath = dojo.byId("pathId").value.split(":");
                srcTree.set('paths', [treePath] );
            }
        });
        
        aspect.after(filesystemGrid, "_onFetchComplete", function() {
            pathId = dojo.byId("pathId").value;
            folderPath = pathId.split(":");
            node_id = folderPath[folderPath.length - 2];
            
            pathText = dojo.byId("pathText").value;
            node_pathText = pathText.substring(0, pathText.lastIndexOf("\\"));
            
            if(firstPage){
                filesystemGrid.firstPage();
                firstPage = false;
            }
            
            // clear all selected rows
            filesystemGrid.selection.clear();
            // naviup disable
            if (undefined === node_id || "" === node_id){
                filesystemGrid.set('title', "\\");
                registry.byId("naviup").set('disabled', true);
            }else{
                // naviup enable
                registry.byId("naviup").set('disabled', false);
            }
            disableMiddleGrid();
        });

        //
        // Define target for DnD Drop
        //
        var targetTree = dojo.byId("targetfileSystemTree");
        var filesystemTreeDndTarget = new GridSource(targetTree, {isSource : false, insertNodesForGrid : false}); 

        on(filesystemTreeDndTarget, "DropGridRows", function(grid, rowIndexes) {
            //var selectedItems = grid.selection.getSelected();
            var srcStore = grid.store;
            //var selectedTarget = dijit.byId("targetfileSystemTree").selectedItem;
            var focusNode = dijit.byId("targetfileSystemTree").lastFocused;
            
            if(focusNode.disabled){
            	alert("You don't have permissions to the selected folder.");
            	return;
            }
            console.log("targetNodeId:" + focusNode.item.id + "  Path:" + focusNode.item.path);
            var target = dijit.byId("targetfileSystemTree");
            var targetModel = target.model;
            var showAlert= false;
            var dragToitself= false;
            
            vRootFAdmin = dojo.byId("rootFolderAdmin").value;
            pathId = dojo.byId("pathId").value;
            
            array.forEach(rowIndexes, function(row, idx) {
                var source = srcStore.getValue(grid.getItem(row), "id");
                if((pathId == "" || pathId == "-1") && vRootFAdmin.split(":").indexOf(source.toString()) == -1 ) {
                    showAlert = true;
                }
                
                var sourcePath = srcStore.getValue(grid.getItem(row), "type").toString() == "D" ? srcStore.getValue(grid.getItem(row), "parentId").toString() : srcStore.getValue(grid.getItem(row), "pathId").toString();
                if(srcStore.getValue(grid.getItem(row), "type").toString() == "D"){
                	if(focusNode.item.id.toString() == sourcePath) {
                    	dragToitself = true;
                    }
                }else{
                	if(focusNode.item.pathId.toString().indexOf(sourcePath) >= 0 ) {
                    	dragToitself = true;
                    }
                }
            });

            if(dragToitself){
            	alert("You cannot selected itself or subfolder.");
            	return;
            }
            
            if(showAlert){
            	alert("You don't have permissions to the selected folder.");
            }else{
            	 array.forEach(rowIndexes, function(row, idx) {
            		var source = srcStore.getValue(grid.getItem(row), "id");
 	                var sourceTitle = srcStore.getValue(grid.getItem(row), "name");
 	                var sourceType = srcStore.getValue(grid.getItem(row), "folderNode") == true ? "FOLDER" : "DOCUMENT";
 	                connect.publish("/userOperationsTopic", [{sourceType: sourceType, sourceId:source, sourceTitle: sourceTitle, targetId:focusNode.item.id}]);
 	            });
                // clear all selected rows
                filesystemGrid.selection.clear();
            }
        });

        // give store Observable interface so Tree can track updates
        // treeStore = new Observable(treeStore);
        
        // get getRootfoldersForBusinessAdmin
        require(["dojo/request/xhr","dojo/domReady!"], function(xhr){
            xhr.get("rest/filesystem/getRootfoldersForBusinessAdmin", {
                handleAs: "text",
                preventCache: true
              }).then(function(data){
                  dojo.byId("rootFolderAdmin").value = data;
              });  
        });
        
        // disable tree nodes
        require(["dojo/dom-class"], function (domClass) {
            var tree = registry.byId('targetfileSystemTree');
            // Connect to tree onLoad to do work once it has initialized
            tree.onLoadDeferred.then(function(){
                vRootFAdmin = dojo.byId("rootFolderAdmin").value;
                var nodes = dijit.byId("targetfileSystemTree").rootNode.getChildren();
                if( nodes ) {
                     dojo.forEach( nodes, function(node) {
                         if( vRootFAdmin.split(":").indexOf(node.item.id.toString()) == -1 ) {
                             node.disabled = true;
                             node.isExpandable = false;
                             domClass.add(node.id,"dijitTreeNodeDisabled dijitTreeNodeNotLoadedDisabled dijitNotLoadedDisabled dijitDisabled");
                         }
                    });
                }
            });
            var lefttree = registry.byId('srcfileSystemTree');
            // Connect to tree onLoad to do work once it has initialized
            lefttree.onLoadDeferred.then(function(){
                vRootFAdmin = dojo.byId("rootFolderAdmin").value;
                var nodes = dijit.byId("srcfileSystemTree").rootNode.getChildren();
                if( nodes ) {
                     dojo.forEach( nodes, function(node) {
                         if( vRootFAdmin.split(":").indexOf(node.item.id.toString()) == -1 ) {
                             node.disabled = true;
                             node.isExpandable = false;
                             domClass.add(node.id,"dijitTreeNodeDisabled dijitTreeNodeNotLoadedDisabled dijitNotLoadedDisabled dijitDisabled");
                         }
                    });
                }
            });
         });
        
        disableMiddleGrid = function () {
            for(var i = 0; i < filesystemGrid.rowCount; i++){
                var bussinessAdmin = filesystemGrid.getItem(i).bussinessAdmin;
                if(filesystemGrid.getItem(i).parentId != null || filesystemGrid.getItem(i).type === 'D'){
                    bussinessAdmin = true;
                }
                filesystemGrid.rowSelectCell.setDisabled(i, !bussinessAdmin);
           };
        };
        });
        
      
        console.log("copymanager-main.js stop");
    });