package com.volvo.phoenix.web.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DnDOperation {

    @JsonProperty("sourceType")
    private String sourceType;

    @JsonProperty("sourceId")
    private String sourceId;

    @JsonProperty("targetId")
    private String targetId;

    // public DnDOperation(@JsonProperty("sourceType") String sourceType, @JsonProperty("sourceId") String sourceId, @JsonProperty("targetId") String targetId)
    // {
    // this.sourceType = sourceType;
    // this.sourceId = sourceId;
    // this.targetId = targetId;
    // //System.out.println("test");
    // }

    /**
     * @return the sourceType
     */
    public String getSourceType() {
        return sourceType;
    }

    /**
     * @param sourceType
     *            the sourceType to set
     */
    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }

    /**
     * @return the sourceId
     */
    public String getSourceId() {
        return sourceId;
    }

    /**
     * @param sourceId
     *            the sourceId to set
     */
    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    /**
     * @return the targetId
     */
    public String getTargetId() {
        return targetId;
    }

    /**
     * @param targetId
     *            the targetId to set
     */
    public void setTargetId(String targetId) {
        this.targetId = targetId;
    };

}
