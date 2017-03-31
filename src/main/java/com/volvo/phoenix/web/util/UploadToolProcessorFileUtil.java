package com.volvo.phoenix.web.util;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.volvo.phoenix.document.uploadtool.application.UploadToolService;
import com.volvo.phoenix.document.uploadtool.application.dto.UploadToolDocumentDTO;
import com.volvo.phoenix.document.uploadtool.application.dto.UploadToolTreeNodeDTO;
import com.volvo.phoenix.document.uploadtool.model.UploadToolNodeType;
import com.volvo.phoenix.web.exceptions.MetaDataException;

@Component
public class UploadToolProcessorFileUtil {

    private final static Logger LOGGER = LoggerFactory.getLogger(UploadToolProcessorFileUtil.class);
    
    private static final String FILENAME = "Filename";
    private static final String FOLDER = "Folder";
    private static final String ZIP = ".zip";
    private static final String METADATA = "metadata.xlsx";
    
    
    @Autowired
    private UploadToolService uploadToolService;


    public List<UploadToolTreeNodeDTO> createOperationTreeRepresentationList(Long operationId) throws MetaDataException, IOException {

        List<UploadToolTreeNodeDTO> treNodeDTOList = new ArrayList<UploadToolTreeNodeDTO>();
        String storeLocation = uploadToolService.getStoreLocation(operationId);
        File uploadToolOperationFile = new File(storeLocation);

        // get uploaded file names
        String[] uploadedFileList = uploadToolOperationFile.list();
        String operationFolder = uploadToolOperationFile.getPath();

        for (int j = 0; j < uploadedFileList.length; j++) {
            String nameWithoutZip = "";
            String uploadedFileName = uploadedFileList[j];
            File uploadedFile = null;
            if (uploadedFileName.contains(ZIP)) {
                nameWithoutZip = uploadedFileName.substring(0, uploadedFileName.indexOf("."));
                try {
                    uploadedFile = UnzipUtility.unzip(operationFolder + File.separator + uploadedFileList[j], uploadToolOperationFile.getPath() + File.separator
                            + nameWithoutZip);
                } catch (IOException e) {
                    e.printStackTrace();
                    throw new IOException();
                }

                LOGGER.info("Uploaded file path : {}", uploadedFile);

            } else {
                uploadedFile = uploadToolOperationFile.listFiles()[j];
            }
            String fileLocation = storeLocation + File.separator + nameWithoutZip;
                      
            treNodeDTOList.addAll(getRootFileChildNodes(uploadedFileName, uploadedFile, fileLocation));

        }
        return treNodeDTOList;
    }


    public List<UploadToolTreeNodeDTO> getRootFileChildNodes(String uploadedFileName, File unzippedFile, String storeLocation) throws MetaDataException {

        UploadToolTreeNodeDTO rootNode = null;
        List<UploadToolTreeNodeDTO> treeNodes = new ArrayList<UploadToolTreeNodeDTO>();
        String cutedFolderName = "";
        File[] listFiles = unzippedFile.listFiles();
        //check is folder is empty if is move to it
        if (listFiles != null && listFiles.length == 1) {
            cutedFolderName = unzippedFile.getName();
            listFiles = listFiles[0].listFiles();
        }
        
        // There is metadata.
        if (listFiles != null) {
            if (MetadataChecker.isMetadataExist(listFiles)) {
                File excelFile = null;
                for (int i = 0; i < listFiles.length; i++) {
                    if (listFiles[i].getName().equalsIgnoreCase(METADATA)) {
                        excelFile = listFiles[i];
                        break;
                    }
                }
                List<UploadToolDocumentDTO> uploadToolDocuments = null;
                try {
                    uploadToolDocuments = MetadataParser.parseMetadata(excelFile);
                } catch(MetaDataException ex){
                    throw new MetaDataException(ex.getMetadataStatus(), uploadedFileName);
                }                
                for (int i = 0; i < listFiles.length; i++) {
                    rootNode = createTreeNodeIfThereIsMetadata(listFiles[i], uploadToolDocuments, null, storeLocation,cutedFolderName);
                    treeNodes.add(rootNode);
                }
            } else {
                // There is no metadata.
                for (int i = 0; i < listFiles.length; i++) {
                    rootNode = createTreeNodeIfThereIsNoMetadata(listFiles[i], null, storeLocation);
                    treeNodes.add(rootNode);
                }
            }
          //simple one element  
        } else {
            rootNode = createTreeNodeIfThereIsNoMetadata(unzippedFile, null, storeLocation);
            treeNodes.add(rootNode);
        }
        return treeNodes;
    }

