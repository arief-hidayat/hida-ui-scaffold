<%=packageName%>
${"<% int tableWidth = grails.util.Holders.config.hida?.datatable?.singlepage?.width?." + className + " ?: 6 %>"}
<div class="row" id="content-section">
    <div id="list-section" class="col-md-\${tableWidth}">%{--App.view.TableRegion--}%
        <div class="row buttons" style="margin-top: 10px">
            <div class="col-xs-12 col-centered">
                <bt:create>&nbsp;</bt:create>
                <bt:show>&nbsp;</bt:show>
                <bt:delete>&nbsp;</bt:delete>
            </div>
        </div>
        <div class="row">
            <dt:table key='${className}'/>%{-- App.view.Table--}%
        </div>
    </div>

    <div id="detail-section" class="col-md-\${12 - tableWidth}">
        %{--<g:render template="partialCreate"/>--}%
    </div>
</div>
