<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div>
<div>
Requested operation
<span class="requested-operation"><span class="marker-blue">From:</span>${operation.source.path} <span class="marker-blue">To:</span> ${operation.target.path }</span>
</div>

<c:set var="showButtons" scope="request" value="true"/>
<c:set var="conflictType" scope="request" value=""/>

<c:choose>
	<c:when test="${not empty conflicts}">
		<c:forEach items="${conflicts}" var="conflict">
			<c:set var="cf" value="${conflict}" scope="request" /> 
			<c:choose>
				<c:when test="${conflict.type.name=='TYPE'}">
					<c:set var="conflictType" scope="request" value="TO_SOLVE"/>
					<c:set var="sourceDocumentType" scope="request" value="${cf.sourceDocumentTypeDTO.id}"/>
					<jsp:include page="operationDocumentTypeResolver.jsp" />
				</c:when>
				<c:when test="${conflict.type.name=='ATTRIBUTE'}">
					<c:choose>
						<c:when test="${fn:length(conflict.sourceDocumentAttributes) > 0 && conflictType == ''}">
							<c:set var="conflictType" scope="request" value="TO_SOLVE_OPTIONAL"/>
						</c:when>
						<c:when test="${fn:length(conflict.sourceDocumentAttributes) == 0 && conflictType == ''}">
							<c:set var="conflictType" scope="request" value="NO_CONFLICT"/>
							<div class="operation-without-conflict">OK: no conflicts</div>
						</c:when>
					</c:choose>
					<jsp:include page="operationDomainAttributesResolver.jsp" />
				</c:when>
				<c:when test="${conflict.type.name=='ROOT'}">
					<c:set var="conflictType" scope="request" value="ERROR"/>
					<c:set var="showButtons" scope="request" value="false"/>
					<jsp:include page="operationNotPossibleInfoClassBlocker.jsp" />
				</c:when>
				<c:when test="${conflict.type.name=='APP'}">
					<c:set var="conflictType" scope="request" value="ERROR"/>
					<c:set var="showButtons" scope="request" value="false"/>
					<jsp:include page="operationNotPossibleApplicationBlocker.jsp" />
				</c:when>
				<c:otherwise>
				</c:otherwise>
			</c:choose>
		</c:forEach>
	</c:when>
	<c:otherwise>
		<c:set var="conflictType" scope="request" value="NO_CONFLICT"/>
		<div class="operation-without-conflict">OK: no conflicts</div>
	</c:otherwise>
</c:choose>

<input value="CT___${conflictType}___CT" type="hidden"></input>

<c:if test="${showButtons}">
<div id="copy-move-action-container">
What you want to do?</div>
	<div id="copymoveBtnContainer${operation.id}">
		<span>
			<button id="copyBtn${operation.id}"></button>
		</span> or 
		<span>
			<button id="moveBtn${operation.id}"></button>
		</span>
	</div>
	<div id="operationStatusInfo${operation.id}" style="display:none"></div>
</c:if>

