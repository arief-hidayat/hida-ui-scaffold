<div class="row detail-form-container" style="margin-left: 0px">
    <g:form <%= multiPart ? ' enctype="multipart/form-data"' : '' %>>
    <g:hiddenField name="version" value="\${${propertyName}?.version}" />
    <g:hiddenField name="id" value="\${${propertyName}?.id}"/>
    <fieldset class="form">
        <g:render template="detailForm" model="\${[prefix : prefix, create : false, readonly : false]}"/>
    </fieldset>
    <fieldset class="buttons  col-xs-12 col-centered">
        <g:if test="\${access?.update}">
            <g:actionSubmit data-action="update" data-ajax="POST" data-url="\${createLink(action: 'update')}"  class="btn btn-success" action="update" value="\${message(code: 'default.button.update.label', default: 'Update')}" />
        </g:if>
    </fieldset>
    </g:form>
</div>