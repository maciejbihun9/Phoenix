package com.volvo.phoenix.web.util;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.volvo.phoenix.document.datatype.MetadataStatus;
import com.volvo.phoenix.document.uploadtool.application.dto.UploadToolTreeNodeDTO;
import com.volvo.phoenix.document.uploadtool.model.UploadToolNodeType;
import com.volvo.phoenix.web.exceptions.MetaDataException;


public class UploadToolProcessorTest {

    private final String targetTestPath = "target" + File.separator + "testFolder";
    private final File targetTestFileFolder = new File(targetTestPath);
    private UploadToolProcessorFileUtil uploadToolProcessorFileUtil;
    private static final String testFiles = "src" + File.separator + "test" + File.separator + "resources" + File.separator + "files";
    private final String fileWithoutMetadata = targetTestPath + File.separator + "TestNoMetadata";
    private final String fileWithMetadata = targetTestPath + File.separator+ "Test2";
    private final String fileWithNoMetadataSheet = targetTestPath + File.separator+ "TestMetadataWithNoMetadataSheet";
    private final String fileWithNotParsingMetadata = targetTestPath + File.separator+ "TestMetadataWithNotParsingMetadata";
    private final String fileWithFolderInside = targetTestPath + File.separator+ "TestWithFolderInside";
    
    final static Logger logger = LoggerFactory.getLogger(UploadToolProcessorTest.class);
    
    
    @Before
    public void initalize() throws IOException {
        UploadToolTestHelper.copyFileTo(new File(testFiles), targetTestFileFolder);
        uploadToolProcessorFileUtil = new UploadToolProcessorFileUtil();
    }
    
    @Test
    public void testFileWithoutMetadata() throws IOException, MetaDataException {
        //given
        testNodes(fileWithoutMetadata);
    }
    
    @Test
    public void testFileWithMetadata() throws IOException, MetaDataException {
        // given
        testNodes(fileWithMetadata); 
    }
    @Test
    public void testWithFolderInside() throws IOException, MetaDataException {
        // given
        testNodes(fileWithFolderInside); 
    }
    
    @Test(expected=MetaDataException.class)
    public void testFilewithNoMetadataSheet() throws MetaDataException {
        
        File file = new File(fileWithNoMetadataSheet);
        String storeLocation = "src" + File.separator + "test" + File.separator + "resources" + File.separator + "files";

        uploadToolProcessorFileUtil.getRootFileChildNodes(file.getName(), file, storeLocation);
    }
    
    @Test
    public void testFilewithNoMetadataSheetFoleName(){
        
        File file = new File(fileWithNoMetadataSheet);
        String storeLocation = "src" + File.separator + "test" + File.separator + "resources" + File.separator + "files";

        try {
            uploadToolProcessorFileUtil.getRootFileChildNodes(file.getName(), file, storeLocation);
        } catch (MetaDataException e) {
                assertEquals("TestMetadataWithNoMetadataSheet", e.getFileName());
                assertThat(MetadataStatus.NO_TAB_CALLED_METADATA.toString(),equalTo(e.getMetadataStatus()));
        }
    }
    
    @Test(expected=MetaDataException.class)
    public void testFilewithNotParsingMetadataException() throws MetaDataException {
        
        File file = new File(fileWithNotParsingMetadata);
        String storeLocation = "src" + File.separator + "test" + File.separator + "resources" + File.separator + "files";

        uploadToolProcessorFileUtil.getRootFileChildNodes(file.getName(), file, storeLocation);
    }
    
    @Test
    public void testFilewithNotParsingMetadata(){
        
        File file = new File(fileWithNotParsingMetadata);
        String storeLocation = "src" + File.separator + "test" + File.separator + "resources" + File.separator + "files";

        try {
            uploadToolProcessorFileUtil.getRootFileChildNodes(file.getName(), file, storeLocation);
        } catch (MetaDataException e) {
                assertEquals("TestMetadataWithNotParsingMetadata", e.getFileName());
                assertThat(MetadataStatus.BAD_EXCEL_VERSION.toString(),equalTo(e.getMetadataStatus()));
        }
  }
    
