package com.volvo.phoenix.web.model;

public class UploadProgres {
    
    private int totalNumerOfDocuments;
    private int numerOfDocumentsProcesed;

    public int getNumerOfDocumentsProcesed() {
        return numerOfDocumentsProcesed;
    }

    public void setNumerOfDocumentsProcesed(int numerOfDocumentsProcesed) {
        this.numerOfDocumentsProcesed = numerOfDocumentsProcesed;
    }

    public int getTotalNumerOfDocuments() {
        return totalNumerOfDocuments;
    }

    public void setTotalNumerOfDocuments(int totalNumerOfDocuments) {
        this.totalNumerOfDocuments = totalNumerOfDocuments;
    }
}
