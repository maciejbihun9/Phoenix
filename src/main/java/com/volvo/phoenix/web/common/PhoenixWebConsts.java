/**
 * 
 */
package com.volvo.phoenix.web.common;

/**
 * Class holds common consts used by Web part of the phoenix project.
 * 
 */
public final class PhoenixWebConsts {

    /**
     * Request header that stores information about range to display.
     */
    public static final String HEADER_RANGE = "range";
    public static final int DEFAULT_START_INDEX = 0;
    public static final int DEFAULT_HOW_MANY_DATA = 10;
    public static final String RESPONSE_CONTENT_RANGE_HEADER = "Content-Range";
    public static final String RESPONSE_CONTENT_RANGE_HEADER_PATTERN = "items %d-%d/%d";
    public static final String RESPONSE_CONTENT_LOCATION_HEADER = "Location";
    public static final String SORT_ORDER_MODE_ASC = "ASC";
    public static final String SORT_ORDER_MODE_DESC = "DESC";

    /**
     * Private constructor.
     */
    private PhoenixWebConsts() {
    }
}
