<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<div class="operation-optional-section" data-operation-id="${operation.id}" id="domainAttributes_${operation.id}">
	<c:if test="${fn:length(cf.targetDomainAttributes)>0 }">
		<div>Target domain has the following optional attributes (fill them if needed):
		<div class="group-attr indention-10px">
		<table>
			<c:forEach items="${cf.targetDomainAttributes}" var="attr">
				<tr>
					<td>${attr.label}</td>
					<td>
						<c:choose>
							<c:when test="${attr.type =='SELECT' }">
								<select data-domain-attr="${attr.id}">
									<option></option>
									<c:forEach items="${attr.dictionary.values}" var="lov">
										<option value="${lov.id}">${lov.value}</option>
									</c:forEach>
								</select>
							</c:when>
							<c:when test="${attr.type =='CHECKBOX' }">
								<input data-domain-attr="${attr.id}" type="checkbox" value="Y">
							</c:when>
							<c:otherwise>
								<input data-domain-attr="${attr.id}" type="text">
							</c:otherwise>
						</c:choose>
					</td>
				</tr>
			</c:forEach>
		</table>
		</div>
		</div>
	</c:if>
</div>