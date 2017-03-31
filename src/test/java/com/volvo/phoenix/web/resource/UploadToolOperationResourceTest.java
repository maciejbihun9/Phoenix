package com.volvo.phoenix.web.resource;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.fest.assertions.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.volvo.phoenix.document.entity.Folder;
import com.volvo.phoenix.document.uploadtool.application.UploadToolDocumentService;
import com.volvo.phoenix.document.uploadtool.application.UploadToolService;
import com.volvo.phoenix.document.uploadtool.model.UploadToolOperation;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations= {"file:src/main/webapp/WEB-INF/springapp-servlet.xml" , "classpath:META-INF/servlet-context.xml"})
@WebAppConfiguration
public class UploadToolOperationResourceTest {

    @Autowired
    private WebApplicationContext context;
    
    @Autowired
    private UploadToolService uploadToolService;
    
    @Autowired
    private UploadToolDocumentService uploadToolDocumentService;
    
    private MockMvc mockMvc;

    @Before  
    public void setup() { 
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    public void shouldReturnMockedOperationAsJSON() throws Exception {
        // given
        UploadToolOperation operation = createTestOperation();
        Mockito.when(uploadToolService.getOperation(Mockito.anyLong())).thenReturn(operation);
        
        // when
        MvcResult result = mockMvc.perform(get("/uploadtool/operation/-1")).andExpect(status().isOk()).andReturn();

        // then
        Assertions.assertThat(result.getResponse().getContentAsString()).contains("Volvo Powertrain");
    }

    private UploadToolOperation createTestOperation() {
        UploadToolOperation operation = new UploadToolOperation();
        operation.setUser("cs-ws-s-sarah1");
        Folder folder = new Folder();
        folder.setText("Volvo Powertrain");
        operation.setFolder(folder);
        return operation;
    }
    
}
