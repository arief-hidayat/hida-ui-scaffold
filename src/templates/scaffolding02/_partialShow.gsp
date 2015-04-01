<div class="row detail-form-container" style="margin-left: 0px" data-readonly="true">
    <g:form>
        <g:hiddenField name="version" value="\${${propertyName}?.version}"/>
        <g:hiddenField name="id" value="\${${propertyName}?.id}"/>
        <fieldset class="form">
            <g:render template="form" model="\${[prefix : prefix, 'show' : true]}"/>
        </fieldset>
        <fieldset class="buttons">
            <fieldset class="buttons">
                <g:actionSubmit data-url="\${createLink(action: 'edit')}" data-action="edit" class="btn btn-info" action="edit" value="\${message(code: 'default.button.edit.label', default: 'Edit')}"  />
                <g:actionSubmit data-url="\${createLink(action: 'delete')}" data-action="delete" data-ajax="DELETE"
                                data-confirm="\${message(code: 'confirmation.delete.label', default: 'Are you sure you want to delete selected item?')}"
                                class="btn btn-danger" action="delete" value="\${message(code: 'default.button.delete.label', default: 'Delete')}" />
            </fieldset>
        </fieldset>
    </g:form>
</div>