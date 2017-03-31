<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
    <title>Phoenix Copy Manager</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<link rel="stylesheet" href="<c:url value="/Project-Client/css/dijitToolbar.css" />">
	<style type="text/css">
		@import "<c:url value="/Project-Client/dojo-1.10.4/dojo/resources/dojo.css" />";
		@import "<c:url value="/Project-Client/dojo-1.10.4/dijit/themes/claro/claro.css" />";
		@import "<c:url value="/Project-Client/dojo-1.10.4/dojox/grid/enhanced/resources/claro/EnhancedGrid.css" />";
		@import "<c:url value="/Project-Client/dojo-1.10.4/dojox/grid/enhanced/resources/EnhancedGrid_rtl.css" />";		
	</style>
	<link rel="stylesheet" href="/copymanager/Project-Client/dojo-1.10.4/dijit/themes/claro/claro.css">
	<link rel="stylesheet" href="/copymanager/Project-Client/dojo-1.10.4/dojo/resources/dojo.css">

<script>
        // Instead of using data-dojo-config, we're creating a dojoConfig
        // object *before* we load dojo.js; they're functionally identical,
        // it's just easier to read this approach with a larger configuration.
        var dojoConfig = {
            async: true,
            // This code registers the correct location of the "demo"
            // package so we can load Dojo from the CDN whilst still
            // being able to load local modules
            packages: [{
                name: "app",
                location: "<c:url value="/Project-Client/dojo_examples/example2" />"
            }]
        };
    </script>


<script src="<c:url value="/Project-Client/dojo-1.10.4/dojo/dojo.js" />"></script>



<script type="text/javascript">
 	
require([ "dojo/dom-construct" , "app/Person" , "app/signletonExample"], function(domConstruct, Person , singleton ){ 
	person = new Person("Michal", 26 , "Test"); 
	
	console.log("Name " , person.name);
	singleton.increment();
	console.log("age " , person.age);
	singleton.increment();
	console.log("residence " , person.residence);
	singleton.increment();
	
	domConstruct.create("span", {innerHTML: person.residence} , "residence");
	domConstruct.create("span", {innerHTML: person.age} , "age");
	domConstruct.create("span", {innerHTML: person.name} , "name");
	
	
	console.log("Counter value First require" , singleton.getValue());
	
});

require([ "dojo/dom-construct"  , "app/Employee"  , "app/signletonExample"], function(domConstruct, Employee , singleton){ 
	employee =  new Employee("Stefan", 36 , "Test2" , 1000000);
	singleton.increment();
	console.log("askForRaise" , employee.askForRaise());
	singleton.increment();
	singleton.decrement();
	domConstruct.create("span", {innerHTML: employee.residence} , "eresidence");
	domConstruct.create("span", {innerHTML: employee.age} , "eage");
	domConstruct.create("span", {innerHTML: employee.name} , "ename");
	domConstruct.create("span", {innerHTML: employee.salary} , "esalary");	
	console.log("Counter value Second require" , singleton.getValue());
	
});

</script>

</head>

<body class="claro">
	<table>
		<tr><td>Name:</td><td> <div id="name"/></td></tr>
		<tr><td>age:</td><td> <div id="age"/></td></tr>
		<tr><td>residence:</td><td> <div id="residence"/></td></tr>	
	</table>
	<hr>
	<table>
		<tr><td>Name:</td><td> <div id="ename"/></td></tr>
		<tr><td>age:</td><td> <div id="eage"/></td></tr>
		<tr><td>residence:</td><td> <div id="eresidence"/></td></tr>
		<tr><td>salary:</td><td> <div id="esalary"/></td></tr>	
	</table>
</body>
</html>

