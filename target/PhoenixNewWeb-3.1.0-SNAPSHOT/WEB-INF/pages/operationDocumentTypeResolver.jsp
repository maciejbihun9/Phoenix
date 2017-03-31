<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div>
Status
<span class="operation-conflicted">NOT OK</span><span> Doc. type of selected document (${cf.sourceDocumentTypeDTO.name}) is not connected with target domain(${cf.targetDomainDTO.name}).</span>
<div>To resolve this conflict<span class="operation-solution">Connect doc. type <strong>(${cf.sourceDocumentTypeDTO.name})</strong> with target domain <strong>(${cf.targetDomainDTO.name})</strong> or select another doc. type for this document.</span>
</div>
</div>

<div class="operation-required-step">Required step to solve the conflict:</div>
<div class="operation-mandatory-fields">
	<div id="doctypeArea${operation.id}">
	<span>
		<button id="doctypeBtn${operation.id}|connectDocType${operation.id}"></button>
	</span>
	<span>
		<button id="anotherDocTypeBtn${operation.id}|sourceDocumentTypeAttrArea${operation.id}"></button>
	</span>
	</div>

<div id="connectDocType${operation.id}" class="toggledPane">Doc. Type ${cf.sourceDocumentTypeDTO.name} is connected to domain ${cf.targetDomainDTO.name}.</div>

<br/>
<div id="sourceDocumentTypeAttrArea${operation.id}" class="toggledPane">
	<div>
		<c:if test="${not empty cf.sourceDocumentTypeAttributes}">
			<span class="info-msg">Info</span>Mandatory attributes connected to this Doc type will be lost. <a id="sourceDoctypeAttr${operation.id}|sourceDocumentTypeAttr${operation.id}" href="#" class="togglerOperation">Show details</a>
			<div id="sourceDocumentTypeAttr${operation.id}" class="toggledPane group-attr indention-10px">
				<table>
					<c:forEach items="${cf.sourceDocumentTypeAttributes}" var="attr">
						<tr>
							<td>${attr.attribute.label}:</td>
							<td>
								<c:choose>
									<c:when test="${attr.attribute.type =='CHECKBOX' }">
										<input type="checkbox" value="Y" <c:if test="${not empty attr.value}">checked</c:if> readonly="readonly">
									</c:when>
									<c:when test="${attr.attribute.type =='SELECT' }">
										<input type="text" value="${attr.dictionaryValue !=null ? attr.dictionaryValue : ""}" readonly="readonly">
									</c:when>
									<c:otherwise>
										<input type="text" value="${attr.value !=null ? attr.value : ""}" readonly="readonly">
									</c:otherwise>
								</c:choose>
							</td>
						</tr>
					</c:forEach>
				</table>
			</div>
		</c:if>
	</div>

	<div id="domainFamilies${operation.id}">
		<div class="default-row-hight">Select Family
			<select id="family_${operation.id}" name="family_${operation.id}">
				<option></option>
				<c:forEach var="family" items="${cf.targetFamilies}">
					<option value="${family.id}">${family.name}</option>
				</c:forEach>
			</select>
			<span id="familySpiner_${operation.id}" style="display: none;"><img align="top" src="Project-Client/img/loading.gif" width="20px" height="20px" /></span>
		</div>
		<div data-operation-id="${operation.id}" id="familyDocumentTypes_${operation.id}"></div>
	</div>

</div>
</div>