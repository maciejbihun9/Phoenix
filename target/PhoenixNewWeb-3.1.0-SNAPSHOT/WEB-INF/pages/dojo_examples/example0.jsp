<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<title>Phoenix Copy Manager</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<link rel="stylesheet"
	href="<c:url value="/Project-Client/css/dijitToolbar.css" />">

<link rel="stylesheet"
	href="/copymanager/Project-Client/dojo-1.10.4/dijit/themes/claro/claro.css">
<link rel="stylesheet"
	href="/copymanager/Project-Client/dojo-1.10.4/dojo/resources/dojo.css">



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
                location: "<c:url value="/Project-Client/dojo_examples/example1" />"
            }]
        };
    </script>


<script src="<c:url value="/Project-Client/dojo-1.10.4/dojo/dojo.js" />"></script>



<script type="text/javascript">

	require([ "dojo/parser" ,"dijit/form/Form", "dijit/form/TextBox",  "dijit/form/Button" ], function(parser, Form , TextBox, Button) {
		var form = new Form(null , "form" );

		var field1 = new TextBox().placeAt(form, "last");
		var field2 = new TextBox().placeAt(form, "last");
		var button = new Button({label: "Login"}).placeAt(form, "last");
		
		parser.parse();
	});
</script>

</head>

<body class="claro">

	<table>
		<tr>
			<td>
				<h3>Declarative</h3>


				<form data-dojo-type="dijit/form/Form">


					<input type="text" name="field1"
						data-dojo-type="dijit/form/TextBox" /> <input type="password"
						name="field2" data-dojo-type="dijit/form/TextBox" />

					<button type="submit" data-dojo-type="dijit/form/Button">Login</button>
				</form>
			</td>
			<td></td>
			<td>
				<h3>Programaticaly</h3>
				<div id="form"></div>
			</td>
		</tr>
	</table>
</body>
</html>
