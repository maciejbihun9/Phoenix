require([
			"dojo/parser",
			"dojo/on",
			"dijit/registry",
			"dijit/layout/TabContainer",
			"dijit/layout/ContentPane",
			"dojox/grid/EnhancedGrid",
			"dojox/grid/enhanced/plugins/Pagination",
			"dojox/grid/enhanced/plugins/IndirectSelection",
			"dojox/data/JsonRestStore",
			"dijit/form/Button",
			"dojo/domReady!"],
			
			function(parser, on, registry, TabContainer, ContentPane, EnhancedGrid, Pagination, IndirectSelection, JsonRestStore, Button) {
	    	
		//		parser.parse();
				
				var folderHistoryStore = new dojox.data.JsonRestStore({
					identifier: 'id',
					target: 'rest/history/folderHistory'
				});
	 		
				var docHistoryStore = new dojox.data.JsonRestStore({
					identifier: 'id',
					target: 'rest/history/documentHistory'
				});
				
				var tabsHistory = new TabContainer({style: "height: 100%; width: 100%"}, "historyChangesDiv");
				var docHistoryPanel = new ContentPane({title: "Documents"});
				var docHistoryGrid = new EnhancedGrid({
					store: docHistoryStore,
					query: {},
					_onDelete: function(item){
						//we dont need autorefresh on delete. Refresh is done before delete. :) 
						//we refresh this grid in button action.
					},
					keepSelection: true,
					height: '240px',
					structure: [
						{ name: "Source Path", field: "sourcePath", 'width': '44%'},
						{ name: "Target Path", field: "targetPath", 'width': '44%'},
						{ name: "Type" , field: "operationType" }
					],
					plugins: {
						indirectSelection: { headerSelector: true },
						pagination: {
							position:'top',
							defaultPageSize: 10
						}
					}
				});
				
				docHistoryGrid.on("RowClick", function(evt){

					var rowIdx = evt.rowIndex;
					var cellIdx = evt.cellIndex;
					
					// Do not show doc details if the user click on the selection column (read column with checkboxes)  
					if (cellIdx != 0) {
						var rowData = docHistoryGrid.getItem(rowIdx);
						var sourcePath = rowData.sourcePath;
						var docName = sourcePath.substring(sourcePath.lastIndexOf('\\')+1);
						var pane = registry.byId("middleFrameTabs");
						var historyPane = new ContentPane({title: docName, closable: true});
						historyPane.set("href", "history/docAuditLogDetail.do?auditLogId="+rowData.id);
						pane.addChild(historyPane);
						pane.selectChild(historyPane, false);
					}
				}, true);
				docHistoryPanel.addChild(docHistoryGrid);

				var removeHistoryButton = new Button({
			        label: "Clear selected",
			        onClick: function() {
			        	var selectedItems = docHistoryGrid.selection.getSelected();
			        	dojo.forEach(selectedItems, function(selectedItem){
			                if(selectedItem !== null){
			                    docHistoryStore.deleteItem(selectedItem);
			                }
			            });			        	
			            docHistoryStore.save({
							            			global: true ,
							            			onComplete: function(){
							            				docHistoryGrid._refresh();
							            			}
						            			});
			        }
			    });
				
				docHistoryPanel.addChild(removeHistoryButton);
				
				var folderHistoryPanel = new ContentPane({title: "Folders"});
				var folderHistoryGrid = new EnhancedGrid({
					store: folderHistoryStore,
					_onDelete: function(item){
						//we dont need autorefresh on delete. Refresh is done before delete. :) 
						//we refresh this grid in button action.
					},
					keepSelection: true,
				    height: '240px',
					structure: [
						{ name: "Source Path", field: "sourcePath", 'width': '44%' },
						{ name: "Target Path", field: "targetPath", 'width': '44%' },
						{ name: "Type" , field: "operationType" }
					],
					plugins: {
						indirectSelection: { headerSelector: true },
						pagination: { 
							position: 'top',
							defaultPageSize: 10
						}
					}
				});
				folderHistoryPanel.addChild(folderHistoryGrid);
				
				var removeFolderHistoryButton = new Button({
			        label: "Clear selected",
			        onClick: function() {
			        	var selectedItems = folderHistoryGrid.selection.getSelected();
			        	dojo.forEach(selectedItems, function(selectedItem){
			                if(selectedItem !== null){
			                    folderHistoryStore.deleteItem(selectedItem);
			                }
			            });			        	
			            folderHistoryStore.save({
							            			global: true ,
							            			onComplete: function(){
							            				folderHistoryGrid._refresh();
							            			}
						            			});

			        }
			    });
				folderHistoryPanel.addChild(removeFolderHistoryButton);

				tabsHistory.addChild(docHistoryPanel);
				tabsHistory.addChild(folderHistoryPanel);
				
				tabsHistory.startup();
	    	}); 