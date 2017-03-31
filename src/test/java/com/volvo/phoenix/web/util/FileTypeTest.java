package com.volvo.phoenix.web.util;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;

import java.io.File;
import java.io.IOException;

import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.volvo.phoenix.document.uploadtool.model.UploadToolNodeType;


public class FileTypeTest {
    
    private final String targetTestPath = "target" + File.separator + "testFolder";
    private final File targetTestFileFolder = new File(targetTestPath);
    
    private final String testFilesPath = "src"+File.separator+"test"+File.separator+"resources"+File.separator+"files";
    private final File testFiles = new File(testFilesPath);
    final static Logger logger = LoggerFactory.getLogger(FileTypeTest.class);

    @Before
    public void initalize() throws IOException {
        UploadToolTestHelper.copyFileTo(testFiles, targetTestFileFolder);
    }
    
    @Test
    public void isDocument(){
        //given
        final String document1Path = targetTestPath +File.separator+"TestNoMetadata"+File.separator+"Document_1";
        final String document2Path = targetTestPath+File.separator+"TestNoMetadata"+File.separator+"Folder_1"+File.separator+"Document_2.txt";
        final String document3Path = targetTestPath+File.separator+"TestNoMetadata"+File.separator+"Folder_1"+File.separator+"Document_111";
        final File document1File = new File(document1Path);
        final File document2File = new File(document2Path);
        final File document3File = new File(document3Path);
        
        
        //when
        boolean  isDocument1 = FileType.isDocument(document1File, UploadToolNodeType.S);
        boolean  isDocument2 = FileType.isDocument(document2File, UploadToolNodeType.S);
        boolean  isDocument3 = FileType.isDocument(document3File, UploadToolNodeType.S);
        
        //then
        assertThat(isDocument1, equalTo(true));
        assertThat(isDocument2, equalTo(true));
        assertThat(isDocument3, equalTo(true));
    }
    
    @Test
    public void isSlaveFolder(){
        //given
        final String folder1Path = "src"+File.separator+"test"+File.separator+"resources"+File.separator+"files"+File.separator+"TestNoMetadata"+File.separator+"Folder_1";
        final File folderFile = new File(folder1Path);
        
        //when
        boolean isFolder = FileType.isSlaveFolder(folderFile);
        
        //then
        assertThat(isFolder, equalTo(true));
    }
    
    @Test
    public void isAttachedFile(){
        //given
        final String filePath = "src"+File.separator+"test"+File.separator+"resources"+File.separator+"files"+File.separator+"TestNoMetadata"+File.separator+"Docuement_1"+File.separator+"Attachement_21.txt";
        final File file = new File(filePath);
        
        //when
        boolean isAttachement = FileType.isAttachedFile(file, UploadToolNodeType.D);
        
        //mock environment
        boolean isVirtualAttachement = FileType.isAttachedFile(file, null);
        
        //then
        assertThat(isAttachement, equalTo(true));
        assertThat(isVirtualAttachement, equalTo(false));
    }
    
}
