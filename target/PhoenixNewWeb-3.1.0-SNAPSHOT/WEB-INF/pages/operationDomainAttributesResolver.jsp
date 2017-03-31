<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:if test="${not empty cf.sourceDocumentAttributes || not empty cf.targetDomainAttributes}">
	<div class="operation-required-step">Optional attributes (can be omitted):</div>
	<div class="indention-10px">
		<div>
			<jsp:include page="sourceDomainAttributes.jsp" />
		</div>
		<div>
			<jsp:include page="targetDomainAttributes.jsp" />
		</div>
	</div>
</c:if>
