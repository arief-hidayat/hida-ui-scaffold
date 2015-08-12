package com.hida.ui

import grails.util.GrailsNameUtils
import grails.util.Holders
import org.springframework.context.i18n.LocaleContextHolder

class DefaultTableTagLib {
    static namespace = "dt"
    def messageSource
    def table = { attrs, body ->
        out << buildTable(attrs)
    }

    protected String buildTable(def attrs) {
        StringBuilder sb = new StringBuilder()
        String columns = buildHeaderColumns(attrs.key, attrs.columns)
        sb.append "<table "
        if(attrs.id) sb.append "id='${attrs.id}'"
        sb.append " class='${attrs.class ?: 'table table-bordered'}' cellspacing='0' width='${attrs.width ?: '100%'}'>"
        sb.append("<thead>").append(columns).append("</thead>").append("<tfoot>").append(columns).append("</tfoot>").append("</table>")
        sb.toString()
    }

    protected String buildHeaderColumns(String domainName, def columns = []) {
        StringBuilder sb = new StringBuilder()
        sb.append("<tr>")
        def conf = Holders.config.hida?.datatable?.domainfields ?: [:]
        (conf[domainName] ?: columns)?.each {
            sb.append("<td>").append(getMessage(domainName, it)).append("</td>")
        }
        sb.append("</tr>")
        sb.toString()
    }

    protected String getMessage(String domainName, String field) {
        messageSource.getMessage("${domainName}.${field}.label", null,
                GrailsNameUtils.getNaturalName(field), LocaleContextHolder.locale)
    }
}
