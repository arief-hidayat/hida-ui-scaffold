package com.hida.ui

import grails.util.GrailsNameUtils
import grails.util.Holders
import org.springframework.context.i18n.LocaleContextHolder

class BsFormFieldTagLib {
    static namespace = "bsf"
    def messageSource
    protected String getPlaceholder() {
        messageSource.getMessage("placeholder.typeahead.label", null, "type ahead and select ...", LocaleContextHolder.locale)
    }
    protected String getMessage(String domainName, String field) {
        messageSource.getMessage("${domainName}.${field}.label", null, GrailsNameUtils.getNaturalName(field), LocaleContextHolder.locale)
    }
//    <div class="col-md-4 col-sm-6 col-xs-12">
//        <div class="form-group ${hasErrors(bean: claimCodeInstance, field: 'lastModifiedBy', 'has-error')} required">
//        <label for="lastModifiedBy">
//        <g:message code="default.lastModifiedBy.label" default="Last Modified By" />
//        <span class="required-indicator">*</span>
//            </label>
//        <g:textField class="form-control" name="lastModifiedBy" value="${claimCodeInstance?.lastModifiedBy}" readonly="${readonly}"/>
//        </div>
//    </div>
    def text = {attrs ->
        def bean = attrs.bean
        String field = attrs.field
        def value = bean ? bean[field] : null
        def readonly = attrs.readonly
        def valueDisplay = textField(class: "form-control", name: field, value: value, readonly: readonly )
        out << formField(bean, field, valueDisplay, null, attrs)
    }
    def longText = {attrs ->
        def bean = attrs.bean
        String field = attrs.field
        def value = bean ? bean[field] : null
        def readonly = attrs.readonly
        def valueDisplay = textArea(class: "form-control", name: field, value: value, readonly: readonly )
        out << formField(bean, field, valueDisplay, null, attrs)
    }

    private StringBuilder formField(def bean, String field, def valueDisplay, def data, def attrs) {
        StringBuilder sb = new StringBuilder()
        String cssClass = attrs.cssClass ?: "col-sm-4 col-md-6 col-xs-12"
        def required = attrs.required
        def label = bean ? getMessage(bean.class.simpleName, field) : getMessage("default", field)
        sb.append("<div class='").append(cssClass).append("'")
        data?.each {
            key, value -> sb.append(" data-").append(key).append("='").append(value).append("'")
        }
        if(attrs.containsKey("showOn") && !attrs.showOn) sb.append(" style='display:none;'")
        sb.append(">")
        def hasError = hasErrors(bean: bean, field: field, 'has-error')
        sb.append("<div class='form-group ").append(hasError).append(" ")
        if(required) sb.append("required")
        sb.append("'>")

        sb.append("<label for='").append(field).append("'>").append(label)
        if(required) sb.append("<span class='required-indicator'>*</span>")
        sb.append("</label>")
        String prefix = attrs.prefix, postfix = attrs.postfix
        if(!prefix && !postfix) {
            sb.append(valueDisplay)
        } else {
            sb.append("<div class='input-group'>")
            if(prefix) {
                sb.append("<span class='input-group-addon'>").append(prefix).append("</span>")
            }
            sb.append(valueDisplay)
            if(postfix) {
                sb.append("<span class='input-group-addon'>").append(postfix).append("</span>")
            }
            sb.append("</div>")
        }
        sb.append("</div>")
        sb.append("</div>")
        sb
    }

//    <div class="col-md-4 col-sm-6 col-xs-12">
//        <div class="form-group ${hasErrors(bean: claimCodeInstance, field: 'medical', 'has-error')} required">
//        <label for="medical">
//        <g:message code="default.medical.label" default="Medical" />
//        <span class="required-indicator">*</span>
//            </label>
//        <g:textField class="form-control" name="medical" required="" value="${formatNumber(number: claimCodeInstance?.medical, type: 'number')}" readonly="${readonly}"/>
//        </div>
//    </div>
    def number = { attrs ->
        def bean = attrs.bean
        String field = attrs.field
        def readonly = attrs.readonly
        def value = bean ? formatNumber(number: bean[field], type: 'number') : null
        def valueDisplay = textField(class: "form-control", name: field, value: value, readonly: readonly )
        out << formField(bean, field, valueDisplay, null, attrs)
    }

//    <div class="col-md-4 col-sm-6 col-xs-12">
//        <div class="form-group ${hasErrors(bean: claimCodeInstance, field: 'status', 'has-error')} required">
//        <label for="status">
//        <g:message code="default.status.label" default="Status" />
//        <span class="required-indicator">*</span>
//            </label>
//        %{--<g:select class="form-control select2-simple" name="status" from="${claimCodeInstance.constraints.status.inList}" value="${claimCodeInstance?.status}" valueMessagePrefix="claimCode.status" noSelection="['': '']" readonly="${readonly}"/>--}%
//        <g:select class="form-control select2-simple" name="status"  from="${['Active', 'Inactive']}" keys="${['A', 'I']}"
//        value="${claimCodeInstance?.status}" valueMessagePrefix="claimCode.status" noSelection="['': '']" readonly="${readonly}"/>
//        </div>
//    </div>
    def selectInList = { attrs ->
        def bean = attrs.bean
        String field = attrs.field
        def value = bean ? bean[field] : null
        def readonly = attrs.readonly

        def selectAttrs = [class: "form-control select2-simple", name: field, value: value, readonly: readonly, noSelection : ['': ''],
                           valueMessagePrefix : "${GrailsNameUtils.getPropertyName(bean.class)}.${field}"]
        selectAttrs.from = attrs.from ?: bean.constraints."${field}".inList
        if(attrs.keys) selectAttrs.keys = attrs.keys
        out << formField(bean, field, select(selectAttrs), null, attrs)
    }
    def selectRemote = { attrs ->
        def bean = attrs.bean
        String field = attrs.field
        def value = bean ? bean[field] : null
        def readonly = attrs.readonly

        def selectAttrs = [class: "form-control select2-remote", name: field, value: value, readonly: readonly, noSelection : ['': ''],
                           valueMessagePrefix : "${GrailsNameUtils.getPropertyName(bean.class)}.${field}"]
        selectAttrs.from = bean.class.simpleName

        out << formField(bean, field, select(selectAttrs), null, attrs)
    }

    def dateTime = { attrs ->
        def bean = attrs.bean
        String field = attrs.field
        def value = bean ? bean[field] : null
        def readonly = attrs.readonly

        def valueDisplay = bs.dateTimePicker(id : "${GrailsNameUtils.getPropertyName(bean.class)}Instance-${field}", field: field, value: value, readonly : readonly,
                default : attrs.default, pattern : Holders.config.jodatime?.format?.org?.joda?.time?.LocalDateTime)
        out << formField(bean, field, valueDisplay, null, attrs)
    }
    def date = { attrs ->
        def bean = attrs.bean
        String field = attrs.field
        def value = bean ? bean[field] : null
        def readonly = attrs.readonly

        def valueDisplay = bs.datePicker(id : "${GrailsNameUtils.getPropertyName(bean.class)}Instance-${field}", field: field, value: value, readonly : readonly,
                default : attrs.default, pattern : Holders.config.jodatime?.format?.org?.joda?.time?.LocalDate)
        out << formField(bean, field, valueDisplay, null, attrs)
    }

}
