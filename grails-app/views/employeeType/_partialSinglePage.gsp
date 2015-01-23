<%@ page import="test.EmployeeType" %>
<% int tableWidth = grails.util.Holders.config.hida?.datatable?.singlepage?.width?.EmployeeType ?: 6 %>
<div class="row" id="${prefix?:''}content-section">
    <div id="${prefix?:''}list-section" class="col-md-${tableWidth}">%{--App.view.TableRegion--}%
        <div class="row buttons" style="margin-top: 10px">
            <div class="col-md-8 col-xs-8 col-centered">
                <bt:create>&nbsp;</bt:create>
                <bt:show>&nbsp;</bt:show>
                <bt:delete>&nbsp;</bt:delete>
            </div>
        </div>
        <div class="row">
            <dt:table key="${tableColumnKey?:'EmployeeType'}"/>%{-- App.view.Table--}%
        </div>
    </div>

    <div id="${prefix?:''}detail-section" class="col-md-${12 - tableWidth}">
        <g:render template="partialCreate" model="${[prefix : prefix, create : true]}"/>
    </div>
</div>