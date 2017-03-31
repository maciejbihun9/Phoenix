package com.volvo.phoenix.web.resource;

import com.volvo.phoenix.document.uploadtool.application.UploadToolService;
import com.volvo.phoenix.web.model.FileInfo;
import com.volvo.phoenix.web.model.FileUploadResponse;
import com.volvo.phoenix.web.util.FileUtil;

import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/uploadtool/fileUpload")
public class FileUploadResource {

    private final Logger log = LoggerFactory.getLogger(FileUtil.class);

    @Autowired
    private UploadToolService uts;

    @RequestMapping(value = "/{opId}", method = RequestMethod.POST)
    public FileUploadResponse handleFileUpload(@PathVariable("opId") Long opId, @RequestParam("files[]") List<MultipartFile> files) throws IOException {
        String path = uts.getStoreLocation(opId);
        String info = String.format("Files (%s in total) put into %s! ", files.size(), path);
        log.info(info);

        for (MultipartFile file : files) {
            info += FileUtil.storeFile(file, path);
        }

        log.info(info);
        return new FileUploadResponse(info);
    }

    @RequestMapping(value = "/{opId}", method = RequestMethod.GET)
    public List<FileInfo> getUploadedFiles(@PathVariable("opId") Long opId) {
        return FileUtil.getFilesPaths(uts.getStoreLocation(opId));
    }

    @RequestMapping(value = "/{opId}/{id}", method = RequestMethod.DELETE)
    public Boolean deleteFile(@PathVariable("opId") Long opId, @PathVariable("id") String id) throws IOException {
        return FileUtil.deleteFileAndCheckIfFolderEmpty(uts.getStoreLocation(opId), getNameById(opId, id));
    }

    private String getNameById(Long opId, String id) {
        for (FileInfo fi : getUploadedFiles(opId)) {
            if (id.equals(fi.getId())) {
                return fi.getName();
            }
        }
        return null;
    }
}
