<%=packageName%>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="hida01"/>
    <g:set var="entityName" value="\${message(code: '${domainClass.propertyName}.label', default: '${domainClass.naturalName}')}" />
    <title><g:message code="default.list.label" args="[entityName]" /></title>
    <script type="text/javascript" charset="utf-8">App = window.App || {}; App.url = "\${request.contextPath}";</script>
</head>
<body>
<div class="row" id="content-section">
    <div class="col-xs-12">
        <div class="row" id="message-section"></div>
        <div class="row" id="search-section">
            <g:form>
            <fieldset class="form">
            <g:render template="searchForm" model="\${[filter : filter]}"/>
            </fieldset>
            <fieldset class="buttons col-xs-12 col-centered"">
                <g:submitButton data-action="search" name="search" class="btn btn-primary btn-search" value="\${message(code: 'default.button.search.label', default: 'Search')}" />
                <g:submitButton data-action="create" name="create" class="btn btn-info btn-create" value="\${message(code: 'default.button.create.label', default: 'Create')}" />
            </fieldset>
            </g:form>
        </div>
        <div class="row content-tab" style="margin-top: 20px">
            <ul class="nav nav-tabs">
                <li class="active"><a href="#list-section" data-toggle="tab"><span class="glyphicon glyphicon-th-list"></span> <g:message code="default.list.label" args="[entityName]" /></a></li>
                <li><a href="#detail-section" data-toggle="tab"><span class="glyphicon glyphicon-list-alt"></span> <g:message code="default.detail.label" default="{0} Detail" args="[entityName]" /></a></li>
            </ul>
            <div class="tab-content">
                <div id="list-section" class="tab-pane active col-md-12" style="margin-top: 10px">
                    <div class="row table-container">
                        <dt:table key='${className}'/>%{-- App.view.Table--}%
                    </div>
                </div>
                <div id="detail-section" class="tab-pane col-md-12" style="margin-top: 10px">
                </div>
            </div>
        </div>
    </div>
</div>
<asset:javascript src="app/page02"/>
<script type="text/javascript" charset="utf-8">
    jQuery(document).ready(function() {
        var options = { key : "${className}"};
        // customize config here
        new App.view.SearchTableFormPage(options);
    } );
</script>
</body>
</html>