<script type="text/javascript">
	require([ "dojo/topic", "dojo/dom-style", "dojo/fx/Toggler", "dojo/on", "dijit/registry", "dijit/form/Button", "dijit/Dialog", "dojo/dom",
	          "dojo/request", "dojo/query", "dojo/dom-attr", "dojo/_base/json", "dojo/_base/array", "dojo/domReady!" ],
		function(topic, domStyle, Toggler, on, registry, Button, Dialog, dom, request, query, domAttr, dojoJson, dojoArray) {
		
			//
			// Collect and prepare list of domain types attributes
			//
			function prepareDocumentTypeAttrs(operationId) {
			
				var doctypeAttrs = [],
					nl = query("div[data-operation-id="+ operationId + "] input[data-doctype-attr]");
				
		    	nl.forEach(function(node) {

		    		if (node.type === 'checkbox') {
		    			doctypeAttrs.push({id: domAttr.get(node, "data-doctype-attr"), value: node.checked ? 'Y' : null});
		    		} else {
		    			doctypeAttrs.push({id: domAttr.get(node, "data-doctype-attr"), value: node.value});
		    		}
		    	});

				var nlSelect = query("div[data-operation-id="+ operationId + "] select[data-doctype-attr]");
			    nlSelect.forEach(function(node) {
			    	doctypeAttrs.push({id: domAttr.get(node, "data-doctype-attr"), value: node.value});
		    	});
			    
			    return doctypeAttrs;
			}
			
			//
			// Collect and prepare list of domain types attributes
			//
			function prepareDomainAttrs(operationId) {
				
				var domainAttrs = [],
					nl = query("div[data-operation-id="+ operationId + "] input[data-domain-attr]");
				
		    	nl.forEach(function(node) {
		    		if (node.type === 'checkbox') {
		    			domainAttrs.push({id: domAttr.get(node, "data-domain-attr"), value: node.checked ? 'Y' : null});
		    		} else {
		    			if (node.value !== '') {
		    				domainAttrs.push({id: domAttr.get(node, "data-domain-attr"), value: node.value});
		    			}
		    		}
		    	});

				var nlSelect = query("div[data-operation-id="+ operationId + "] select[data-domain-attr]");
			    nlSelect.forEach(function(node) {
			    	console.log(node);
	    			if (node.value !== '') {
			    		domainAttrs.push({id: domAttr.get(node, "data-domain-attr"), value: node.value});
	    			}
		    	});
			    
			    return domainAttrs;
			}
			
			function validateAndConstructListOfInvalidDocumentTypeAttributes(documentTypeAttrs) {
				
				console.log('Verify if document attributes has been filled');
				
				var unsetDocTypeAttrs = [];
				if (documentTypeAttrs && documentTypeAttrs instanceof Array && documentTypeAttrs.length > 0) {
					dojoArray.forEach(documentTypeAttrs, function(attr) {
						if (attr.value === '') {
							unsetDocTypeAttrs.push(attr.id);
						}
					});
				}
				return unsetDocTypeAttrs;
			}
			
			function markMandatoryFields(operationId, notFilledFields) {

				console.log("Marking unsatisfied mandatory fields...");
				
				dojoArray.forEach(notFilledFields, function(attr) {
					var nlSelect = query('div[data-operation-id='+ operationId + '] [data-doctype-attr=' + attr + ']');
				    nlSelect.forEach(function(node) {
				    	domStyle.set(node, 'background-color', '#ff8080');
			    	});
				});
	    	};

	    	function showDialogMessage(message) {
	    		var dialogMsg = new Dialog({
					title: '<b>Info</b>',
					content: message
				});
	    		dialogMsg.show();
	    	}
	    	
	    	
	    	function validateOperation() {
				console.log(operationSchedule);
				if (operationSchedule.conflictType === 'TO_SOLVE' && operationSchedule.solutionType === '') {
					showDialogMessage('<div>The <b style="color:red">Required step to solve the conflict</b> has been omitted.</div>Please select one of the following options:<li>Connect Doc. Type with target domain</li><li>Select another Doc.type</li>');
					return false;
				}
				
				console.log(operationSchedule);
				
				if (operationSchedule.conflictType === 'TO_SOLVE' && operationSchedule.solutionType === 'SELECT_ANOTHER_DOCUMENT_TYPE') { 
					
					var selectedDocTypeFamily = dom.byId('family_' + operationSchedule.operationId).value;
					if (selectedDocTypeFamily === '') {
						showDialogMessage('You need to select "Family" before copy/move operation!');
						return false;
					}
					
					var selectedDocType = dom.byId('documentType_' + operationSchedule.operationId).value;
					if (selectedDocType === '') {
						showDialogMessage('You need to select document type before copy/move operation!');
						return false;
					}
					operationSchedule.selectedDoctype = selectedDocType;
					
					var docTypeAttrs = prepareDocumentTypeAttrs(operationSchedule.operationId);
					
					if (docTypeAttrs.length > 0) {
						var invalidDocTypeAttrs = validateAndConstructListOfInvalidDocumentTypeAttributes(docTypeAttrs);
					
						if (invalidDocTypeAttrs.length === 0) {
							operationSchedule.doctypeAttr = docTypeAttrs;
						} else {
							showDialogMessage('You need to set up <b>all mandatory attribute(s)</b> before copy/move operation!<br>Please check the fields marked in <font style="color: #ff8080; font-weight: bold ">red</font>.');
							markMandatoryFields(operationSchedule.operationId, invalidDocTypeAttrs);
							return false;
						}
					}
				}
				return true;
	    	}
	    	
	    	function scheduleOperation(actionType, btnRef) {
				operationSchedule.actionType = actionType;
				operationSchedule.domainAttr = prepareDomainAttrs(operationSchedule.operationId);
				operationSchedule.clickedBtn = btnRef;
				operationSchedule.operationStatus = 'PLANNED';
				
				console.log(operationSchedule);
			
				// Mark operation as scheduled.
				topic.publish("/scheduleOperationsTopic", operationSchedule);
	    	}
	    	
	    	function disableAndUnregisterFromListener(btnRef) {
				this.disabled = true;

				// Disable button as conflict has been already solved and the operation is scheduled.
				if (operationSchedule.conflictType === 'TO_SOLVE') {
					var btn = registry.byId('doctypeBtn' + operationSchedule.operationId + '|connectDocType' + operationSchedule.operationId);
					btn.set('disabled', true);
				}
				//unsubscribe from /connectToTargetDomainTopic topic. The conflict has been solved already.
				topicListener.remove();
	    	}
	    	
			var conflictType = '<c:out value="${conflictType}"/>',
				hasConflicts = '<c:out value="${not empty conflicts}"/>',
				operationSchedule = {
					operationId: '<c:out value="${operation.id}"/>',
					actionType: '',
					conflictType: conflictType,
					sourceDocumentType: '<c:out value="${sourceDocumentType}"/>',
					solutionType: '',
					selectedDoctype: '',
					selectedFamily: '',
					doctypeAttr: [],
					domainAttr: [],
					targetFolderId: '<c:out value="${operation.target.pathId}" />',
					clickedBtn: {},
					operationStatus: ''
				}

			if (conflictType != "ERROR") {
				//
				// Copy button
				//
				var copyBtn = new Button({
					label : 'Copy',
					onClick: function(evt) {
						if (validateOperation()) {
							console.log(operationSchedule.doctypeAttr);
							scheduleOperation('COPY', this);
							disableAndUnregisterFromListener(this);
						}
					}
				}, "copyBtn${operation.id}").startup();
				//
				// Move button
				//
				var moveBtn = new Button({
					label : 'Move',
					onClick: function(evt) {
						if (validateOperation()) {
							console.log(operationSchedule.doctypeAttr);
							scheduleOperation('MOVE', this);
							disableAndUnregisterFromListener(this);
						}
					}				
				}, "moveBtn${operation.id}").startup();
			
				if (conflictType === 'NO_CONFLICT') {
					operationSchedule.solutionType = 'NO_CONFLICT';
				} else if (conflictType === 'TO_SOLVE') {
					//
					// Connect to target domain button
					//
					var doctypeBtn = new Button({
						label : "Connect Doc. Type with target domain",
						onClick: function(evt) {
							operationSchedule.solutionType = 'CONNECT_DOCUMENT_TYPE_TO_TARGET_DOMAIN';
							domStyle.set(dom.byId('doctypeArea' + operationSchedule.operationId), 'display', 'none');
							domStyle.set(dom.byId('sourceDocumentTypeAttrArea' + operationSchedule.operationId), 'display', 'none');
					
							topic.publish('/togglerTriggerEventTopic', evt);
					
							//Inform other operations how the conflict has been solved.
							topic.publish('/connectToTargetDomainTopic', {operationId: operationSchedule.operationId, 
								targetFolderId: operationSchedule.targetFolderId, sourceDocumentType: operationSchedule.sourceDocumentType});
						}				
					}, "doctypeBtn${operation.id}|connectDocType${operation.id}").startup();
					//
					// Select another domain button
					//
					var anotherDoctypeBtn = new Button({
						label : 'Select another Doc. type',
						onClick: function(evt) {
							operationSchedule.solutionType = 'SELECT_ANOTHER_DOCUMENT_TYPE';
							this.set('disabled', true);
							topic.publish('/togglerTriggerEventTopic', evt);
						}				
					}, "anotherDocTypeBtn${operation.id}|sourceDocumentTypeAttrArea${operation.id}").startup();

					var newDocumentFamilySelect = dom.byId('family_${operation.id}');
					if (newDocumentFamilySelect) {
						on(newDocumentFamilySelect, 'change', function() {
							if (!this.value) {
								dom.byId('familyDocumentTypes_${operation.id}').innerHTML = '';
							} else {
								operationSchedule.selectedFamily= this.value;
								domStyle.set(dom.byId('familySpiner_${operation.id}'), 'display', 'inline');
								var docTypeSelectArea = dom.byId('document-type-select-area_${operation.id}');
								if (docTypeSelectArea) {
									domStyle.set(docTypeSelectArea, 'display', 'none');
								}
								request.get('rest/operation/familyDocumentTypes', { 
									query : {
										familyId : this.value,
										operationId : '${operation.id}'
									}
								}).then(function(data) {
									dom.byId('familyDocumentTypes_${operation.id}').innerHTML = data;
									eval(dom.byId('documentTypeScript_${operation.id}').innerHTML);
									domStyle.set(dom.byId('familySpiner_${operation.id}'), 'display', 'none');
								}, function(err) {
								}, function(evt) {
								});
							}});
					}
				}
			}
				
			//
			// Subscribe to messages emited by aggregated button.
			//
			topic.subscribe("/agregatedOperationTopic", function(operationDto) {
				console.log('Agregated button event: ' + operationDto.actionType);
				console.log(operationSchedule.solutionType);
				
				if (operationSchedule.operationStatus !== 'PLANNED' && (operationSchedule.solutionType === 'NO_CONFLICT' 
						|| operationSchedule.solutionType === 'CONNECT_DOCUMENT_TYPE_TO_TARGET_DOMAIN')) {
					
					switch(operationDto.actionType) {
					case 'COPY':
						console.log('copyBtn' + operationSchedule.operationId);
						registry.byId('copyBtn' + operationSchedule.operationId).onClick();
						break;
					case 'MOVE':
						registry.byId('moveBtn' + operationSchedule.operationId).onClick();
						break;
						default:
							console.log('Action type is not recognized: ' + operationDto.actionType);
						break;
					}
				}
			});
			
			//
			// Subscribe to topic that handle solutions based on the 'connect to target domain'.
			//
			var topicListener = topic.subscribe("/connectToTargetDomainTopic",	function(operationDto) {
				console.log("User solved conflict by connecting document to target domain: ", operationDto);

				// Do not process myself!
				if (operationDto.operationId === operationSchedule.operationId) {
					topic.publish("/conflictSolvedTopic", {operationId: operationSchedule.operationId});
					topicListener.remove();
					return;
				}
					
				console.log('OperationDTO: ' + operationDto.targetFolderId + '   OperationSchedule: '+ operationSchedule.targetFolderId);
				
				if (operationSchedule.conflictType === 'TO_SOLVE' && operationDto.targetFolderId === operationSchedule.targetFolderId 
						&& operationDto.sourceDocumentType === operationSchedule.sourceDocumentType) {
					
					operationSchedule.solutionType = 'CONNECT_DOCUMENT_TYPE_TO_TARGET_DOMAIN';

					var docTypeArea = dom.byId('doctypeArea' + operationSchedule.operationId),
						sourceDocumentTypeAttrArea = dom.byId('sourceDocumentTypeAttrArea' + operationSchedule.operationId),
						connectDocType = dom.byId('connectDocType' + operationSchedule.operationId);

					if (docTypeArea) {
						domStyle.set(docTypeArea, 'display', 'none');
					}
					if (sourceDocumentTypeAttrArea) {
						domStyle.set(sourceDocumentTypeAttrArea, 'display', 'none');
					}
					if (connectDocType) {
						domStyle.set(connectDocType, 'display', 'inline');
					}
					
					topic.publish("/conflictSolvedTopic", {operationId: operationSchedule.operationId});
					topicListener.remove();
				}
			});
		});
</script>
