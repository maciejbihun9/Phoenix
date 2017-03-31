package com.volvo.phoenix.web.controller;

import java.util.Hashtable;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.volvo.phoenix.document.dto.TreeNodeDTO;
import com.volvo.phoenix.document.dto.TreeNodesDTO;
import com.volvo.phoenix.document.service.DocumentStructureService;
import com.volvo.phoenix.web.common.PhoenixWebConsts;
import com.volvo.phoenix.web.common.SortingOrder;

/**
 * And REST service to provide folder structure related information.
 */
@Controller
@RequestMapping("/filesystem")
public class FileSystemController {
    @Autowired
    private DocumentStructureService documentStructureService;

    @RequestMapping(value = "/getRootfoldersForBusinessAdmin", method = RequestMethod.GET)
    @ResponseBody
    public String getRootfoldersForBusinessAdmin(@RequestParam(value = "id", required = false) final String userId, final HttpServletRequest request,
            final HttpServletResponse response) {

        final String userVcnId = SecurityContextHolder.getContext().getAuthentication().getName();
        final String RootFolders = documentStructureService.getRootfoldersForBusinessAdmin(userId == null ? userVcnId : userId);

        return RootFolders;
    }

    /**
     * Display the folder tree.
     * 
     * @param nodeId
     * @return
     */
    @RequestMapping(value = "/tree/{id}", method = RequestMethod.GET)
    @ResponseBody
    public TreeNodeDTO folderTree(@PathVariable("id") Long nodeId) {

        TreeNodeDTO folderTree = documentStructureService.folderTree(decodeDojoNodeId(nodeId));
        encodeDojoNodeId(folderTree);

        return folderTree;
    }

    private void encodeDojoNodeId(TreeNodeDTO folderTree) {
        if (null == folderTree.getId()) {
            folderTree.setId(-1L);
        }
    }

    private Long decodeDojoNodeId(Long nodeId) {

        return nodeId == -1L ? null : nodeId;
    }

    @RequestMapping(value = "/folderdetail", method = RequestMethod.GET)
    @ResponseBody
    public List<TreeNodeDTO> folderDetail(@RequestParam(value = "id", required = false) final Long nodeId, final HttpServletRequest request,
            final HttpServletResponse response) {

        final String rangeToDisplay = request.getHeader(PhoenixWebConsts.HEADER_RANGE);
        final DataRange range = getRangeToDisplay(rangeToDisplay);
        final int page = range.getStartIndex() / range.getHowMany();

        SortingOrder sortingOrder = getSortingOrder(request);
        sortingOrder.setSortBy(getSortMapping(sortingOrder.getSortBy()));

        Sort sort = new Sort(new Sort.Order(sortingOrder.getSortOrder() == PhoenixWebConsts.SORT_ORDER_MODE_ASC ? Direction.ASC : Direction.DESC,
                                            sortingOrder.getSortBy()));

        final TreeNodesDTO treeNodes = documentStructureService.getTreeNodes(nodeId, page, range.getHowMany(), sort);

        response.addHeader(PhoenixWebConsts.RESPONSE_CONTENT_RANGE_HEADER,
                           String.format(PhoenixWebConsts.RESPONSE_CONTENT_RANGE_HEADER_PATTERN, range.getStartIndex(), range.getEndIndex(),
                                         treeNodes.getTotalCount()));

        return treeNodes.getTreeNodes();
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

    /**
     * after clicking on dojo grid, it will send sort order to server side by adding query parameter like ?sort=(+title), + meams ASC, - means DESC
     * 
     * @param request
     * @param searchCriteria
     */
    private SortingOrder getSortingOrder(HttpServletRequest request) {
        SortingOrder sortingOrder = new SortingOrder();
        sortingOrder.setSortOrder("ASC");

        String sort = getRequestParameter(request.getQueryString() == null ? "" : request.getQueryString(), "sort");
        // if sort order is not specified, by default it will sort by issue_date desc. This is the same logic as before.
        if (StringUtils.isNotBlank(sort)) {
            // first map the grid column name with database colums that need to be sorted, and set to criteria.
            sortingOrder.setSortBy(sort.replaceAll("[\\+,\\-]", ""));
            sortingOrder.setSortOrder(sort.contains("+") ? "ASC" : "DESC");
        }
        return sortingOrder;
    }

    /**
     * Since Dojo grid will add ? before sort order, so http request can not parse parameter correctly, so this method will parse the query string, and find the
     * corresponding parameter.
     * 
     * @param request
     * @param key
     * @return
     */
    private static String getRequestParameter(String queryString, String key) {

        String[] segments = queryString.split("[\\&,\\?]");
        Hashtable map = new Hashtable();
        for (String segment : segments) {
            String[] entry = segment.split("=");
            if (entry.length == 2) {
                map.put(entry[0], entry[1]);
            } else if (segment.startsWith("sort")) {
                map.put("sort", segment.substring(5, segment.length() - 1));
            } else {
                map.put(entry[0], "");
            }
        }
        return (String) map.get(key);
    }

    private static String getSortMapping(String sortKey) {

        String newSortKey;

        switch (SortKey.getSortKey(sortKey == null ? "name" : sortKey)) {
        case name:
        case version:
            newSortKey = "Title";
            break;
        case family:
            newSortKey = "Family";
            break;
        case date:
            newSortKey = "IssueDate";
            break;
        case docType:
            newSortKey = "Type";
            break;
        case ownerRealname:
            newSortKey = "Author";
            break;
        case status:
            newSortKey = "Status";
            break;
        default:
            newSortKey = "Title";
        }
        return newSortKey;
    }

    public enum SortKey {
        name, version, family, date, docType, ownerRealname, status;

        public static SortKey getSortKey(String sortKey) {
            return valueOf(sortKey);
        }
    }
}
