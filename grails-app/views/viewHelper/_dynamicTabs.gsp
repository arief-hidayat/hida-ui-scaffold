<ul class="nav nav-tabs">
    <g:each in="${tabs}" var="tab" status="i">
        <li>
            <a href="#${tab.tabId}" data-toggle="tab">
                <g:if test="${tab.cssIcon}"><span class="glyphicon glyphicon-th-list"></span> </g:if>
                <g:message code="${tab.tabNameCd}" args="${[tab.tabNameDefault]}" /></a>
        </li>
    </g:each>
</ul>
<div class="tab-content">
    <g:each in="${tabs}" var="tab" status="i">
        <div id="${tab.tabId}" class="tab-pane col-md-12">

        </div>
    </g:each>
</div>