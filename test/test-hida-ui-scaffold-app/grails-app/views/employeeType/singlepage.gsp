<%@ page import="test.EmployeeType" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="layout" content="hida01"/>
    <g:set var="entityName" value="${message(code: 'employeeType.label', default: 'EmployeeType')}" />
    <title>HIDA | <g:message code="default.list.label" args="[entityName]" /></title>
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
%{--<g:render template="partialSinglePage"  model="${[prefix : prefix]}"/><!-- /.row (main row) -->--}%
</section><!-- /.content -->
<asset:javascript src="app/page01.js"/>
<script type="text/javascript" charset="utf-8">
    App.url = "${request.contextPath}";
    jQuery(document).ready(function() {
        //new App.view.TableFormSinglePage({ key : "EmployeeType"});

        new App.view.DynamicTabs({ key : "EmployeeType", tabs : [
            {
                tabId : "act-employeeType", tabNameCd : "employeeType.current.label", tabNameDefault : "-",
                dataTable : { url : "/dataTable/EmployeeType" , data : { 'f_status' : 'ACTIVE' } }
            },
            {
                tabId : "arc-employeeType", tabNameCd : "employeeType.archived.label", tabNameDefault : "-",
                dataTable : { url : "/dataTable/EmployeeType" , data : { 'f_status' : 'INACTIVE' } }
            },
        ], allTabsAreRelated : true});
    } );
</script>
</body>
</html>
