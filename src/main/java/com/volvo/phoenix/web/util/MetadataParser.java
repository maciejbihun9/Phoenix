package com.volvo.phoenix.web.util;

import java.io.File;
import java.io.FileInputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.volvo.phoenix.document.datatype.MetadataStatus;
import com.volvo.phoenix.document.uploadtool.application.dto.UploadToolDocumentDTO;
import com.volvo.phoenix.web.exceptions.MetaDataException;

public class MetadataParser {
    
    private static String FOLDER = "folder";

    private final static Logger LOG = LoggerFactory.getLogger(MetadataParser.class);
    
    private final static String METADATA = "metadata";
    
    private final static String VERSION_DATE_PATTERN = "date";

    /**
     * For each excel row create uploadToolDocument object.
     * 
     * @return UploadToolDocumentDTOs object list parsed from given metadata.xlsx file
     * @throws MetaDataException
     */
    public static List<UploadToolDocumentDTO> parseMetadata(File metadataFile) throws MetaDataException {
        Workbook archiveWorkbook = null;
        try {
            FileInputStream fos = new FileInputStream(metadataFile);
            archiveWorkbook = new XSSFWorkbook(fos);
 
            fos.close();
        } catch (Exception e) {
            LOG.warn(MetadataStatus.BAD_EXCEL_VERSION + " : " + e.getMessage());
            throw new MetaDataException(MetadataStatus.BAD_EXCEL_VERSION.toString());
        }

        Sheet metadataSheet = null;
        try {
            int numberOfSheets = archiveWorkbook.getNumberOfSheets();
            for (int i = 0; i < numberOfSheets; i++) {
                if (archiveWorkbook.getSheetAt(i).getSheetName().equals(METADATA)) {
                    metadataSheet = archiveWorkbook.getSheetAt(i);
                    break;
                }
            }
        } catch (Exception e) {
            LOG.warn(MetadataStatus.BAD_EXCEL_VERSION + " : " + e.getMessage());
            throw new MetaDataException(MetadataStatus.BAD_EXCEL_VERSION.toString());
        }
        
        if (metadataSheet == null) {
            throw new MetaDataException(MetadataStatus.NO_TAB_CALLED_METADATA.name());
        }

        Iterator<Row> rowIterator = metadataSheet.iterator();
        // skip first excel row
        Row firstRow = rowIterator.next();
        int physicalNumberOfCells = firstRow.getPhysicalNumberOfCells();
        ArrayList<UploadToolDocumentDTO> uploadToolDocuments = new ArrayList<UploadToolDocumentDTO>();
        
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            UploadToolDocumentDTO uploadToolDocument = createUploadToolDocumentObject(row, physicalNumberOfCells, firstRow);
            uploadToolDocuments.add(uploadToolDocument);
        }
        return uploadToolDocuments;
    }
    

    public static UploadToolDocumentDTO createUploadToolDocumentObject(Row row, int physicalNumberOfCells, Row firstRow) throws MetaDataException {

        UploadToolDocumentDTO document = new UploadToolDocumentDTO();
        for (int j = 0; j < physicalNumberOfCells; j++) {
            try {
                Cell firstRowCell = firstRow.getCell(j);
                Cell checkingRowCell = row.getCell(j);
                String checkingRowCellValue = "";
                if (checkingRowCell != null) {
                    firstRowCell.setCellType(Cell.CELL_TYPE_STRING);
                    if(firstRowCell.getStringCellValue().contains(VERSION_DATE_PATTERN)){
                        checkingRowCell.setCellType(Cell.CELL_TYPE_NUMERIC);
                        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                        Date dateCellValue = checkingRowCell.getDateCellValue();
                        String format = dateFormat.format(dateCellValue);
                        checkingRowCellValue = format;
                    } else {
                        checkingRowCell.setCellType(Cell.CELL_TYPE_STRING);
                        checkingRowCellValue = checkingRowCell.getStringCellValue();
                    }
                }
                document.addDocumentProperty(firstRowCell.getStringCellValue(), checkingRowCellValue);
            } catch (Exception e) {
                LOG.warn("Unparsable cell , row:" + row.getRowNum() + " column:" + j);
                throw new MetaDataException(MetadataStatus.BAD_EXCEL_VERSION.toString());
            }
        }
        return document;
    }
    
    private void removePathLastElement(String documentPath){
        
    }

}
