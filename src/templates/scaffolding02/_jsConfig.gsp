<g:set var="tableConfig" value="\${grails.util.Holders.config.hida?.datatable?.domainfields}"/>
<script type="text/javascript" charset="utf-8">
    App.dt.config.table = App.dt.config.table || {};
    <g:if test="\${key instanceof String}">
        <g:if test="\${tableConfig && tableConfig[key] && !tableConfig[key].isEmpty()}">
        App.dt.config.table.\${key} = { columns: [ <g:each in="\${tableConfig[key]}" var="col" status="i"> { "data": "\${col}" }<g:if test="\${i < tableConfig[key].size() -1}">, </g:if></g:each>] };
        </g:if>
    </g:if>
    <g:else>
    <g:each in="\${key}" var="k">
    <g:if test="\${tableConfig && tableConfig[k] && !tableConfig[k].isEmpty()}">
    App.dt.config.table.\${k} = { columns: [ <g:each in="\${tableConfig[k]}" var="col" status="i"> { "data": "\${col}" }<g:if test="\${i < tableConfig[k].size() -1}">, </g:if></g:each>] };
    </g:if>
    </g:each>
    </g:else>
</script>

