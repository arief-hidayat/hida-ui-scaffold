<%=packageName%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="layout" content="imms"/>
    <g:set var="entityName" value="\${message(code: '${domainClass.propertyName}.label', default: '${className}')}" />
    <title>IMMS | <g:message code="default.list.label" args="[entityName]" /></title>
    <asset:stylesheet src="app-hida-all.css"/>
</head>
<body>
<!-- Content Header (Page header) -->
<section class="content-header">
    <h1>
        <g:message code='${domainClass.propertyName}.label' default='${className}'/>
    </h1>
</section>

<!-- Main content -->
<section class="content">
%{--<g:render template="partialSinglePage"  model="\${[prefix : prefix]}"/><!-- /.row (main row) -->--}%
</section><!-- /.content -->
<asset:javascript src="app/page01.js"/>
<script type="text/javascript" charset="utf-8">
    App.url = "\${request.contextPath}";
    jQuery(document).ready(function() {
        //new App.view.TableFormSinglePage({ key : "${className}"});

        new App.view.DynamicTabs({ key : "${className}", tabs : [
            {
                tabId : "act-${domainClass.propertyName}", tabNameCd : "${domainClass.propertyName}.current.label", tabNameDefault : "-",
                dataTable : { url : "/dataTable/EmployeeType" , data : { 'f_status' : 'ACTIVE' } }
            },
            {
                tabId : "arc-${domainClass.propertyName}", tabNameCd : "${domainClass.propertyName}.archived.label", tabNameDefault : "-",
                dataTable : { url : "/dataTable/${className}" , data : { 'f_status' : 'INACTIVE' } }
            },
        ], allTabsAreRelated : true});
    } );
</script>
</body>
</html>
