package com.volvo.phoenix.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.volvo.phoenix.document.uploadtool.application.UploadToolService;

@Controller
@RequestMapping("/uploadbatch")
public class UploadToolStartController {

    private final Logger log = LoggerFactory.getLogger(UploadToolStartController.class);

    @Autowired
    private UploadToolService uts;

    @RequestMapping(value = "/initBatchUpload")
    public ModelAndView initBatchUploadOperation(@RequestParam(value = "node_id", required = true) Long folderId) {
        Long operationId = uts.createOperation(folderId).getId();
        log.info(String.format("Your path %s and node_id %s", uts.getStoreLocation(operationId), folderId));
        return new ModelAndView("redirect:/uploadTool.do").addObject("operation_id", operationId);
    }
}
