<div class="row detail-form-container" style="margin-left: 0px">
    <g:form <%= multiPart ? ' enctype="multipart/form-data"' : '' %>>
    <g:hiddenField name="version" value="\${${propertyName}?.version}" />
    <fieldset class="form">
        <g:render template="form" model="\${[prefix : prefix]}"/>
    </fieldset>
    <fieldset class="buttons">
        <g:actionSubmit data-action="update" data-ajax="PUT" class="btn btn-success" action="update" value="\${message(code: 'default.button.update.label', default: 'Update')}" />
    </fieldset>
    </g:form>
</div>