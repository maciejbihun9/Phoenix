<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:if test="${not empty cf.sourceDocumentAttributes}">

	<div><span class="info-msg">Info</span>The document has the following optional attributes:
		<a id="togglerTrigger|sourceDocumentAttr${operation.id}" href="#" class="togglerOperation">Show details</a>
	</div>
	<div id="sourceDocumentAttr${operation.id}" class="toggledPane indention-10px group-attr indention-10px">
		<table>
			<c:forEach items="${cf.sourceDocumentAttributes}" var="attr">
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
					<td>
						<c:forEach items="${cf.lostSourceDocumentAttributes}" var="lostAttr">
							<c:if test="${lostAttr == attr.id.attributeId}">- the attribute not present in the target domain and will be lost</c:if>
						</c:forEach>
					</td>
				</tr>
			</c:forEach>
		</table>
	</div>
</c:if>