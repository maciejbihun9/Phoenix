package com.volvo.phoenix.web.resource;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.volvo.phoenix.document.datatype.MetadataStatus;
import com.volvo.phoenix.document.uploadtool.application.UploadToolService;
import com.volvo.phoenix.document.uploadtool.application.UploadToolDocumentService;
import com.volvo.phoenix.document.uploadtool.application.dto.UploadToolOperationConflictDTO;
import com.volvo.phoenix.document.uploadtool.application.dto.UploadToolTreeNodeDTO;
import com.volvo.phoenix.document.uploadtool.model.UploadToolOperationFile;
import com.volvo.phoenix.web.exceptions.MetaDataException;
import com.volvo.phoenix.web.model.UploadProgres;
import com.volvo.phoenix.web.model.UploadToolOperationDTO;
import com.volvo.phoenix.web.translator.UploadToolOperationTranslator;
import com.volvo.phoenix.web.util.HelperMethods;
import com.volvo.phoenix.web.util.UploadToolProcessorFileUtil;

@RestController
@RequestMapping("/uploadtool/operation/{operationId}")
public class UploadToolOperationResource {

    private static final String ZIP = ".zip";

    @Autowired
    private UploadToolService uts;

    @Autowired
    private UploadToolDocumentService uploadToolDocumentService;

    @Autowired
    private UploadToolProcessorFileUtil uploadToolProcessor;

    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    public UploadToolOperationDTO getUploadToolOperation(@PathVariable(value = "operationId") long operationId) {
        return UploadToolOperationTranslator.toDTO(uts.getOperation(operationId));
    }

    @RequestMapping(value = "/filesWithNoMetadata", method = RequestMethod.GET, produces = "application/json")
    public List<String> getUploadedZIPFilesWithNoMetadata(@PathVariable(value = "operationId") long operationId) {
        return uts.getUploadedZIPFilesWithNoMetadata(operationId);
    }

    @RequestMapping(value = "/processUpload", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity processUpload(@PathVariable(value = "operationId") long operationId) throws IOException {
        List<UploadToolOperationFile> uploadedFiles = new ArrayList<UploadToolOperationFile>();
        File operationFile = new File(uts.getStoreLocation(operationId));

        for (File file : operationFile.listFiles()) {
            UploadToolOperationFile uploadedFile = new UploadToolOperationFile();
            uploadedFile.setFileName(file.getName());
            uploadedFile.setFileType(HelperMethods.fileIsZip(file));
            uploadedFile.setSize(file.length());
            if (file.getName().contains(ZIP) && HelperMethods.containsMetadata(file)) {
                uploadedFile.setMetadataStatus(MetadataStatus.METADATA_OK);
            } else {
                uploadedFile.setMetadataStatus(MetadataStatus.NO_METADATA);
            }

            uploadedFiles.add(uploadedFile);
        }

        try {
            List<UploadToolTreeNodeDTO> treeRepresentationList = uploadToolProcessor.createOperationTreeRepresentationList(operationId);
            uts.addDocumentTree(operationId, treeRepresentationList);
            uts.validateDocumentTree(operationId); //UT_DOCUMENTs are created here - when MetadataException occurs this will not be called;

        } catch (MetaDataException exception) {

            for (UploadToolOperationFile utOperationFile : uploadedFiles) {
                if (utOperationFile.getFileName().equalsIgnoreCase(exception.getFileName())) {
                    utOperationFile.setMetadataStatus(MetadataStatus.valueOf(exception.getMetadataStatus()));
                }
            }
            uts.addUploadedFilesInformation(operationId, uploadedFiles);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(exception.getMetadataStatus());

        }
        uts.addUploadedFilesInformation(operationId, uploadedFiles);
        return ResponseEntity.status(HttpStatus.OK).body("Every thing went ok");
    }

    @RequestMapping(value = "/getOperationChildTreeNode/{nodeId}", method = RequestMethod.GET, produces = "application/json")
    public UploadToolTreeNodeDTO getUploadToolOperationChildTreeNode(@PathVariable(value = "operationId") long operationId,
            @PathVariable(value = "nodeId") Long nodeId) {
        if (nodeId.equals(-1L)) {
            UploadToolTreeNodeDTO root = new UploadToolTreeNodeDTO();
            root.setId(-1L);
            root.setName(uts.getOperation(operationId).getFolder().getText());
            root.setChildren(uts.getOperationTreeRootNodes(operationId));
            return root;
        }
        return uts.geOperationTreeNodeDTO(nodeId);
    }

    @RequestMapping(value = "/validation", method = RequestMethod.GET, produces = "application/json")
    public List<UploadToolOperationConflictDTO> getConflictsInfo(@PathVariable(value = "operationId") long operationId) {
        return uts.getConflictsForOperation(operationId);
    }

    @RequestMapping(value = "/applyUpload", method = RequestMethod.GET, produces = "application/json")
    public List<String> applyUpload(@PathVariable(value = "operationId") long operationId) throws Exception {
        List<String> result = new ArrayList<String>();
        uts.applyUpload(operationId);
        return result;
    }

    @RequestMapping(value = "/operationValidatedDocuments", method = RequestMethod.GET, produces = "application/json")
    public int uploadToolOperationValidatedDocuments(@PathVariable(value = "operationId") long operationId) {
        return uploadToolDocumentService.getUploadToolValidatedDocumentsNumber(operationId);
    }

    @RequestMapping(value = "/allDocumentsToBeCreated", method = RequestMethod.GET, produces = "application/json")
    public int uploadToolOperationTotalNumberOfDocumentsToBeCreated(@PathVariable(value = "operationId") long operationId) {
        return uts.getTotalNumberOfDocuments(operationId);
    }

    @RequestMapping(value = "/uploadProgres", method = RequestMethod.GET, produces = "application/json")
    public UploadProgres uploadToolOperationUploadProgres(@PathVariable(value = "operationId") long operationId) {
        UploadProgres up = new UploadProgres();
        up.setNumerOfDocumentsProcesed(uploadToolDocumentService.getUploadToolValidatedDocumentsNumber(operationId));
        up.setTotalNumerOfDocuments(uts.getTotalNumberOfDocuments(operationId));

        return up;
    }
}
