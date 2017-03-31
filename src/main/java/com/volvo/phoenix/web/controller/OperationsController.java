package com.volvo.phoenix.web.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.volvo.phoenix.document.datatype.ItemType;
import com.volvo.phoenix.document.datatype.SolutionNameType;
import com.volvo.phoenix.document.dto.AttributeDefinitionDTO;
import com.volvo.phoenix.document.dto.ConflictDTO;
import com.volvo.phoenix.document.dto.OperationDTO;
import com.volvo.phoenix.document.dto.SolutionParamDTO;
import com.volvo.phoenix.document.entity.AttributeDefinition;
import com.volvo.phoenix.document.entity.DocumentType;
import com.volvo.phoenix.document.repository.DocumentTypeRepository;
import com.volvo.phoenix.document.service.CopyManagerService;
import com.volvo.phoenix.document.service.LockFailedException;
import com.volvo.phoenix.document.translator.AttributeDefinitionTranslator;
import com.volvo.phoenix.web.model.AttributeDTO;
import com.volvo.phoenix.web.model.DnDOperation;
import com.volvo.phoenix.web.model.ScheduleOperationDTO;

/**
 * Controller to handle the user operations.
 * 
 */
@Controller
@RequestMapping("/operation")
public class OperationsController {

    @Autowired
    private CopyManagerService documentCopyService;

    @Autowired
    private DocumentTypeRepository documentTypeRepository;

    @Autowired
    private AttributeDefinitionTranslator attributeDefinitionTranslator;

    @RequestMapping(value = "/userPlanedOperations", method = RequestMethod.GET)
    @ResponseBody
    public List<OperationDTO> planedUserOperations() {
        return documentCopyService.getOperationsHistory(SecurityContextHolder.getContext().getAuthentication().getName());
    }

    @RequestMapping(value = "/userPlanedOperations", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public OperationDTO createUserOperation(@RequestBody final DnDOperation operation, final HttpServletResponse response) throws ServletException,
            IOException, LockFailedException {

        final OperationDTO operationDTO = documentCopyService.createOperation(ItemType.valueOf(operation.getSourceType()),
                                                                              Long.valueOf(operation.getSourceId()), Long.valueOf(operation.getTargetId()),
                                                                              SecurityContextHolder.getContext().getAuthentication().getName());
        final Long nodeId = operationDTO.getId();
        if (nodeId == null) {
            operationDTO.setId(-1L);
        }

        return operationDTO;
    }

    @RequestMapping(value = "/userPlanedOperations/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public boolean deleteUserOperation(@PathVariable("id") final long operationId) {
        if (operationId == -1L) {
            return true;
        }
        return documentCopyService.removeOperation(operationId);
    }

    @RequestMapping(value = "/scheduleOperation", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public boolean scheduleOperation(@RequestBody final ScheduleOperationDTO scheduleOperationDto) {

        Assert.notNull(scheduleOperationDto, "The 'scheduleOperationDto' parameter cannot be null.");
        Assert.notNull(scheduleOperationDto.getOperationId(), "The 'operationId' cannot be null");
        Assert.notNull(scheduleOperationDto.getOperationType(), "The 'operationType' cannot be null");

        final List<SolutionParamDTO> solutionParams = new ArrayList<SolutionParamDTO>();

        // solution type
        final SolutionParamDTO s1 = new SolutionParamDTO();
        s1.setOperationId(scheduleOperationDto.getOperationId());
        s1.setSolution(scheduleOperationDto.getSolutionType());
        s1.setId(scheduleOperationDto.getSelectedDoctype());
        solutionParams.add(s1);
        //If selected family is present add to solutions
        if(scheduleOperationDto.getSelectedFamily()!=null){
            final SolutionParamDTO sp = new SolutionParamDTO();
            sp.setOperationId(scheduleOperationDto.getOperationId());
            sp.setSolution(SolutionNameType.FAMILY_ATTR);
            sp.setId(scheduleOperationDto.getSelectedFamily());            
            solutionParams.add(sp);    
        }        
        
        // mandatory attr (document type attrs)
        for (final AttributeDTO attrParam : scheduleOperationDto.getDoctypeAttr()) {
            final SolutionParamDTO sp = new SolutionParamDTO();
            sp.setOperationId(scheduleOperationDto.getOperationId());
            sp.setSolution(SolutionNameType.DOCUMENT_TYPE_ATTR);
            sp.setId(attrParam.getId());
            sp.setValue(attrParam.getValue());
            solutionParams.add(sp);
        }
        
        // optional attr (domain attrs)
        for (final AttributeDTO attrParam : scheduleOperationDto.getDomainAttr()) {
            final SolutionParamDTO sp = new SolutionParamDTO();
            sp.setOperationId(scheduleOperationDto.getOperationId());
            sp.setSolution(SolutionNameType.DOMAIN_ATTR);
            sp.setId(attrParam.getId());
            sp.setValue(attrParam.getValue());
            solutionParams.add(sp);
        }
        
        documentCopyService.saveSolutionParams(solutionParams);
        documentCopyService.scheduleOperation(scheduleOperationDto.getOperationId(), scheduleOperationDto.getOperationType());

        return true;
    }

    @RequestMapping(value = "/familyDocumentTypes", method = RequestMethod.GET)
    public ModelAndView getFamilyDocumentTypes(@RequestParam("familyId") final Long familyId, @RequestParam("operationId") final Long operationId) {

        final ModelAndView mav = new ModelAndView("familyDocumentTypes");
        mav.addObject("documentTypes", documentCopyService.getFamilyDocumentTypes(familyId, operationId));
        mav.addObject("operationId", operationId);
        return mav;
    }

    @RequestMapping(value = "/documentTypeAttributes", method = RequestMethod.GET)
    public ModelAndView getDocumentTypeAttributes(@RequestParam("documentTypeId") final Long documentTypeId) {

        final DocumentType documentType = documentTypeRepository.findByIdWithAttributes(documentTypeId);
        final List<AttributeDefinition> attributeDefinitions = documentType.getAttributes();
        final List<AttributeDefinitionDTO> attributeDefinitionDTOs = attributeDefinitionTranslator.translateToDto(attributeDefinitions);
        final ModelAndView mav = new ModelAndView("documentTypeAttributes");

        mav.addObject("documentTypeAttributes", attributeDefinitionDTOs);

        return mav;
    }

    /**
     * TODO Need to be connect to CM functionality. At the moment is not required.
     * 
     * Gets list of all user operations with status created.
     * 
     * @return
     */
    @RequestMapping(value = "/userOperationsList", method = RequestMethod.GET)
    public @ResponseBody List<OperationDTO> userOperationTasksList() {
        return documentCopyService.getUserCreatedOperations(SecurityContextHolder.getContext().getAuthentication().getName());
    }

    /**
     * Check if the operation executed by the user generate some conflicts between source and target folder.
     * 
     * @param operationId
     * @return
     */
    @RequestMapping(value = "/check", method = RequestMethod.GET)
    public ModelAndView checkPlannedUserOperationsForConflicts(@RequestParam("operationId") final Long operationId) {

        final OperationDTO operationDTO = documentCopyService.findOperation(operationId);
        final List<ConflictDTO> conflicts = documentCopyService.checkConflicts(operationDTO);

        final ModelAndView mav = new ModelAndView("operationView");
        mav.addObject("conflicts", conflicts);
        mav.addObject("operation", operationDTO);
        
        return mav;
    }

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public String controllerExceptionHandler() {
        return "Requested operation has failed!";
    }

}
