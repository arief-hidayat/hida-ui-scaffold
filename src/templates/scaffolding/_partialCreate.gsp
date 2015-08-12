<div class="row detail-form-container" style="margin-left: 0px">
    <g:form <%= multiPart ? ' enctype="multipart/form-data"' : '' %>>
    <fieldset class="form">
        <g:render template="detailForm"  model="\${[prefix : prefix, create : true, readonly : false]}"/>
    </fieldset>
    <fieldset class="buttons  col-xs-12 col-centered">
        <g:if test="\${access?.create}">
            <g:submitButton data-action="save" data-ajax="POST" data-url="\${createLink(action: 'save')}" name="create" class="btn btn-success" value="\${message(code: 'default.button.create.label', default: 'Create')}" />
        </g:if>
    </fieldset>
    </g:form>
</div>