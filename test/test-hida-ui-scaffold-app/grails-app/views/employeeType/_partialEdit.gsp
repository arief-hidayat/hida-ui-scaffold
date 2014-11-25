<div class="row message-container" style="margin-left: 0px">
    <g:render template="message"/>
</div>
<div class="row" style="margin-left: 0px">
    <g:form url="[resource:employeeTypeInstance, action:'update']" method="PUT" >
    <g:hiddenField name="version" value="${employeeTypeInstance?.version}" />
    <fieldset class="form">
        <g:render template="form" model="${[prefix : prefix]}"/>
    </fieldset>
    <fieldset class="buttons">
        <g:actionSubmit data-action="update" class="btn btn-success" action="update" value="${message(code: 'default.button.update.label', default: 'Update')}" />
    </fieldset>
    </g:form>
</div>