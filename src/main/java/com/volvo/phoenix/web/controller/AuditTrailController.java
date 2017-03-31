package com.volvo.phoenix.web.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.volvo.phoenix.document.dto.AuditLogDTO;
import com.volvo.phoenix.document.dto.DocumentAuditLogDTO;
import com.volvo.phoenix.document.dto.DocumentAuditLogsDTO;
import com.volvo.phoenix.document.dto.FolderAuditLogDTO;
import com.volvo.phoenix.document.dto.FolderAuditLogsDTO;
import com.volvo.phoenix.document.service.AuditLogService;
import com.volvo.phoenix.web.common.PhoenixWebConsts;

@Controller
@RequestMapping("/history")
public class AuditTrailController {

    @Autowired
    private AuditLogService auditLogService;

    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public ModelAndView handleStart() throws ServletException, IOException {

        return new ModelAndView("operationsHistoryView");
    }

    @RequestMapping(value = "/docAuditLogDetail", method = RequestMethod.GET)
    public ModelAndView documentAuditLogDetail(@RequestParam("auditLogId") final Long auditLogId) {

        final AuditLogDTO auditLog = this.auditLogService.getDocumentAuditLog(auditLogId);
        final ModelAndView mav = new ModelAndView("docAuditLog");
        mav.addObject("docAuditLog", auditLog);
        return mav;
    }

    @RequestMapping(value = "/folderHistory", method = RequestMethod.GET)
    @ResponseBody
    public List<FolderAuditLogDTO> folderHistory(final HttpServletRequest request, final HttpServletResponse response) {

        final String rangeToDisplay = request.getHeader(PhoenixWebConsts.HEADER_RANGE);
        final DataRange range = getRangeToDisplay(rangeToDisplay);

        final String userVcnId = SecurityContextHolder.getContext().getAuthentication().getName();
        final int page = range.getStartIndex() / range.getHowMany();
        final FolderAuditLogsDTO folderAuditLogs = this.auditLogService.getFolderAuditLogs(userVcnId, page, range.getHowMany());

        response.addHeader(PhoenixWebConsts.RESPONSE_CONTENT_RANGE_HEADER,
                           String.format(PhoenixWebConsts.RESPONSE_CONTENT_RANGE_HEADER_PATTERN, range.getStartIndex(), range.getEndIndex(),
                                         folderAuditLogs.getTotalCount()));

        return folderAuditLogs.getFolderAuditLogs();
    }

    @RequestMapping(value = "/documentHistory", method = RequestMethod.GET)
    @ResponseBody
    public List<DocumentAuditLogDTO> documentHistory(final HttpServletRequest request, final HttpServletResponse response) {

        final String rangeToDisplay = request.getHeader(PhoenixWebConsts.HEADER_RANGE);
        final DataRange range = getRangeToDisplay(rangeToDisplay);

        final String userVcnId = SecurityContextHolder.getContext().getAuthentication().getName();
        final int page = range.getStartIndex() / range.getHowMany();
        final DocumentAuditLogsDTO documentAuditLogs = this.auditLogService.getDocumentAuditLogs(userVcnId, page, range.getHowMany());

        response.addHeader(PhoenixWebConsts.RESPONSE_CONTENT_RANGE_HEADER,
                           String.format(PhoenixWebConsts.RESPONSE_CONTENT_RANGE_HEADER_PATTERN, range.getStartIndex(), range.getEndIndex(),
                                         documentAuditLogs.getTotalCount()));

        return documentAuditLogs.getDocumentAuditLogs();
    }

    @RequestMapping(value = "/documentHistory/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void removeDocumentAuditLog(@PathVariable("id") final Long auditLogId) {

        Assert.notNull(auditLogId, "The parameter 'auditLogId' cannot be null.");
        auditLogService.removeDocumentAuditLog(auditLogId);
    }

    @RequestMapping(value = "/folderHistory/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void removeFolderAuditLog(@PathVariable("id") final Long auditLogId) {

        Assert.notNull(auditLogId, "The parameter 'auditLogId' cannot be null.");
        auditLogService.removeFolderAuditLog(auditLogId);
    }

    private DataRange getRangeToDisplay(final String rangeHeader) {

        if (rangeHeader == null || rangeHeader.trim().isEmpty()) {
            return new DataRange(PhoenixWebConsts.DEFAULT_START_INDEX, PhoenixWebConsts.DEFAULT_HOW_MANY_DATA);
        }

        final int rangeValue = 1;
        final int startIndex = 0;
        final int endIndex = 1;

        final String[] arrRange = rangeHeader.split("=");
        final String[] arrInx = arrRange[rangeValue].split("-");
        final int startInx = Integer.parseInt(arrInx[startIndex]);
        final int endInx = Integer.parseInt(arrInx[endIndex]);

        return new DataRange(startInx, endInx);
    }

    /**
     * Holds information used by paggination.
     */
    private class DataRange {
        private final int startIndex;
        private final int endIndex;

        /**
         * 
         * @param startIndex
         * @param endIndex
         */
        public DataRange(final int startIndex, final int endIndex) {
            this.startIndex = startIndex;
            this.endIndex = endIndex;
        }

        /**
         * @return the startIndex
         */
        public int getStartIndex() {
            return this.startIndex;
        }

        /**
         * @return the endIndex
         */
        public int getEndIndex() {
            return this.endIndex;
        }

        public int getHowMany() {
            return this.endIndex - this.startIndex + 1;
        }

    }
}
