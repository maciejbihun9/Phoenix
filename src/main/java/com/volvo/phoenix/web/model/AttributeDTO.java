package com.volvo.phoenix.web.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AttributeDTO {

    @JsonProperty("id")
    private Long id;
    @JsonProperty("value")
    private String value;
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getValue() {
        return value;
    }
    public void setValue(String value) {
        this.value = value;
    }
    
    
}
