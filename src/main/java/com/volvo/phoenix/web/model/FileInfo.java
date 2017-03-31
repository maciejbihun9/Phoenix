package com.volvo.phoenix.web.model;

public class FileInfo {

    private final String id;
    private final String name;

    public FileInfo(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
