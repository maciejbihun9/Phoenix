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
	
	<style>
		#conflictInfo .dojoxGridHeader { display: none; } 
		.toggledPane {display: none;}
		body{
			opacity: 0;
		}
	</style>

<script src="<c:url value="/Project-Client/dojo-1.10.4/dojo/dojo.js" />" data-dojo-config="async:true,  waitSeconds: 10"></script>
<script type="text/javascript" src="<c:url value="/Project-Client/js/copymanager-main.js"/>"></script>
<script type="text/javascript" src="<c:url value="/Project-Client/js/copymanager-top-menu.js"/>"></script>
<script type="text/javascript" src="<c:url value="/Project-Client/js/copymanager-user-operations.js"/>"></script>

<script type="text/javascript">
    require(["dojo/parser", "dijit/form/Button", "dojo/domReady!"],
	    function(parser){
	        parser.parse().then(
	        	function(){
	        		document.body.style.opacity=1; 
	        	}		
	        );	        
	    }
    );    
</script>

<script type="text/javascript">
    var bIn = false, oTimer, vNode;

    function onOut() {
        bIn = false;
        vNode = null;
        clearTimeout(oTimer);
    }

    function onOver(objNode) {
    	var autoExpandNodeFlg = dojo.byId("autoExpandNodeFlg").value;
    	//console.log("autoExpandNodeFlg:" + autoExpandNodeFlg);    	
    	if(undefined == autoExpandNodeFlg 
    	    || "false" == autoExpandNodeFlg
    	    || "" == autoExpandNodeFlg){
    		return;
    	}
    	
    	if(objNode.disabled){
    		return;
    	}
    	if(undefined == objNode.item){
    		return;
    	}
    	
        bIn = true;
        vNode = objNode;
        oTimer = setTimeout("onTime()", 1000);
    }

    function onTime() {
        if (bIn) {
            //var node = dijit.getEnclosingWidget(vTree.target);
            if (vNode.isExpandable) {
                targetfileSystemTree._expandNode(vNode);
                //console.log("NodeId:" + vNode.item.id + "  Path:" + vNode.item.path);
            };            
        }
    }
</script>
</head>

