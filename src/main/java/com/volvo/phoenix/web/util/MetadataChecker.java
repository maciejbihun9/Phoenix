package com.volvo.phoenix.web.util;

import java.io.File;

public final class MetadataChecker {

    private static final String METADATA = "metadata.xlsx";

    public static boolean doesMetadataExists(String filePath) {
        File filesFolder = new File(filePath + File.separator + METADATA);
        return filesFolder.exists();
    }

    public static boolean isMetadataExist(File[] listFiles) {
        if (listFiles != null) {
            for (int i = 0; i < listFiles.length; i++) {
                if (listFiles[i].getName().equalsIgnoreCase(METADATA)) {
                    return true;
                }
            }
        }
        return false;
    }
}
