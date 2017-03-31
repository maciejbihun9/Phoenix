package com.volvo.phoenix.web.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.volvo.phoenix.document.dto.OperationDTO;
import com.volvo.phoenix.document.service.CopyManagerService;

/**
 * Controlls displaying doc/folder operation status in UI.
 * 
 * @author bpld313
 */
public class OperationStatusController {
    @Autowired
    private CopyManagerService documentCopyService;

    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public ModelAndView handleStart() throws ServletException, IOException {

        ModelAndView mav = new ModelAndView("history");

        return mav;
    }

    @RequestMapping(value = "/listOperations", method = RequestMethod.GET)
    public @ResponseBody List<OperationDTO> historyList() {
        return documentCopyService.getOperationsHistory(SecurityContextHolder.getContext().getAuthentication().getName());
    }

    @RequestMapping(value = "/taskDetail", method = RequestMethod.GET)
    public ModelAndView taskDetail(@RequestParam("task") Long taskId) {
        OperationDTO task = documentCopyService.findOperation(taskId);
        // Create a ModelAndView with viewName "start"
        ModelAndView mav = new ModelAndView("taskDetail");
        mav.addObject("task", task);
        return mav;
    }
}
