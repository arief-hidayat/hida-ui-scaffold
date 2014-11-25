<%@ page import="test.EmployeeType" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="layout" content="imms"/>
    <g:set var="entityName" value="${message(code: 'employeeType.label', default: 'EmployeeType')}" />
    <title>IMMS | <g:message code="default.list.label" args="[entityName]" /></title>
    <asset:stylesheet src="app-hida-all.css"/>
</head>
<body>
<!-- Content Header (Page header) -->
<section class="content-header">
    <h1>
        <g:message code='employeeType.label' default='EmployeeType'/>
    </h1>
</section>

<!-- Main content -->
<section class="content">
</section><!-- /.content -->
<asset:javascript src="app/page01.js"/>
<script type="text/javascript" charset="utf-8">
    App.url = "${request.contextPath}";
    jQuery(document).ready(function() {
        new App.view.DynamicTabs({ key : "EmployeeType", tabs : [
		{ 
			tabId : "act-et", tabNameCd : "employeeType.current.label", tabNameDefault : "Current Employee Type", 
			dataTable : { url : "/dataTable/EmployeeType" , data : { 'f_status' : 'ACTIVE' } }
		},
		{ 
			tabId : "arc-et", tabNameCd : "employeeType.archived.label", tabNameDefault : "Archived Employee Type", 
			dataTable : { url : "/dataTable/EmployeeType" , data : { 'f_status' : 'INACTIVE' } }
		},
		], allTabsAreRelated : true});
    } );
</script>
</body>
</html>