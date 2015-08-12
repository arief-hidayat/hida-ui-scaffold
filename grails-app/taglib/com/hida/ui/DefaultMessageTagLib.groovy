package com.hida.ui

class DefaultMessageTagLib {

    static namespace = "dm"


//    <g:if test="${flash.info}">
//    <p class="bg-info">${flash.info}</p>
//    </g:if>
//    <g:if test="${flash.warning}">
//    <p class="bg-warning">${flash.warning}</p>
//    </g:if>
//    <g:if test="${flash.error}">
//    <p class="bg-danger" style="padding: 10px">${flash.error}</p>
//    </g:if>
    def messageFromFlash = { attrs ->
        if(attrs.flash) {
            if(attrs.flash.error) {
                out << "<p class='bg-danger' " + addPadding() + ">" + attrs.flash.error + "</p>"
                attrs.flash.error = null
            }
            if(attrs.flash.warning) {
                out << "<p class='bg-warning' " + addPadding() + ">" + attrs.flash.warning + "</p>"
                attrs.flash.warning = null
            }
            if(attrs.flash.info) {
                out << "<p class='bg-info' " + addPadding() + ">" + attrs.flash.info + "</p>"
                attrs.flash.info = null
            }
        }
    }
//    <p class="bg-danger"  style="padding: 10px" <g:if test="${error in org.springframework.validation.FieldError}">data-field-id="${error.field}"</g:if>><g:message error="${error}"/></p>
    def messageFromError = { attrs ->
        if(attrs.error) {
            def error = attrs.error
            String dataField = ( error in org.springframework.validation.FieldError) ? " data-field-id='${error.field}'" : ""
            out << "<p class='bg-danger' " + addPadding() + dataField + ">" + g.message(error: error) + "</p>"
        }
    }

    private String addPadding() {
        return "style='padding: 10px'"
    }
}
