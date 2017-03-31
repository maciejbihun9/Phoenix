package com.volvo.phoenix.web.controller;

import java.io.IOException;

import javax.servlet.ServletException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.volvo.phoenix.document.datatype.NotificationState;
import com.volvo.phoenix.document.service.UrlRequestQueryParamsService;
import com.volvo.phoenix.document.service.impl.UrlRequestQueryParamsServiceImpl;
import org.apache.log4j.Logger;

/**
 * Home controller, handle the home page, and move/copy action.
 *
 * @author v0cn181
 */
@Controller
@RequestMapping("")
public class StartController {

    private final Logger log = Logger.getLogger(StartController.class);

    @Autowired
    private UrlRequestQueryParamsService urlRequestQueryParamsService;

    /**
     * Handle the home page.
     *
     * @return
     * @throws ServletException
     * @throws IOException
     */
    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public ModelAndView handleStart(
            @RequestParam(value = UrlRequestQueryParamsService.OWNER_EMAILS_NOTIFICATION_STATE, defaultValue = "disabled", required = false) String ownerEmailNotificationState)
            throws ServletException, IOException {

        setupUrlRequestQueryParamsService(ownerEmailNotificationState);
        return new ModelAndView("start");
    }

    @RequestMapping(value = "/uploadTool", method = RequestMethod.GET)
    public ModelAndView handleUploadToolStart() throws ServletException, IOException {
        return new ModelAndView("ut/start");
    }

    private void setupUrlRequestQueryParamsService(final String ownerEmailNotificationState) {
        final NotificationState ownerNotificationState = NotificationState.getState(ownerEmailNotificationState);
        urlRequestQueryParamsService.setOwnerEmailNotificationsState(ownerNotificationState != null ? ownerNotificationState : NotificationState.DISABLED);
    }
}
