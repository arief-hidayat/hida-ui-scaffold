<div class="row detail-form-container" style="margin-left: 0px">
    <g:form <%= multiPart ? ' enctype="multipart/form-data"' : '' %>>
    <fieldset class="form">
        <g:render template="form"  model="\${[prefix : prefix, create : true]}"/>
    </fieldset>
    <fieldset class="buttons">
        <g:submitButton data-action="save" data-ajax="POST" name="create" class="btn btn-success" value="\${message(code: 'default.button.create.label', default: 'Create')}" />
    </fieldset>
    </g:form>
</div>