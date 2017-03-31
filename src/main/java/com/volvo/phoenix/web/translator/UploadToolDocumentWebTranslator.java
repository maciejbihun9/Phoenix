package com.volvo.phoenix.web.translator;

import com.volvo.phoenix.document.datatype.InfoClass;
import com.volvo.phoenix.document.uploadtool.model.UploadToolDocument;
import com.volvo.phoenix.web.model.UploadToolDocumentWebDTO;
import java.text.SimpleDateFormat;

public class UploadToolDocumentWebTranslator {

    public static UploadToolDocumentWebDTO toDTO(UploadToolDocument uploadToolDocument) {

        UploadToolDocumentWebDTO dto = new UploadToolDocumentWebDTO();
        dto.setDocId(uploadToolDocument.getId());
        dto.setRevision(uploadToolDocument.getRevision());
        dto.setName(uploadToolDocument.getName());
        dto.setDocumentTitle(uploadToolDocument.getTitle());
        dto.setAltDocId(uploadToolDocument.getAltDocId());
        dto.setAuthor(uploadToolDocument.getAuthor());
        dto.setAuthorId(uploadToolDocument.getAuthorId());
        dto.setDescription(uploadToolDocument.getDescription());
        dto.setIssueDate(new SimpleDateFormat("yyyy-MM-dd").format(uploadToolDocument.getIssueDate()));
        dto.setIssuer(uploadToolDocument.getIssuer());
        dto.setIssuerId(uploadToolDocument.getIssuerId());
        dto.setNotes(uploadToolDocument.getNotes());
        dto.setProtectInWork(uploadToolDocument.getProtectInWork() ? "checked" : "");
        dto.setInfoClass(uploadToolDocument.getStateId() == null
                ? null : InfoClass.getInfoClass(uploadToolDocument.getStateId().intValue()).getName());
        dto.setStatus(uploadToolDocument.getStatus() == null ? null : uploadToolDocument.getStatus().getDescription());
        dto.setFamilyId(uploadToolDocument.getFamily() == null ? null : uploadToolDocument.getFamily().getId());
        dto.setFamily(uploadToolDocument.getFamily() == null ? null : uploadToolDocument.getFamily().getName());
        dto.setTypeId(uploadToolDocument.getType() == null ? null : uploadToolDocument.getType().getId());
        dto.setType(uploadToolDocument.getType() == null ? null : uploadToolDocument.getType().getName());

        return dto;
    }

}
