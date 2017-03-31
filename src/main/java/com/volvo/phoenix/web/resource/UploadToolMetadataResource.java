package com.volvo.phoenix.web.resource;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.volvo.phoenix.document.uploadtool.application.dto.UploadToolDocumentAttributeValueDTO;
import com.volvo.phoenix.document.uploadtool.application.UploadToolService;
import com.volvo.phoenix.document.uploadtool.application.UploadToolDocumentService;
import com.volvo.phoenix.document.uploadtool.application.dto.UploadToolTreeNodeDTO;
import com.volvo.phoenix.web.model.UploadToolDocumentWebDTO;
import com.volvo.phoenix.web.translator.UploadToolDocumentWebTranslator;

@RestController
@RequestMapping("/uploadtool/metadata")
public class UploadToolMetadataResource {

    @Autowired
    private UploadToolService uts;

    @Autowired
    private UploadToolDocumentService uploadToolDocumentService;

    @RequestMapping(value = "/getDocumentAttachements/{nodeId}", method = RequestMethod.GET, produces = "application/json")
    public List<UploadToolTreeNodeDTO> getUploadToolOperationDocumentAttachements(@PathVariable(value = "nodeId") long nodeId) {
        return uts.getDocumentAttachments(nodeId);
    }

    @RequestMapping(value = "/getUploadToolOperationDocument/{nodeId}", method = RequestMethod.GET, produces = "application/json")
    public UploadToolDocumentWebDTO getUploadToolOperationDocument(@PathVariable(value = "nodeId") long nodeId) {
        return UploadToolDocumentWebTranslator.toDTO(uploadToolDocumentService.getUploadToolDocumentByRootNode(nodeId));
    }

    @RequestMapping(value = "/getDocumentOptionalAttrValues/{nodeId}", method = RequestMethod.GET, produces = "application/json")
    public List<UploadToolDocumentAttributeValueDTO> getDocumentOptionalAttrValues(@PathVariable(value = "nodeId") long nodeId) {
        return uts.getDocumentOptionalAttrValues(nodeId);
    }

    @RequestMapping(value = "/getDocumentMandatoryAttrValues/{nodeId}", method = RequestMethod.GET, produces = "application/json")
    public List<UploadToolDocumentAttributeValueDTO> getDocumentMandatoryAttrValues(@PathVariable(value = "nodeId") long nodeId) {
        return uts.getDocumentMandatoryAttrValues(nodeId);
    }
}
