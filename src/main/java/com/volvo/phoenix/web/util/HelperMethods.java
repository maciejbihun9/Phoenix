package com.volvo.phoenix.web.util;

import java.io.File;
import java.io.IOException;
import java.util.Enumeration;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import com.volvo.phoenix.document.uploadtool.model.UploadToolFileType;

public class HelperMethods {
    
    private static final String METADATA = "metadata";
    private static final String ZIP = ".zip";
    
    
    public static String createPathToCompare(String fullpath, String pathPattern, String cutedFolderName) {
        String filePath = replaceToFileSeparatorSystem(fullpath);
        String pattern = replaceToFileSeparatorSystem(pathPattern);
        String cuttedPath = filePath.replace(pattern, "");
        if (cutedFolderName != null && !cutedFolderName.equals("")) {
              cuttedPath = cuttedPath.replaceFirst(getFileSeparator() + cutedFolderName, "");
        }    
        if (!cuttedPath.contains(File.separator)) {
            cuttedPath = File.separator + cuttedPath;
        }   
        return cuttedPath;
    }
    
    public static String createPathWithoutFilename(String filePath) {
        //String [] pathElements = filePath.split(File.separatorChar=='\\' ? "\\\\" : File.separator);
        String [] pathElements = filePath.split(Pattern.quote(File.separator));
        int pathElementslength = pathElements.length;
        String pathWithoutFilename = "";
        for (int i = 0; i < pathElementslength - 1; i++) {
            pathWithoutFilename += pathElements[i];
            if (i == pathElementslength - 2)
                break;
            pathWithoutFilename += File.separator;
        }
        return pathWithoutFilename;
    }

    public static String replaceToFileSeparatorSystem(String filePath) {
        filePath = filePath.replace("\\", File.separator);
        filePath = filePath.replace("/", File.separator);
        return filePath;
    }

    public static UploadToolFileType fileIsZip(File file) {
        if (file.getName().contains(ZIP)) {
            return UploadToolFileType.Z;
        } else {
            return UploadToolFileType.D;
        }
    }

    public static boolean containsMetadata(File f) throws IOException {
        ZipFile zf = new ZipFile(f);
        try {
            for (Enumeration<? extends ZipEntry> e = zf.entries(); e.hasMoreElements();) {
                ZipEntry ze = e.nextElement();
                if (ze.getName().contains(METADATA)) {
                    zf.close();
                    return true;
                }
            }
        } finally {
            zf.close();
        }
        return false;
    }
    
    public static String getFileSeparator(){
        if(File.separator.equals("\\")){
             return File.separator+File.separator; 
        }
        return File.separator;
    }

}
