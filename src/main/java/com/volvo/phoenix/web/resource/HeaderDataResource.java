package com.volvo.phoenix.web.resource;

import com.volvo.phoenix.web.model.VersionInfo;
import com.volvo.phoenix.web.util.PropertiesUtil;
import java.util.Properties;
import javax.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/headerdata")
public class HeaderDataResource {

    private final Logger log = LoggerFactory.getLogger(HeaderDataResource.class);

    private static final String CONFIG_VERSION_PROPERTIES = "phoenixversion.properties";
    private static final String UNKNOWN = "unknown";

    private static final String APPLICATION_TIMESTAMP = "application.timestamp";
    private static final String APPLICATION_REVISION = "application.revision";
    private static final String APPLICATION_VERSION = "application.version";
    private static final String APPLICATION_TITLE = "application.title";

    private VersionInfo info;

    @RequestMapping(value = "/versioninfo")
    public VersionInfo getVersionInfo() {
        return info;
    }

    @PostConstruct
    public void init() {
        Properties prop = PropertiesUtil.loadProperties(CONFIG_VERSION_PROPERTIES);
        info = new VersionInfo(prop.getProperty(APPLICATION_VERSION, UNKNOWN), prop.getProperty(APPLICATION_TITLE, UNKNOWN),
                prop.getProperty(APPLICATION_REVISION, UNKNOWN), formatTimestamp(prop.getProperty(APPLICATION_TIMESTAMP, UNKNOWN)));
        log.info("setting title to {}, version to {}, revision to {}, timestamp to {}",
                info.getTitle(), info.getVersion(), info.getRevision(), info.getTimestamp());
    }

    private static String formatTimestamp(String timestamp) {
        return timestamp.replace("_", " ").replace(".", ":");
    }
}
