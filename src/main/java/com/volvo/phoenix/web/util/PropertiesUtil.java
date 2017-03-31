package com.volvo.phoenix.web.util;

import java.io.IOException;
import java.util.Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class PropertiesUtil {

    private final static Logger LOGGER = LoggerFactory.getLogger(PropertiesUtil.class);

    public static Properties loadProperties(String resourceName) {
        try {
            Properties prop = new Properties();
            prop.load(Thread.currentThread().getContextClassLoader().getResourceAsStream(resourceName));
            return prop;
        } catch (IOException e) {
            LOGGER.error("Properties file not found " + resourceName);
            throw new RuntimeException("Properties file not found " + resourceName, e);
        }
    }
}
