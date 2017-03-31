package com.volvo.phoenix.web.util;

import java.io.IOException;
import java.util.Properties;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;
import org.junit.Test;

public class PropertiesUtilTest {

    @Test
    public void testLoadPropertiesAndCheckProps() throws IOException {
        Properties bundle = PropertiesUtil.loadProperties("test.properties");

        assertThat(bundle.getProperty("application.version"), equalTo("1"));
        assertThat(bundle.getProperty("application.revision"), equalTo("2"));
        assertThat(bundle.getProperty("application.timestamp"), equalTo("3"));
    }

    @Test(expected = RuntimeException.class)
    public void testLoadPropertiesError() {
        PropertiesUtil.loadProperties("dummy");
    }
}
