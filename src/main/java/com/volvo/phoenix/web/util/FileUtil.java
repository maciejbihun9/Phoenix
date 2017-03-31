package com.volvo.phoenix.web.util;

import com.volvo.phoenix.web.model.FileInfo;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

public final class FileUtil {

    protected final static Logger LOGGER = LoggerFactory.getLogger(FileUtil.class);

    
    public static String storeFile(MultipartFile file, String path) throws IOException {
        new File(path).mkdirs();

        final String name = trimPath(file.getOriginalFilename());
        BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new File(path + "/" + name)));
        stream.write(file.getBytes());
        stream.close();

        String info = String.format("You successfully uploaded %s!\n", name);
        LOGGER.info(info);
        return info;
    }

    private static String trimPath(String path) {
        String[] temp = path.split(Pattern.quote(File.separator));
        return temp[temp.length - 1];
    }

    public static Boolean deleteFileAndCheckIfFolderEmpty(String path, String fileName) throws IOException {
        File file = new File(path + "/" + fileName);
        File parentFile = file.getParentFile();
        file.delete();

        if (parentFile.listFiles().length == 0) {
            LOGGER.info("The folder is empty and can be fully deleted!");
            FileUtils.deleteDirectory(parentFile);
            return true;
        }
        return false;
    }

    public static List<FileInfo> getFilesPaths(String path) {
        List<FileInfo> names = new ArrayList<FileInfo>();
        try {
            listFilesForFolder(new File(path), names);
        } catch (NullPointerException e) {
            LOGGER.info("Folder {} does not exist!", path);
        }
        return names;
    }

    private static void listFilesForFolder(final File folder, List<FileInfo> names) {
        for (final File fileEntry : folder.listFiles()) {
            if (fileEntry.isDirectory()) {
                listFilesForFolder(fileEntry, names);
            } else {
                names.add(new FileInfo(new String(Base64.encodeBase64(fileEntry.getName().getBytes())), fileEntry.getName()));
            }
        }
    }
}

