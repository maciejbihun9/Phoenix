package com.volvo.phoenix.web.util;

import java.io.File;
import java.io.FileFilter;

public class FolderFileFilter implements FileFilter {

    private static final String folderToExcludeName = ".svn";

    @Override
    public boolean accept(File folderName) {
       return !folderName.getName().equals(folderToExcludeName);
    }
}
