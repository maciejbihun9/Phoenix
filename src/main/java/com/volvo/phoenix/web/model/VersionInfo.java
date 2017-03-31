package com.volvo.phoenix.web.model;

public class VersionInfo {

    private final String version;
    private final String title;
    private final String revision;
    private final String timestamp;

    public VersionInfo(String version, String title, String revision, String timestamp) {
        this.version = version;
        this.title = title;
        this.revision = revision;
        this.timestamp = timestamp;
    }

    public String getVersion() {
        return version;
    }

    public String getTitle() {
        return title;
    }

    public String getRevision() {
        return revision;
    }

    public String getTimestamp() {
        return timestamp;
    }
}
