<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div id="document-type-select-area_${operationId}">
	<div class="default-row-hight">
	Select Document type <select id="documentType_${operationId}"
		name="documentType_${operationId}">
		<option></option>
		<c:forEach var="doctype" items="${documentTypes}">
			<option value="${doctype.id}">${doctype.name}</option>
		</c:forEach>
	</select>
	<span id="documentTypeSpiner_${operationId}" style="display: none"><img align="top" src="Project-Client/img/loading.gif" width="20px" height="20px" /></span>
	</div>
	<div data-operation-id="${operationId}"
		id="documentTypeAttributes_${operationId}"></div>
</div>

<script type="text/javascript" id="documentTypeScript_${operationId}">
	require([ "dojo/on", "dojo/dom-style", "dojo/dom", "dojo/request", "dojo/query", "dojo/domReady!" ], function(on, domStyle, dom, request, query) {
		var newDocumentTypeSelect = dom.byId("documentType_${operationId}");
		on(newDocumentTypeSelect, "change", function() {
			if (!this.value) {
				dom.byId("documentTypeAttributes_${operationId}").innerHTML = '';
			} else {
				domStyle.set(dom.byId('documentTypeSpiner_${operationId}'), 'display', 'inline');
				request.get("rest/operation/documentTypeAttributes", { 
					query : {
						documentTypeId : this.value
					}
				}).then(function(data) {
					dom.byId("documentTypeAttributes_${operationId}").innerHTML = data;
					domStyle.set(dom.byId('documentTypeSpiner_${operationId}'), 'display', 'none');
				}, function(err) {
				}, function(evt) {
				});
			}});
		});
</script>