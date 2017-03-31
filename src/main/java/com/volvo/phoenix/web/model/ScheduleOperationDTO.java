package com.volvo.phoenix.web.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.volvo.phoenix.document.datatype.OperationType;
import com.volvo.phoenix.document.datatype.SolutionNameType;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ScheduleOperationDTO {

    @JsonProperty("operationId")
    private Long operationId;
    @JsonProperty("solutionType")
    private SolutionNameType solutionType;
    @JsonProperty("actionType")
    private OperationType operationType;
    @JsonProperty("selectedFamily")
    private Long selectedFamily;
    @JsonProperty("selectedDoctype")
    private Long selectedDoctype;
    @JsonProperty("doctypeAttr")
    private List<AttributeDTO> doctypeAttr;
    @JsonProperty("domainAttr")
    private List<AttributeDTO> domainAttr;

    public ScheduleOperationDTO() {

    }

    public Long getOperationId() {
        return operationId;
    }

    public void setOperationId(Long operationId) {
        this.operationId = operationId;
    }

    public SolutionNameType getSolutionType() {
        return solutionType;
    }

    public void setSolutionType(SolutionNameType solutionType) {
        this.solutionType = solutionType;
    }

    public OperationType getOperationType() {
        return operationType;
    }

    public void setOperationType(OperationType operationType) {
        this.operationType = operationType;
    }

    public List<AttributeDTO> getDoctypeAttr() {
        return doctypeAttr;
    }

    public void setDoctypeAttr(List<AttributeDTO> doctypeAttr) {
        this.doctypeAttr = doctypeAttr;
    }

    public List<AttributeDTO> getDomainAttr() {
        return domainAttr;
    }

    public void setDomainAttr(List<AttributeDTO> domainAttr) {
        this.domainAttr = domainAttr;
    }

    public Long getSelectedDoctype() {
        return selectedDoctype;
    }

    public void setSelectedDoctype(Long selectedDoctype) {
        this.selectedDoctype = selectedDoctype;
    }
    public Long getSelectedFamily() {
        return selectedFamily;
    }
    
    public void setSelectedFamily(Long selectedFamily) {
        this.selectedFamily = selectedFamily;
    }

}
