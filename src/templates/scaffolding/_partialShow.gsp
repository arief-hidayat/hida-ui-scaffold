<div class="row detail-form-container" style="margin-left: 0px" data-readonly="true">
    <g:form>
        <g:hiddenField name="version" value="\${${propertyName}?.version}"/>
        <g:hiddenField name="id" value="\${${propertyName}?.id}"/>
        <fieldset class="form">
            <g:render template="detailForm" model="\${[prefix : prefix, create : false, readonly : true]}"/>
        </fieldset>
        <fieldset class="buttons  col-xs-12 col-centered">
            <g:if test="\${access?.update}">
                <g:actionSubmit data-url="\${createLink(action: 'editForm')}" data-action="edit" data-ajax="GET" class="btn btn-info" action="edit" value="\${message(code: 'default.button.edit.label', default: 'Edit')}"  />
            </g:if>
            <g:if test="\${access?.delete}">
                <g:actionSubmit data-url="\${createLink(action: 'delete', params : [id : ${propertyName}?.id])}" data-action="delete" data-ajax="DELETE"
                                data-confirm="\${message(code: 'confirmation.delete.label', default: 'Are you sure you want to delete selected item?')}"
                                class="btn btn-danger" action="delete" value="\${message(code: 'default.button.delete.label', default: 'Delete')}" />
            </g:if>
        </fieldset>
    </g:form>
</div>