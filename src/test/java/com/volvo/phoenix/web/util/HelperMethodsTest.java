package com.volvo.phoenix.web.util;

import java.io.File;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;

import org.junit.Test;

public class HelperMethodsTest {
    
  //global given section
    private final String pathToFolder = "src"+File.separator+"test"+File.separator+"resources"+File.separator+"files"+File.separator+"NoMetadataTestFolder"+File.separator+"folder1";
    private final String pathPattern = "src"+File.separator+"test"+File.separator+"resources"+File.separator+"files";
    private final File testFile = new File(pathToFolder);
    
    private final String pathToFolderToCut = "src"+File.separator+"test"+File.separator+"resources"+File.separator+"files"+File.separator+"NoMetadataTestFolder"+File.separator+"TestFolder1"+File.separator+"folder1";
    private final String pathPatternToCut = "src"+File.separator+"test"+File.separator+"resources"+File.separator+"files";
    private final File testFileToCut = new File(pathToFolderToCut);

    @Test
    public void createPathToComapreTest(){
        //when
        String cuttedPath = HelperMethods.createPathToCompare(testFile.getPath(), pathPattern,"");

        //then
        assertThat(cuttedPath, equalTo(File.separator + "NoMetadataTestFolder"+File.separator+"folder1"));
    }
    
    @Test
    public void createPathToComapreWithFolderToCutTest(){

        //when
        String cuttedPath = HelperMethods.createPathToCompare(testFileToCut.getPath(), pathPatternToCut,"TestFolder1");

        //then
        assertThat(cuttedPath, equalTo(File.separator + "NoMetadataTestFolder"+File.separator+"folder1"));
    }
    
    @Test
    public void shouldReturnPathWithoutFilename(){
        //when
        String pathWithoutFilename = HelperMethods.createPathWithoutFilename(pathToFolder);
        
        //then
        assertThat(pathWithoutFilename, equalTo("src"+File.separator+"test"+File.separator+"resources"+File.separator+"files"+File.separator+"NoMetadataTestFolder"));
    }
    
    
}
