package com.volvo.phoenix.web.util;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;


public class FileUtilTest {

    private static final String TEST_RESOURCES = "src/test/resources/files/";
    private String path;

    @Before
    public void before() throws IOException {
        path = new File("target/testfiles").getAbsolutePath();
        //clean
        FileUtils.deleteDirectory(new File(path));
    }

    private MultipartFile getSpiedMultipartFile(String name) throws IOException {
        MultipartFile file = spy(new MockMultipartFile(name, new FileInputStream(TEST_RESOURCES + name)));
        when(file.getOriginalFilename()).thenReturn(name);
        return file;
    }

    @Test
    public void testStoreFileAndDeleteFunction() throws IOException {
        final String name = "empty.pdf";

        FileUtil.storeFile(getSpiedMultipartFile(name), path);
        assertThat(FileUtil.getFilesPaths(path).get(0).getName(), equalTo(name));
        assertThat(FileUtil.getFilesPaths(path).get(0).getId(), equalTo("ZW1wdHkucGRm"));

        assertThat(FileUtil.deleteFileAndCheckIfFolderEmpty(path, name), equalTo(true));
    }

    @Test
    public void testStoreFileOverwritten() throws IOException {
        final String name = "empty.pdf";

        FileUtil.storeFile(getSpiedMultipartFile(name), path);
        assertThat(FileUtil.getFilesPaths(path).size(), equalTo(1));

        FileUtil.storeFile(getSpiedMultipartFile(name), path);
        assertThat(FileUtil.getFilesPaths(path).size(), equalTo(1));
    }
}
