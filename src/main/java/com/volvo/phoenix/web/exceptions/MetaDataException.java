package com.volvo.phoenix.web.exceptions;

public class MetaDataException extends Exception {

    private static final long serialVersionUID = -6400689019886061530L;
    private String metadataStatus;
    private String fileName;

    public MetaDataException(String message) {
        setMetadataStatus(message);
    }

    public MetaDataException(String message, String uploadedFileName) {
        setMetadataStatus(message);
        setFileName(uploadedFileName);
    }

    public String getMetadataStatus() {
        return metadataStatus;
    }

    public void setMetadataStatus(String metadataStatus) {
        this.metadataStatus = metadataStatus;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

}
