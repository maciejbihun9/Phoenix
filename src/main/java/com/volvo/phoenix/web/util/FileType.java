package com.volvo.phoenix.web.util;

import java.io.File;

import com.volvo.phoenix.document.uploadtool.model.UploadToolNodeType;

public class FileType {


    public static boolean isDocument(File file, UploadToolNodeType parentNodeType) {
        return containsOnlyFiles(file) || isNormalDocument(file, parentNodeType);
    }

    public static boolean isSlaveFolder(File file) {
        return fileContainFiles(file) && fileContainDirs(file);
    }

    public static boolean isAttachedFile(File file, UploadToolNodeType parentNodeType) {
        return !fileContainFiles(file) && (parentNodeType == UploadToolNodeType.D);
    }
    
    private static boolean fileContainFiles(File file) {
        return file.listFiles() != null;

    }

    private static boolean fileContainDirs(File file) {
        File[] filesInFolder = file.listFiles();
        for (File childFile : filesInFolder) {
            if (childFile.isDirectory()) {
                return true;
            }
        }
        return false;
    }

    private static boolean containsOnlyFiles(File file) {
        return fileContainFiles(file) && !fileContainDirs(file);
    }

    private static boolean isNormalDocument(File file, UploadToolNodeType parentNodeType) {
        return (parentNodeType == UploadToolNodeType.S || parentNodeType == null) && !fileContainFiles(file);
    }

}
