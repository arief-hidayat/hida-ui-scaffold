package com.hida.ui

import grails.transaction.Transactional
import grails.util.Holders
import org.codehaus.groovy.grails.commons.GrailsClassUtils
import org.codehaus.groovy.grails.commons.GrailsDomainClass

@Transactional
class TypeAheadService {

    private static final def typeAheadConf = Holders.config.hida?.typeahead?.displayKey ?: [:]
    private static final boolean ignoreCase = Holders.config.hida?.typeahead?.ignoreCase ?: false
    def hidaUiUtilService


    @Transactional(readOnly = true)
    def list(String key, def params, String query) {
        def conf = typeAheadConf[key]
        GrailsDomainClass grailsDomainClass = hidaUiUtilService.getClassFromKey(key)
        Class domainClz = grailsDomainClass.clazz
        if(conf) {
            if(conf instanceof String) {
//                hida.typeahead.Asset = "code"
                if(query.endsWith("*")) query = query.substring(0, query.length() -1)
                return domainClz.createCriteria().list {
                    params.each { String k, String v ->
                        if(grailsDomainClass.hasPersistentProperty(k)) {
//                            if(!(k in ['max', 'controller', 'action', 'offset', 'query'])) {
                            if(v == null) isNull(k)
                            else if (v == "") isEmpty(k)
                            else {
                                eq(k,getValue(v))
                            } // only works for String, Long, and BigDecimal
                        }
                    }
                    if(ignoreCase) {
                        ilike((String) conf, query + "%")
                    } else {
                        like((String) conf, query + "%")
                    }
                    if(params.max) maxResults(Integer.parseInt("${params.max}"))
                }
            }
        } else if((Holders.pluginManager.hasGrailsPlugin("searchable") || Holders.pluginManager.hasGrailsPlugin("elasticsearch")) &&
                GrailsClassUtils.getStaticPropertyValue(domainClz, "searchable")) {
//            return domainClz.search(query, escape: true).results
            if(query?.trim()?.isEmpty()) query = "*"
            return domainClz.search({must(queryString(query))}).results
        } else {
            throw new RuntimeException("Missing configuration")
        }
    }

    protected static def getValue(String val) {
        if(val == null) return val
        if(val ==~ /\d+/) return Long.parseLong(val)
        if(val ==~ /\d+[.]\d+/) return new BigDecimal(val)
        return val
    }
}
