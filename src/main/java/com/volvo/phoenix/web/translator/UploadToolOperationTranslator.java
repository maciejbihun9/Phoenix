package com.volvo.phoenix.web.translator;

import com.volvo.phoenix.document.dto.FolderDTO;
import com.volvo.phoenix.document.uploadtool.model.UploadToolOperation;
import com.volvo.phoenix.web.model.UploadToolOperationDTO;

public class UploadToolOperationTranslator {

    public static UploadToolOperationDTO toDTO(UploadToolOperation operation) {

        UploadToolOperationDTO uploadToolOperationDto = new UploadToolOperationDTO();
        // uploadToolOperationDto.setFolder(folderTranslator.translateToDTO2(operation.getFolder()));

        FolderDTO folderDto = new FolderDTO();
        folderDto.setPath(operation.getFolder().getPath());
        folderDto.setId(operation.getFolder().getId());
        uploadToolOperationDto.setFolder(folderDto);

        return uploadToolOperationDto;
    }
}
