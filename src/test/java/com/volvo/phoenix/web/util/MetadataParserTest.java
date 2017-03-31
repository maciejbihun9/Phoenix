package com.volvo.phoenix.web.util;

import java.io.File;

import org.junit.Test;

import com.volvo.phoenix.web.exceptions.MetaDataException;

public class MetadataParserTest {

    String path = "src/test/resources/metadata.xlsx";
    String todaysMetadataPath = "src/test/resources/testowyFolder/metadata.xlsx";
    String metadataWithWhiteSpaces = "src/test/resources/files/metadata/metadata.xlsx";
    
    /*@Test
    public void parseMetadataTest() throws MetaDataException{
        MetadataParser.parseMetadata(new File(path));
    }*/
    
   /* @Test
    public void shouldReturnConvenientDateFormat() throws MetaDataException{
        MetadataParser.parseMetadata(new File(todaysMetadataPath));
    }*/
    
    @Test
    public void shouldParseDateWithWhiteSpace() throws MetaDataException {
        MetadataParser.parseMetadata(new File(metadataWithWhiteSpaces));
    }
}
