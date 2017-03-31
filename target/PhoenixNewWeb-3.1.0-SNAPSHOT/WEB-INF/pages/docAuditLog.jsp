<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<style>
.docAuditLogTable{
	width: 100%;
	border-spacing : 0px;	
	table-layout: fixed;
}
.docAuditLogColumn{
  vertical-align: top;
  text-align: left;
}
.longText {
   padding-left: 5px;  
   word-wrap: break-word;
}
</style>



<table class="docAuditLogTable">
	<colgroup>
		<col style="width: 50%" class="docAuditLogColumn"/>
		<col style="width: 50%" class="docAuditLogColumn"/>		
	</colgroup>
	<tr>
		<td class="docAuditLogColumn"><h3>From:</h3><div class="longText">${docAuditLog.sourcePath}</div></td>
		<td class="docAuditLogColumn"><h3>To:</h3><div class="longText">${docAuditLog.targetPath}</div></td>
	</tr>
	<tr>
		<td class="docAuditLogColumn"><h3>Domain:</h3><div class="longText">${docAuditLog.sourceDomain}</div></td>
		<td class="docAuditLogColumn"><h3>Domain:</h3><div class="longText">${docAuditLog.targetDomain}</div></td>
	</tr>
	<tr>
		<td class="docAuditLogColumn"><h3>Doc Type:</h3><div class="longText">${docAuditLog.sourceDocType}</div></td>
		<td class="docAuditLogColumn"><h3>Doc Type:</h3><div class="longText">${docAuditLog.targetDocType}</div></td>
	</tr>
	<tr>
		<td class="docAuditLogColumn"><h3>Mandatory attributes:</h3>
			<table>
				<c:forEach var="sourceMandatoryAttr"
					items="${docAuditLog.sourceMandatoryAttributes}">
					<tr>
						<td class="docAuditLogColumn">${sourceMandatoryAttr.name} : </td>
						<td class="docAuditLogColumn">${sourceMandatoryAttr.value}</td>
					</tr>
				</c:forEach>
			</table></td>
		<td class="docAuditLogColumn"><h3>Mandatory attributes:</h3>
			<table>
				<c:forEach var="targetMandatoryAttr"
					items="${docAuditLog.targetMandatoryAttributes}">
					<tr>
						<td class="docAuditLogColumn">${targetMandatoryAttr.name} : </td>
						<td class="docAuditLogColumn">${targetMandatoryAttr.value}</td>
					</tr>
				</c:forEach>
			</table></td>
	</tr>
	<tr>
		<td class="docAuditLogColumn"><h3>Optional attributes:</h3>
			<table>
				<c:forEach var="sourceOptionalAttr"
					items="${docAuditLog.sourceOptionalAttributes}">
					<tr>
						<td class="docAuditLogColumn">${sourceOptionalAttr.name} : </td>
						<td class="docAuditLogColumn">${sourceOptionalAttr.value}</td>
					</tr>
				</c:forEach>
			</table></td>
		<td class="docAuditLogColumn"><h3>Optional attributes:</h3>
			<table>
				<c:forEach var="targetOptionalAttr"
					items="${docAuditLog.targetOptionalAttributes}">
					<tr>
						<td class="docAuditLogColumn">${targetOptionalAttr.name} : </td>
						<td class="docAuditLogColumn">${targetOptionalAttr.value}</td>
					</tr>
				</c:forEach>
			</table></td>
	</tr>
</table>
