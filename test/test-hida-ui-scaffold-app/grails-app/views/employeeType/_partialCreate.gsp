<div class="row message-container" style="margin-left: 0px">
    <g:render template="message"/>
</div>
<div class="row" style="margin-left: 0px">
    <g:form id="EmployeeType-create-form" url="[resource:employeeTypeInstance, action:'save']" >
    <fieldset class="form">
        <g:render template="form" model="['create' : true]"/>
    </fieldset>
    <fieldset class="buttons">
        <g:submitButton data-action="save" name="create" class="btn btn-success" value="${message(code: 'default.button.create.label', default: 'Create')}" />
    </fieldset>
    </g:form>
</div>