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
                location: "<c:url value="/Project-Client/dojo_examples/example5" />"
            }]
        };
    </script>


<script src="<c:url value="/Project-Client/dojo-1.10.4/dojo/dojo.js" />"></script>



<script type="text/javascript">
	require(["app/MyTree" , "dojo/_base/window" ], function( MyTree, win) {
		
			var tree = new MyTree();
			tree.placeAt(win.body());
			tree.startup();
		
	});
</script>

</head>

<body class="claro">
	

</body>
</html>

