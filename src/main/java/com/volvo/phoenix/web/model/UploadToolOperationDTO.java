package com.volvo.phoenix.web.model;

import java.util.List;

import com.volvo.phoenix.document.dto.FolderDTO;
import com.volvo.phoenix.document.uploadtool.application.dto.UploadToolTreeNodeDTO;
import com.volvo.phoenix.document.uploadtool.model.UploadToolOperationStatus;

public class UploadToolOperationDTO {
    
    private Long id;
    private FolderDTO folder;
    private UploadToolOperationStatus status;
    private List<UploadToolTreeNodeDTO> uploadToolTreeNodesListDTOs;

    public FolderDTO getFolder() {
        return folder;
    }

    public void setFolder(FolderDTO folder) {
        this.folder = folder;
    }

    public UploadToolOperationStatus getStatus() {
        return status;
    }

    public void setStatus(UploadToolOperationStatus status) {
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<UploadToolTreeNodeDTO> getUploadToolTreeNodesListDTOs() {
        return uploadToolTreeNodesListDTOs;
    }

    public void setUploadToolTreeNodesListDTOs(List<UploadToolTreeNodeDTO> uploadToolTreeNodesListDTOs) {
        this.uploadToolTreeNodesListDTOs = uploadToolTreeNodesListDTOs;
    }
    
    
    
}
