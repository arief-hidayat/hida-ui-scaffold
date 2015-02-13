<%@ page import="test.Employee" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="layout" content="hida01"/>
    <g:set var="entityName" value="${message(code: 'employee.label', default: 'Employee')}"/>
    <title>HIDA | <g:message code="default.list.label" args="[entityName]"/></title>
    <asset:stylesheet src="app-hida-all.css"/>
</head>

<body>
<!-- Content Header (Page header) -->
<section class="content-header">
    <h1>
        <g:message code='employee.label' default='Employee'/>
    </h1>
</section>

<!-- Main content -->
<section class="content">
    <g:render template="partialSinglePage" model="${[prefix: prefix]}"/><!-- /.row (main row) -->
</section><!-- /.content -->
<asset:javascript src="app/page01.js"/>
<script type="text/javascript" charset="utf-8">
    App.url = "${request.contextPath}";
    jQuery(document).ready(function () {
        new App.view.TableFormSinglePage({ key: "Employee"});
        %{--new App.view.DynamicTabs({ key : "Employee", tabs : [--}%
        %{--{--}%
        %{--tabId : "act-employee", tabNameCd : "employee.current.label", tabNameDefault : "-",--}%
        %{--dataTable : { url : "/dataTable/Employee" , data : { 'f_status' : 'ACTIVE' } }--}%
        %{--},--}%
        %{--{--}%
        %{--tabId : "arc-employee", tabNameCd : "employee.archived.label", tabNameDefault : "-",--}%
        %{--dataTable : { url : "/dataTable/Employee" , data : { 'f_status' : 'INACTIVE' } }--}%
        %{--},--}%
        %{--], allTabsAreRelated : true});--}%
    });
</script>
</body>
</html>
