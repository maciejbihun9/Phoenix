<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:if test="${not empty documentTypeAttributes}">
	<div id="mandatory-attr">
	<div class="sub-header">Please fill the following mandatory attributes:</div>
		<div class="indention-10px">
		<table>
		<c:forEach items="${documentTypeAttributes}" var="attr">
			<tr>
				<td>${attr.label}</td>
				<td>
					<c:choose>
						<c:when test="${attr.type =='SELECT' }">
						<select data-doctype-attr="${attr.id}" onChange="this.style.backgroundColor=''">
							<option></option>
							<c:forEach items="${attr.dictionary.values}" var="lov">
								<option value="${lov.id}">${lov.value}</option>
							</c:forEach>
						</select>
						</c:when>
						<c:when test="${attr.type =='CHECKBOX' }"><input data-doctype-attr="${attr.id}" type="checkbox" value="Y" /></c:when>
						<c:otherwise><input data-doctype-attr="${attr.id}" type="text" onChange="this.style.backgroundColor=''"/></c:otherwise>
					</c:choose>
				</td>
			</tr>
		</c:forEach>
		</table>
		</div>
	</div>
</c:if>