<body class="claro">
    <div data-dojo-type="dojo/store/JsonRest" data-dojo-id="treeViewStore"
        id="treeViewStore" data-dojo-props="target:'rest/filesystem/tree'">
        <script type="dojo/method" data-dojo-event="getChildren"
            data-dojo-args="object">
            console.log("Invoking getChildren");
               return this.get(object.id).then(function(fullObject){
                                    return fullObject.children;
                                });
        </script>
    </div>

    <div data-dojo-type="dijit/tree/ObjectStoreModel"
        data-dojo-id="myModel" id="myModel"
        data-dojo-props="store:treeViewStore">
        <script type="dojo/method" data-dojo-event="getRoot"
            data-dojo-args="onItem">
               this.store.get("-1").then(onItem);    
        </script>

    </div>

    <div data-dojo-type="dijit/layout/StackContainer" id="myStackContainer"
        data-dojo-id="myStackContainer">
        <div data-dojo-type="dijit/layout/BorderContainer"
            data-dojo-props="gutters:true, liveSplitters:false"
            id="mainContainer">
            <div id="toolbar1" data-dojo-type="dijit/Toolbar"
                data-dojo-props="region:'top', splitter:false">
                <button data-dojo-type="dijit/form/Button" id="naviup" disabled style=""
                     data-dojo-props="iconClass:'dijitTeamplaceIcon dijitTeamplaceIconNavigateUp', showLabel:false">
                </button>
                <span data-dojo-type="dijit/ToolbarSeparator"></span>
                <div data-dojo-type="dijit/form/Button" id="toolbar1.cut">
	                <script type="dojo/on" data-dojo-event="click" data-dojo-args="event">
                        window.location.href = window.location.protocol + "//" + window.location.host;
                    </script>
                    Back to Phoenix</div>
                <span data-dojo-type="dijit/ToolbarSeparator"></span>
                <div data-dojo-type="dijit/form/Button" id="historyBtn"
                    data-dojo-id="historyBtn">History of changes</div>
            </div>
            <div data-dojo-type="dijit/layout/ContentPane"
                data-dojo-props="minSize:20, region:'leading', splitter:true"
                style="width: 280px;" id="leftTree">
                <div data-dojo-type="dijit/Tree" id="srcfileSystemTree"
                    data-dojo-props="model: myModel,openOnClick:false,showRoot:false">
                </div>
            </div>
            <div data-dojo-type="dojox/layout/ContentPane" id="middleFrame"
                data-dojo-props="region:'center', tabStrip:true">
                <div id="middleFrameTabs" data-dojo-type="dijit/layout/TabContainer"
                    style="width: 100%; height: 100%;"></div>
            </div>
            <div data-dojo-type="dijit/layout/ContentPane"
                data-dojo-props="minSize:20, region:'trailing', splitter:true"
                style="width: 280px;" id="targetTree">
                <div data-dojo-type="dijit/Tree" data-dojo-id="targetfileSystemTree"
                    id="targetfileSystemTree"
                    data-dojo-props="model: myModel, openOnClick:true,showRoot:false"> 
                    <script type="dojo/method" data-dojo-event="onMouseOver"
                        data-dojo-args="object">
                        var node = dijit.getEnclosingWidget(object.target);
                        this.focusNode(node);
                        onOver(node);
                    </script>
                    <script type="dojo/method" data-dojo-event="onMouseOut"
                        data-dojo-args="object">
                        onOut();
                </script>
                </div>
            </div>
            <div data-dojo-type="dijit/layout/BorderContainer"
                data-dojo-props="gutters:true, liveSplitters:true,region:'bottom',splitter:true"
                style="width: 100%; height: 30%" id="conflictContainer">
            	
            	<div data-dojo-type="dojox/layout/ContentPane" id="conflictInfo" data-dojo-props="region:'center'">
                	<div style="width: 100%; height: 14%">
                	<div id="operations-summary-bar" style="float:left; width: 80%; margin-top: 10px; line-height: 14%;">
                		<span style="margin: 0px 0px 0px 10px;">Total:</span><span id="totalNb" style="font-weight: bold; margin: 0px 10px 0px 10px;">0</span>|
                		<span id="plannedSpan" class="filter-item"><span style="color: blue; margin: 0px 0px 0px 10px;">Planned:</span><span id="plannedNb" style="font-weight: bold; margin: 0px 10px 0px 10px;">0</span></span>|
                		<span id="withoutConflictSpan" class="filter-item"><span style="color: green; margin: 0px 0px 0px 10px;">Without conflict:</span><span id="withoutConflictsNb" style="font-weight: bold; margin: 0px 10px 0px 10px;">0</span></span>|
                		<span id="solvableConflictSpan" class="filter-item"><span style="color: #fe7f00; margin: 0px 0px 0px 10px;">Solvable conflicts:</span><span id="solvableConflictsNb" style="font-weight: bold; margin: 0px 10px 0px 10px;">0</span></span>|
                		<span id="unsolvableConflictSpan" class="filter-item"><span style="color: red; margin: 0px 0px 0px 10px;">Unsolvable conflicts:</span><span id="unsolvableConflictsNb" style="font-weight: bold; margin: 0px 10px 0px 10px;">0</span></span>|
                   		<span id="blockedSpan" class="filter-item"><span style="color: #b100fe; margin: 0px 0px 0px 10px;">Blocked:</span><span id="blockedNb" style="font-weight: bold; margin: 0px 10px 0px 10px;">0</span></span>
                	</div>
                	<div style="float: right; width: 20%; margin-top: -4px; line-height: 10%;" align="right">
                		<button id="operationActionBtn"></button>
                	</div>
					</div>
                	<div id="conflictTabs" data-dojo-type="dijit/layout/TabContainer" data-dojo-props='tabStrip:false, useSlider:true, tabPosition:"bottom"'
                    	style="width: 100%; height: 86%;">
                    </div>
	            </div>
            </div>
        </div>
    </div>
    <input type="hidden" id="pathId" />
    <input type="hidden" id="pathText" />
    <input type="hidden" id="rootFolderAdmin" />
    <input type="hidden" id="autoExpandNodeFlg" />
</body>
</html>