    private UploadToolTreeNodeDTO createTreeNodeIfThereIsMetadata(File file, List<UploadToolDocumentDTO> uploadToolDocuments,
            UploadToolNodeType parentNodeType, String storeLocation, String cutedFolderName) throws IllegalStateException {

        File[] listFiles = file.listFiles();
        UploadToolTreeNodeDTO treeNode = createUploadToolTreeNodeDTO(file);
        String pathToFile = HelperMethods.createPathToCompare(file.getPath(), storeLocation, cutedFolderName);
        
        for (UploadToolDocumentDTO document : uploadToolDocuments) {
            String refactorPathFormProperty = HelperMethods.replaceToFileSeparatorSystem(document.getDocumentProperties().get("Folder"));
      
            if (!refactorPathFormProperty.equals(File.separator)) {
                refactorPathFormProperty += File.separator + document.getDocumentProperties().get("Filename");
            } else {
                refactorPathFormProperty += document.getDocumentProperties().get("Filename");
            }

            if (pathToFile.equals(refactorPathFormProperty)) {
                treeNode.setDocument(document);
                treeNode.setNodeType(UploadToolNodeType.D);
            }

        }
        List<UploadToolTreeNodeDTO> childNodes = new ArrayList<UploadToolTreeNodeDTO>();

        if (FileType.isDocument(file, parentNodeType)) {
            treeNode.setNodeType(UploadToolNodeType.D);

            if (listFiles != null) {
                for (int i = 0; i < listFiles.length; i++) {
                    UploadToolTreeNodeDTO innerTreeNode = createTreeNodeIfThereIsMetadata(listFiles[i], uploadToolDocuments, UploadToolNodeType.D,
                                                                                          storeLocation, cutedFolderName);
                    if (!innerTreeNode.getName().equalsIgnoreCase(METADATA)) {
                        childNodes.add(innerTreeNode);
                    }
                }
            }

            // set attached file only when this is not folder document
            if (listFiles == null) {
                childNodes.add(createAttachedFile(file, cutedFolderName));
            }

        } else if (FileType.isSlaveFolder(file)) {
            treeNode.setNodeType(UploadToolNodeType.S);
            for (int i = 0; i < listFiles.length; i++) {
                UploadToolTreeNodeDTO innerTreeNode = createTreeNodeIfThereIsMetadata(listFiles[i], uploadToolDocuments, UploadToolNodeType.S, storeLocation, cutedFolderName);
                if (!innerTreeNode.getName().equalsIgnoreCase(METADATA)) {
                    childNodes.add(innerTreeNode);
                }
            }
        } else if (FileType.isAttachedFile(file, parentNodeType)) {
            treeNode.setNodeType(UploadToolNodeType.F);
            treeNode.setAbsolutePath(file.getAbsolutePath());
        }
        treeNode.setChildren(childNodes);
        return treeNode;
    }

    private UploadToolTreeNodeDTO createTreeNodeIfThereIsNoMetadata(File file, UploadToolNodeType parentNodeType, String storeLocation) {

        UploadToolTreeNodeDTO treeNode = createUploadToolTreeNodeDTO(file);
        UploadToolDocumentDTO document = new UploadToolDocumentDTO();
        document.addDocumentProperty(FILENAME, file.getName());

        String pathFromRoot = HelperMethods.createPathToCompare(file.getPath(), storeLocation, "");
        document.addDocumentProperty(FOLDER, pathFromRoot);

        File[] listFiles = file.listFiles();
        
        List<UploadToolTreeNodeDTO> childNodes = new ArrayList<UploadToolTreeNodeDTO>();

        if (FileType.isDocument(file, parentNodeType)) {

            treeNode.setNodeType(UploadToolNodeType.D);
            treeNode.setDocument(document);

            if (listFiles != null) {
                for (int i = 0; i < listFiles.length; i++) {
                    childNodes.add(createTreeNodeIfThereIsNoMetadata(listFiles[i], UploadToolNodeType.D, storeLocation));
                }
            }

            // set attached file only when this is not folder document
            if (listFiles == null) {
                childNodes.add(createAttachedFile(file, ""));
            }

        } else if (FileType.isSlaveFolder(file)) {
            treeNode.setNodeType(UploadToolNodeType.S);
            for (int i = 0; i < listFiles.length; i++) {
                childNodes.add(createTreeNodeIfThereIsNoMetadata(listFiles[i], UploadToolNodeType.S, storeLocation));
            }
        } else if (FileType.isAttachedFile(file, parentNodeType)) {
            treeNode.setNodeType(UploadToolNodeType.F);
            treeNode.setAbsolutePath(file.getAbsolutePath());
        }
        treeNode.setChildren(childNodes);

        return treeNode;
    }
    
   
    private UploadToolTreeNodeDTO createAttachedFile(File file, String cutedFolderName) {
        UploadToolTreeNodeDTO attachedFileNode = new UploadToolTreeNodeDTO();
        attachedFileNode.setName(file.getName());
        attachedFileNode.setNodeType(UploadToolNodeType.F);
        attachedFileNode.setAbsolutePath(file.getAbsolutePath());
          
       return attachedFileNode;
    }

    private UploadToolTreeNodeDTO createUploadToolTreeNodeDTO(File file) {
        UploadToolTreeNodeDTO treeNode = new UploadToolTreeNodeDTO();
        treeNode.setName(file.getName());
        return treeNode;
    }

}