    private void testNodes(String resourceFile) throws MetaDataException {
     // given
        File file = new File(resourceFile);
        String storeLocation = "src" + File.separator + "test" + File.separator + "resources" + File.separator + "files";

     // when
        List<UploadToolTreeNodeDTO> rootFileChildNodes = uploadToolProcessorFileUtil.getRootFileChildNodes(file.getName(), file, storeLocation);
        
            //Document_1 nodes
        UploadToolTreeNodeDTO node_document_1 = getElementByName("Document_1", rootFileChildNodes);
        UploadToolTreeNodeDTO node_attachment_21 = getElementByName("Attachment_21.txt", getElementByName("Document_1", rootFileChildNodes).getChildren()); 
        
            //Folder_11 nodes
        UploadToolTreeNodeDTO node_folder_1 = getElementByName("Folder_1", rootFileChildNodes);
        UploadToolTreeNodeDTO node_folder_11 = getElementByName("Folder_11",getElementByName("Folder_1", rootFileChildNodes).getChildren());
        
        UploadToolTreeNodeDTO node_document_111 = getElementByName("Document_111",getElementByName("Folder_11",
        getElementByName("Folder_1", rootFileChildNodes).getChildren()).getChildren());
        
        UploadToolTreeNodeDTO node_attachment_1111 = getElementByName("Attachment_1111.txt",getElementByName("Document_111",getElementByName("Folder_11",
        getElementByName("Folder_1", rootFileChildNodes).getChildren()).getChildren()).getChildren());
        
        UploadToolTreeNodeDTO node_document_13 = getElementByName("Document_112.txt",getElementByName("Folder_11",getElementByName("Folder_1", rootFileChildNodes).getChildren()).getChildren());
        
            //Document)2 node
        UploadToolTreeNodeDTO node_document_2 = getElementByName("Document_2.txt", rootFileChildNodes);
        
        logger.info("Node document 1", node_document_1.toString());
        logger.info("Node document 1", node_document_1.toString());
        logger.info("Node document 1", node_document_1.toString());
        logger.info("Node document 1", node_document_1.toString());
        
        //then
            //document 1 nodes
        assertThat(node_document_1.getChildren().size(), equalTo(1));
        assertThat(node_document_1.getNodeType(), equalTo(UploadToolNodeType.D));
        assertThat(node_attachment_21.getChildren().size(), equalTo(0));
        assertThat(node_attachment_21.getNodeType(), equalTo(UploadToolNodeType.F));
        
            //folder 1 nodes
        assertThat(node_folder_1.getChildren().size(), equalTo(3));
        assertThat(node_folder_1.getNodeType(), equalTo(UploadToolNodeType.S));
        assertThat(node_folder_11.getChildren().size(), equalTo(2));
        assertThat(node_folder_11.getNodeType(), equalTo(UploadToolNodeType.S));
        assertThat(node_document_111.getNodeType(), equalTo(UploadToolNodeType.D));
        assertThat(node_document_111.getChildren().size(),equalTo(2));
        assertThat(node_attachment_1111.getNodeType(),equalTo(UploadToolNodeType.F));
      
        assertThat(node_document_13.getChildren().size(), equalTo(1));
        assertThat(node_document_13.getNodeType(), equalTo(UploadToolNodeType.D));
        
            //Document 2 node
        assertThat(node_document_2.getChildren().size(), equalTo(1));
        assertThat(node_document_2.getNodeType(), equalTo(UploadToolNodeType.D));
    }
    
    private UploadToolTreeNodeDTO getElementByName(String treeNodeName, List<UploadToolTreeNodeDTO> treeNodes) {
        for (UploadToolTreeNodeDTO treeNode : treeNodes) {
            if (treeNode.getName().equals(treeNodeName))
                return treeNode;
        }
       return null;
    }

}
