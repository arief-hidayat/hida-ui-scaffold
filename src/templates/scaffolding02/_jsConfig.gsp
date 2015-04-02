<g:set var="tableConfig" value="\${grails.util.Holders.config.hida?.datatable?.domainfields}"/>
<script type="text/javascript" charset="utf-8">
    <g:if test="\${tableConfig && tableConfig[key] && !tableConfig[key].isEmpty()}">
    App.dt.config.table = App.dt.config.table || {};
    App.dt.config.table.\${key} = { columns: [ <g:each in="\${tableConfig[key]}" var="col" status="i"> { "data": "\${col}" }<g:if test="\${i < tableConfig[key].size() -1}">, </g:if></g:each>] };
    </g:if>
</script>

