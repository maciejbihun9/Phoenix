<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
    <title>Phoenix Upload Tool</title>
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
 	<link rel="stylesheet" href="/copymanager/Project-Client/dgrid-1.1.0/css/dgrid.css">
	<link rel="stylesheet" href="/copymanager/Project-Client/dgrid-1.1.0/css/skins/claro.css">

    <link rel="stylesheet" href="/copymanager/Project-Client/uploadtool/widgets/css/Header.css">
    <link rel="stylesheet" href="/copymanager/Project-Client/uploadtool/views/css/UploadingView.css">
    <link rel="stylesheet" href="/copymanager/Project-Client/uploadtool/widgets/css/UploaderWithTable.css">

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
                location: "<c:url value="/Project-Client/dojo_examples/example4" />"
            },
            {
                name: 'dgrid',
                location: '<c:url value="/Project-Client/dgrid-1.1.0" />'
            },
            {
                name: 'dstore',
                location: '<c:url value="/Project-Client/dstore-1.1.1" />'
            }],
            //Application scoped parameters 
            // in application we can obtain this values
            app : {
            	operationId : <%= request.getParameter("operation_id") %>
            }
        };
    </script>


	<script src="<c:url value="/Project-Client/dojo-1.10.4/dojo/dojo.js" />"></script>

	<style type="text/css">
	html, body { height: 100%; margin: 0; }
	</style>


    
<script type="text/javascript">
	require([ "app/main"]);
</script>

</head>

<body class="claro">
	 	 
</body>
</html>
