package com.volvo.phoenix.web.controller;

import java.io.IOException;

import javax.servlet.ServletException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ExampleController {

    @RequestMapping(value="example0" ,method = RequestMethod.GET)
    public ModelAndView example0() throws ServletException, IOException {
        return new ModelAndView("dojo_examples/example0");
    }
    
    @RequestMapping(value="example1" ,method = RequestMethod.GET)
    public ModelAndView example1() throws ServletException, IOException {
        return new ModelAndView("dojo_examples/example1");
    }
    
    @RequestMapping(value="example2" ,method = RequestMethod.GET)
    public ModelAndView example2() throws ServletException, IOException {
        return new ModelAndView("dojo_examples/example2");
    }
    
    @RequestMapping(value="example3" ,method = RequestMethod.GET)
    public ModelAndView example3() throws ServletException, IOException {
        return new ModelAndView("dojo_examples/example3");
    }
    
    @RequestMapping(value="example4" ,method = RequestMethod.GET)
    public ModelAndView example4() throws ServletException, IOException {
        return new ModelAndView("dojo_examples/example4");
    }
    
    @RequestMapping(value="exampleUT" ,method = RequestMethod.GET)
    public ModelAndView exampleUT() throws ServletException, IOException {
        return new ModelAndView("dojo_examples/uploadTool");
    }
    
    @RequestMapping(value="exampleBuild" ,method = RequestMethod.GET)
    public ModelAndView exampleBuild() throws ServletException, IOException {
        return new ModelAndView("dojo_examples/start");
    }
}