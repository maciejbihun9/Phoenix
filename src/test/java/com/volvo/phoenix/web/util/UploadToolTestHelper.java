package com.volvo.phoenix.web.util;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

public class UploadToolTestHelper {
    /**
     * @param file to copy
     * @return path to copied file in target Folder
     * @throws IOException 
     */
    public static void copyFileTo(File dirToCopy, File destFolder) throws IOException{
        if (!destFolder.exists()) {
            destFolder.mkdirs();
        }
        FileUtils.copyDirectory(dirToCopy, destFolder, new FolderFileFilter(), true);
    }
    
}
