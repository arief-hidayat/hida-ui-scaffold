<%=packageName%>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="hida01"/>
    <g:set var="entityName" value="\${message(code: '${domainClass.propertyName}.label', default: '${className}')}" />
    <title><g:message code="default.list.label" args="[domainClass.naturalName]" /></title>
    <script type="text/javascript" charset="utf-8">App.url = "\${request.contextPath}";</script>
</head>
<body>
<div class="row" id="content-section">
    <div class="col-xs-12">
        <div class="row" id="message-section"></div>
        <div class="row" id="search-section">

        </div>
        <div class="row content-tab">
            <ul class="nav nav-tabs">
                <li class="active"><a href="#list-section" data-toggle="tab"><span class="glyphicon glyphicon-th-list"></span> <g:message code="default.list.label" args="[entityName]" /></a></li>
                <li><a href="#detail-section" data-toggle="tab"><span class="glyphicon glyphicon-list-alt"></span> <g:message code="default.detail.label" args="[entityName]" /></a></li>
            </ul>
            <div class="tab-content">
                <div id="list-section" class="tab-pane active col-md-12">
                    <div class="row">
                        <dt:table key='${className}'/>%{-- App.view.Table--}%
                    </div>
                </div>
                <div id="detail-section" class="tab-pane col-md-12">
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" charset="utf-8">
    jQuery(document).ready(function() {
        var options = { key : "${className}"};
        // customize config here
        new App.view.SearchTableFormPage(options);
    } );
</script>
</body>
</html>
