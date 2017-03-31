/**
 * Contains UI user operation functionality.
 */
require([ "dojo/on", "dojo/dom", "dojo/dom-class", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dijit/registry", "dojox/layout/ContentPane",
          "dijit/Menu", "dijit/MenuItem", "dijit/form/ComboButton", "dojo/topic", "dojo/request", "dojo/query", "dojo/json", "dojo/_base/json",
          "dojo/_base/array", "dojo/_base/fx", "dojo/ready"  ],          									
		function(on, dom, domClass, domStyle, domAttr, domConstruct, registry, ContentPane, Menu, MenuItem, ComboButton, topic, request, query, JSON, dojoJson, array, fx, ready) {
			console.log("copymanager-user-operations.js start");
			
			ready(function(){
				
			// Aggregated remove
			function removeUnsolvableConflictOperations() {

				var tabsContainer = registry.byId('conflictTabs'),
					tabsArr = tabsContainer.getChildren();
				
				array.forEach(tabsArr, function(item) {
					if (item.conflictType === CONFLICT_TYPES.ERROR) {
						item.onClose({'selectedChildWidget': {'conflictType': item.conflictType}});
						item.unsubscribe;
						tabsContainer.removeChild(item);
						item.destroy();//Recursive(false);
					}
				} );
			}
			
			function removeSolvableConflictOperations() {

				var tabsContainer = registry.byId('conflictTabs'),
					tabsArr = tabsContainer.getChildren();
				
				array.forEach(tabsArr, function(item) {
					if ((item.conflictType === CONFLICT_TYPES.TO_SOLVE || item.conflictType === CONFLICT_TYPES.TO_SOLVE_OPTIONAL) && item.solutionType === '') {
						item.onClose({'selectedChildWidget': {'conflictType': item.conflictType}});
						item.unsubscribe;
						tabsContainer.removeChild(item);
						item.destroy();//Recursive(false);
					}
				} );
			}

			function removeBlockedOperations() {
				
				var tabsContainer = registry.byId('conflictTabs'),
					tabsArr = tabsContainer.getChildren();
				
				array.forEach(tabsArr, function(item) {
					if (item.conflictType === CONFLICT_TYPES.BLOCKED) {
						adaptOperationSummary(item.conflictType, false, true)
						item.unsubscribe;
						tabsContainer.removeChild(item);
						item.destroy();//Recursive(false);
						
					}
				} );
			}
			
			function copyOperationsWithoutConflicts() {
				topic.publish("/agregatedOperationTopic", {'actionType': 'COPY'});
			}
			
			function moveOperationsWithoutConflicts() {
				topic.publish("/agregatedOperationTopic", {'actionType': 'MOVE'});
			}
			
			// Aggregate action button
			function prepareAggregatedActionButton() {
				var operationActionMenu = new Menu({ style: "display: none;"}),
		        	menuCopyItem = new MenuItem({label: "Copy operations without conflicts", onClick: copyOperationsWithoutConflicts }),
		        	menuMoveItem = new MenuItem({label: "Move operations without conflicts", onClick: moveOperationsWithoutConflicts }),
		        	menuRemoveSolvableItem = new MenuItem({label: "Remove solvable conflicts", onClick: removeSolvableConflictOperations }),
		        	menuRemoveItem = new MenuItem({label: "Remove unsolvable conflicts", onClick: removeUnsolvableConflictOperations }),
		        	menuRemoveBlockedItem = new MenuItem({label: "Remove operations blocked by other user(s)", onClick: removeBlockedOperations });

		        operationActionMenu.addChild(menuCopyItem);
		        operationActionMenu.addChild(menuMoveItem);
		        operationActionMenu.addChild(menuRemoveSolvableItem);
		        operationActionMenu.addChild(menuRemoveItem);
		        operationActionMenu.addChild(menuRemoveBlockedItem);
		        operationActionMenu.startup();

		        var aggregateActionButton = new ComboButton({
		            label: "select an aggregate action",
		            dropDown: operationActionMenu,
		            onClick: function(){		            	
		            	this.toggleDropDown();
		            }
		        }, "operationActionBtn").startup();
			}
			
			function scheduleUserOperation(scheduleOperationDto, conflictType, tabWidget) {
				var json = dojoJson.toJson(scheduleOperationDto);
				
				console.log(json);
				request.post("rest/operation/scheduleOperation", {
					data : json,
						headers: {
							 "Content-Type": "application/json"
						}
				}).then(function(data) {
					
					plannedNb.innerHTML = ++operationSummary.planned;
					
					// Change tab title color to blue (what means the operation has been planned)
					tabWidget.set("title", '<font color="blue">' + domConstruct.toDom(tabWidget.get('title')).innerHTML + '</font>');
					tabWidget.set("conflictType", 'PLANNED');
					tabWidget.set("solutionType", '');
					
					conflictType = scheduleOperationDto.solutionType === 'CONNECT_DOCUMENT_TYPE_TO_TARGET_DOMAIN' ? CONFLICT_TYPES.NO_CONFLICT : conflictType; 
					
					switch(conflictType) {
						case CONFLICT_TYPES.NO_CONFLICT:
						case CONFLICT_TYPES.TO_SOLVE:
						case CONFLICT_TYPES.TO_SOLVE_OPTIONAL:
							adaptOperationSummary(conflictType, false, false);
							break;
					}
					applyFiltersOnOperationTab(showOperationsArr, tabWidget);
					
				}, function(err) {
					tabWidget.set('closable', true);
				}, function(evt) {
				});
			}
			
			function markOperatioAsSolved(operationId) {
				
				var operationTab = registry.byId(operationId);
				
				if (operationTab !== undefined) {
					adaptOperationSummary(CONFLICT_TYPES.NO_CONFLICT, true, false);
					adaptOperationSummary(CONFLICT_TYPES.TO_SOLVE, false, false);
					
					// Change tab title color to related with 'without conflict'
					operationTab.set('title', '<font color="' + negotiateTabTitleColor(CONFLICT_TYPES.NO_CONFLICT) + '">' + domConstruct.toDom(operationTab.get('title')).innerHTML + '</font>');
					operationTab.set('solutionType', 'CONNECT_DOCUMENT_TYPE_TO_TARGET_DOMAIN');
					applyFiltersOnOperationTab(showOperationsArr, operationTab);
				}
			}
			
			//
			// Increase or decrease values in Operation Summary object.
			//		@conflictType - type of conflict
			// 		@increase - boolean. Use true to increase by 1 or false to decrease by 1.
			// 		@modifyTotal - boolean. Should total number of operation be modified?.
			//
			function adaptOperationSummary(conflictType, increase, modifyTotal) {
					
				switch(conflictType) {
					case CONFLICT_TYPES.NO_CONFLICT: 
						withoutConflictNb.innerHTML = increase ? ++operationSummary.withoutConflicts : --operationSummary.withoutConflicts;
						break
					case CONFLICT_TYPES.TO_SOLVE: 
					case CONFLICT_TYPES.TO_SOLVE_OPTIONAL:
						solvableConflictNb.innerHTML = increase ? ++operationSummary.solvableConflicts : --operationSummary.solvableConflicts;
						break;
					case CONFLICT_TYPES.ERROR: 
						unsolvableConflictNb.innerHTML = increase ? ++operationSummary.unsolvableConflicts : --operationSummary.unsolvableConflicts;
						break;
					case CONFLICT_TYPES.BLOCKED: 
						blockedNb.innerHTML = increase ? ++operationSummary.blocked : --operationSummary.blocked;
						break
				}
				if (modifyTotal) {
					totalNb.innerHTML = increase ? ++operationSummary.total : --operationSummary.total;
				}
			}
			
			function negotiateTabTitleColor(conflictType) {
				switch(conflictType) {
					case CONFLICT_TYPES.NO_CONFLICT: return 'green'; 
					case CONFLICT_TYPES.TO_SOLVE:
					case CONFLICT_TYPES.TO_SOLVE_OPTIONAL: return '#fe7f00'; 
					case CONFLICT_TYPES.ERROR: return 'red'; 
				}	
			}
				
			//
			//Add user operation to conflict resolution area.
			//
			function addNewTab(operation, dndOperationItem) {
				var conflictType = '';

				if (operation.message == null || operation.message == "") {
						
					pane.addChild(new ContentPane({
						id: operation.id,
						title: dndOperationItem.sourceTitle,
						href: "operation/check.do?operationId=" + operation.id,
						conflictType: conflictType,
						solutionType: '',
						targetFolderId: dndOperationItem.targetId,
						closable: false,
						preload: true,
						iconClass: 'dijitPhoenixToolbarIcon dijitPhoenixToolbarIcon' + operation.source.type,
						onLoad: function(loadedContent) {

							var startIdx = loadedContent.search("CT___") + 5,
								endIdx = loadedContent.search("___CT");
								
							conflictType = loadedContent.substring(startIdx, endIdx);
							this.set('conflictType', conflictType);
							if (conflictType === CONFLICT_TYPES.NO_CONFLICT) {
								this.set('solutionType', 'NO_CONFLICT');
							}
							this.set("title", '<font color="' + negotiateTabTitleColor(conflictType) +'">' + dndOperationItem.sourceTitle + '</font>');
							adaptOperationSummary(conflictType, true, true);
							this.set('closable', true);
							applyFiltersOnOperationTab(showOperationsArr, this);
						},
						onClose : function(evt) {
							var calculatedConflictType = this.solutionType === 'CONNECT_DOCUMENT_TYPE_TO_TARGET_DOMAIN'
								? CONFLICT_TYPES.NO_CONFLICT : this.conflictType;
							
							request.del("rest/operation/userPlanedOperations/"+operation.id).then(
								function(answer) {
									adaptOperationSummary(calculatedConflictType, false, true);
								},
								function(reason) {
									console.log("We got an ERROR: " + reason);
								});

							return true;
						}
					}));
				} else {
					totalNb.innerHTML = ++operationSummary.total;
					blockedNb.innerHTML = ++operationSummary.blocked;
					var cp = new ContentPane({
						conflictType: CONFLICT_TYPES.BLOCKED,
						title : '<font color="#b100fe">' + dndOperationItem.sourceTitle + '</font>',
						content: "<div>" + operation.source.path + "->" + operation.target.path + "</div>" + "<p>" + operation.message + "</p>",
						closable : true,
						iconClass: 'dijitPhoenixToolbarIcon dijitPhoenixToolbarIcon' + operation.source.type,
						onClose: function() {
							totalNb.innerHTML = --operationSummary.total;
							blockedNb.innerHTML = --operationSummary.blocked;
							return true;
						}
					});
					pane.addChild(cp);
					applyFiltersOnOperationTab(showOperationsArr, cp);	
				}
			}

			//
			// Restore operations made by the user in the last session (before Copy Manager has been closed).
			// Only operation with status CREATED are restored here.
			//
			function restoreUserOperations() {
				request.get("rest/operation/userOperationsList").then(function(answer) {
					var userOperations = JSON.parse(answer, true);
	            	array.forEach(userOperations, function(op) {
	            		addNewTab(
	            				{id: op.id, message: op.message, source: {type: op.source.type}},
	            				{sourceType: op.source.type, sourceId: op.source.id, sourceTitle: op.source.name, targetId: op.target.id});
	  	            });
				}, function(reason) {
					console.log("We got an ERROR! The user operation cannot be restored." + reason);
				});				
			}

			function filterNegotiator(activeFilters, operationTab) {

				if (operationTab.conflictType === CONFLICT_TYPES.NO_CONFLICT || (operationTab.conflictType === CONFLICT_TYPES.TO_SOLVE && operationTab.solutionType !== '')) {
					return activeFilters.contains(OPERATION_STATUS_TYPES.NO_CONFLICT);
				} else if ((operationTab.conflictType === CONFLICT_TYPES.TO_SOLVE || operationTab.conflictType === CONFLICT_TYPES.TO_SOLVE_OPTIONAL)
						&& operationTab.solutionType === '') {
					return activeFilters.contains(OPERATION_STATUS_TYPES.SOLVABLE);
				} else if (operationTab.conflictType === CONFLICT_TYPES.ERROR) {
					return activeFilters.contains(OPERATION_STATUS_TYPES.UNSOLVABLE);
				} else if (operationTab.conflictType === CONFLICT_TYPES.BLOCKED) {
					return activeFilters.contains(OPERATION_STATUS_TYPES.BLOCKED);
				} else if (operationTab.conflictType === 'PLANNED' && operationTab.solutionType === '') {
					return activeFilters.contains(OPERATION_STATUS_TYPES.PLANNED);
				}
			}
        
			function addRemoveFilterClass(node) {
				if (domClass.contains(node, 'filter-item-selected')) {	
					domClass.remove(node, 'filter-item-selected');
				} else {
					domClass.add(node, 'filter-item-selected');
				}
			}
        
			function applyFiltersOnOperationTab(showOperationsArr, operationTab) {
				if (showOperationsArr.count === 0 || filterNegotiator(showOperationsArr, operationTab)) {
					domStyle.set(operationTab.domNode, 'display', 'block');
					domStyle.set(operationTab.controlButton.domNode, 'display', 'inline');
				} else {
					domStyle.set(operationTab.domNode, 'display', 'none');
					domStyle.set(operationTab.controlButton.domNode, 'display', 'none');
				}
			}
        
			function filterOperations(requestedFilter) {
				var tabsContainer = registry.byId('conflictTabs'),
    				tabsArr = tabsContainer.getChildren();

				if (tabsArr.length > 0) {
					if (showOperationsArr.contains(requestedFilter)) {
						showOperationsArr.remove(requestedFilter);
					} else {
						showOperationsArr.add(requestedFilter);
					}
        		
					array.forEach(tabsArr, function(operationTab) {
						applyFiltersOnOperationTab(showOperationsArr, operationTab);
					});
        	
					var currentSelectedTab = tabsContainer.selectedChildWidget,
						activeTabChosen = domStyle.get(currentSelectedTab.domNode, 'display') === 'block';
				
					array.forEach(tabsArr, function(operationTab) {
						if (domStyle.get(operationTab.domNode, 'display') === 'block') {
							if (!activeTabChosen) {
								tabsContainer.selectChild(operationTab);
								activeTabChosen = true;
							}
						}
					});
				}
			}
        
			const CONFLICT_TYPES = { NO_CONFLICT: 'NO_CONFLICT', TO_SOLVE: 'TO_SOLVE', TO_SOLVE_OPTIONAL: 'TO_SOLVE_OPTIONAL', ERROR: 'ERROR', BLOCKED: 'BLOCKED' },
				  OPERATION_STATUS_TYPES = { PLANNED: 'PLANNED', NO_CONFLICT: 'NO_CONFLICT', SOLVABLE: 'TO_SOLVE', UNSOLVABLE: 'ERROR', BLOCKED: 'BLOCKED' };
			
			var	showOperationsArr = new dojox.collections.ArrayList(),
				operationSummary = { total: 0, planned: 0, withoutConflicts: 0, solvableConflicts: 0, unsolvableConflicts: 0, blocked: 0},
				totalNb = dom.byId("totalNb"),
				plannedNb = dom.byId("plannedNb"),
				withoutConflictNb = dom.byId("withoutConflictsNb"),
				solvableConflictNb = dom.byId("solvableConflictsNb"),
				unsolvableConflictNb = dom.byId("unsolvableConflictsNb"),
				blockedNb = dom.byId("blockedNb"),
				pane = registry.byId("conflictTabs");
			
			prepareAggregatedActionButton();
			restoreUserOperations();
			
			//
			// Subscribe for DnD operations from middle table to tree on the right side.
			//
			topic.subscribe("/userOperationsTopic",	function(dndOperationItem) {
					console.log("Planned user operation: ", dndOperationItem)
					var json = dojoJson.toJson(dndOperationItem);
						
					request.post("rest/operation/userPlanedOperations", {
						data : json,
						headers: { "Content-Type": "application/json" }
					}).then(function(answer) {
						var operation = JSON.parse(answer, true);
						addNewTab(operation, dndOperationItem);
					}, function(reason) {
						console.log("We got an ERROR: " + reason);
					});
				});
			
			//
			// Subscribe to operation that a user want to be schedule.
			//
			topic.subscribe("/scheduleOperationsTopic",	function(scheduledOperationDto) {
					console.log("Scheduled  operation: ", scheduledOperationDto)
					
					var clickedButton = scheduledOperationDto.clickedBtn,
						containingTab = clickedButton.getParent();
					
					containingTab.set('closable', false);
					containingTab.set('solutionType', scheduledOperationDto.solutionType);
					
					domStyle.set(dom.byId('copymoveBtnContainer' + scheduledOperationDto.operationId), 'display', 'none');
						
					var info = dom.byId('operationStatusInfo' + scheduledOperationDto.operationId),
						style = scheduledOperationDto.actionType === 'COPY' ? 'copy-operation' : 'move-operation';
					
					info.innerHTML = '<span class="' + style + '">' + scheduledOperationDto.actionType + '</span> operation has been planned.';
					domStyle.set(dom.byId('operationStatusInfo' + scheduledOperationDto.operationId), 'display', 'inline');						
						
					scheduleUserOperation({ operationId: scheduledOperationDto.operationId,
											actionType: scheduledOperationDto.actionType,
											solutionType: scheduledOperationDto.conflictType === CONFLICT_TYPES.TO_SOLVE_OPTIONAL ?  CONFLICT_TYPES.NO_CONFLICT : scheduledOperationDto.solutionType,
											selectedDoctype: scheduledOperationDto.selectedDoctype,
											selectedFamily: scheduledOperationDto.selectedFamily,
											doctypeAttr: scheduledOperationDto.doctypeAttr,
											domainAttr: scheduledOperationDto.domainAttr
										  },
										  scheduledOperationDto.conflictType, containingTab);
				});

			//
			// Subscribe to operation that has been solved by a user. Move operation to 'without conflict' area
			//
			topic.subscribe("/conflictSolvedTopic",	function(operationDto) {
					console.log("Conflict has been solved for operation: ", operationDto.operationId)
					markOperatioAsSolved(operationDto.operationId);
				});

			//
			// Subscribe to Toggler trigger evt.
			//
			topic.subscribe("/togglerTriggerEventTopic", function(evt) {
					togglerObjectHandler.togglerOperation(evt);
				});

	        on(dojo.byId("plannedSpan"), "click", function(event) {
	        	addRemoveFilterClass(this);
	        	filterOperations(OPERATION_STATUS_TYPES.PLANNED);
	        });
	        on(dojo.byId("withoutConflictSpan"), "click", function(event) {
	        	addRemoveFilterClass(this);
	        	filterOperations(OPERATION_STATUS_TYPES.NO_CONFLICT);
	        });
	        on(dojo.byId("solvableConflictSpan"), "click", function(event) {
	        	addRemoveFilterClass(this);
	        	filterOperations(OPERATION_STATUS_TYPES.SOLVABLE);
	        });
	        on(dojo.byId("unsolvableConflictSpan"), "click", function(event) {
	        	addRemoveFilterClass(this);
	        	filterOperations(OPERATION_STATUS_TYPES.UNSOLVABLE);
	    	});
	        on(dojo.byId("blockedSpan"), "click", function(event) {
	        	addRemoveFilterClass(this);
	        	filterOperations(OPERATION_STATUS_TYPES.BLOCKED);
	        });
			
			//
			// Toggler events handling
			//
			var togglerObjectHandler = {
				id: "togglerOperation",
				togglerOperation: function(evt) {
					
					var nodeType = evt.srcElement.type,
						togglerEvt = nodeType !== 'button' ? evt.srcElement.id : registry.getEnclosingWidget(evt.target).id, 
						togglerEvtNode = dom.byId(togglerEvt),
						args = togglerEvt.split("|"),
						togglerTargetId = args[1],
						togglerTargetNode = dom.byId(togglerTargetId);
					
				    if (togglerTargetNode) {
				    	domClass.toggle(togglerTargetNode, "toggledPane");
				    	domStyle.set(togglerTargetNode, "opacity", "0");
				    }
					if (nodeType !== "button") {
						if (domClass.contains(togglerTargetNode, "toggledPane")) {
							togglerEvtNode.innerHTML = "Show details";
						} else {
							togglerEvtNode.innerHTML = "Hide details";
						}
					}
					
					var fadeArgs = {
		        		node: togglerTargetId
		      		};
		      		fx.fadeIn(fadeArgs).play();
				}
			};

			
			var tabsContainer = dom.byId('conflictTabs');
			on(tabsContainer, ".togglerOperation:click", togglerObjectHandler.togglerOperation);
			
			pane.startup();
			
			});
			console.log("copymanager-user-operations.js stop");
			
		});
