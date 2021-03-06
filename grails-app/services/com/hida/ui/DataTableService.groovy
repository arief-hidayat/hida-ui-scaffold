package com.hida.ui

import com.hida.ui.dt.DataTableRequest
import com.hida.ui.dt.DataTableResponse
import com.hida.ui.dt.DtReqColumn
import com.hida.ui.dt.DtReqOrder
import grails.orm.PagedResultList
import grails.transaction.Transactional
import grails.util.Holders
import org.codehaus.groovy.grails.commons.GrailsClassUtils
import org.grails.datastore.mapping.query.api.Criteria

//@Transactional
class DataTableService {
    static transactional = false
    def hidaUiUtilService
    private static final boolean ignoreCase = Holders.config.hida?.typeahead?.ignoreCase ?: false

//    @Transactional(readOnly = true)
    DataTableResponse list(String key, DataTableRequest req, def additionalFilter= [:]) { // for simplicity, key is domainName
//        println "list dataTable -> ${req.draw} ${req.start} ${req.length}. search : ${req.search}"
        Class domainClz = hidaUiUtilService.getClassFromKey(key)?.clazz
        if(req.search.value && (Holders.pluginManager.hasGrailsPlugin("searchable") || Holders.pluginManager.hasGrailsPlugin("elasticsearch")) &&
                GrailsClassUtils.getStaticPropertyValue(domainClz, "searchable")) {
            return listBySearchablePlugin(key, req)
        } else {
            // hibernate-search plugin?
        }
        return listByDefaultHibernatePlugin(key, req, additionalFilter)
    }

    protected def listBySearchablePlugin(String key, DataTableRequest req) {
        DataTableResponse resp = new DataTableResponse(draw: req.draw)
        def searchOptions = [offset: req.start, max: req.length]
        Class domainClz = hidaUiUtilService.getClassFromKey(key)?.clazz
        def searchResults = domainClz.search({
            if(req.search.value) must(queryString(req.search.value))
            for(DtReqColumn col : req.columns) {
                if(col.search.value) {
                    if(!col.search.regex) term(col.data, col.search.value) //TODO: this works only for String value.
                    else wildcard(col.data, col.search.value)
                }
                    }
                    // sorting not working
        //            for(DtReqOrder ord : req.orders)
        //                addSort(req.columns.get(ord.column).data)
        }, searchOptions)
        resp.recordsFiltered = searchResults.total
        resp.withData(searchResults.results)
        resp.recordsTotal = domainClz.count()
        resp
    }

    Closure getBaseCriteria(def additionalFilter= [:]) {
        return { Criteria criteria ->
            additionalFilter.each {
                String fieldFilter, def fieldValue ->
                    if(fieldValue) {
                        def actualFieldVal = fieldValue instanceof String ? getValue(fieldValue) : fieldValue
                        if(actualFieldVal instanceof String) criteria.eq(fieldFilter, actualFieldVal, [ignoreCase: ignoreCase])
                        else criteria.eq(fieldFilter, actualFieldVal)
                    }
            }
        }
    }
    protected def listByDefaultHibernatePlugin(String key, DataTableRequest req, def additionalFilter= [:]) {
//        DataTableResponse resp = new DataTableResponse(draw: req.draw)
//        def domainClz = hidaUiUtilService.getClassFromKey(key)?.clazz
//        Closure baseCriteriaClosure = getBaseCriteria(additionalFilter)
        return populateDataTablePage(key, req, getBaseCriteria(additionalFilter), ignoreCase)
//        long total = domainClz.createCriteria().get {
//            baseCriteriaClosure(delegate)
//            projections { rowCount() }
//        }
//        def results = domainClz.createCriteria().list(max : req.length, offset: req.start) { //PagedResultList
//            baseCriteriaClosure(delegate)
//            if(req.search.value) {
//                if(req.columns.size() > 0) {
//                    String field= req.columns[0].data
//                    if(!req.search.regex) {
//                        eq(field, getValue(req.search.value), [ignoreCase: ignoreCase])
//                    }
//                    else {
//                        def searchTerm = getValue(req.search.value)
//                        if(searchTerm instanceof String)  searchTerm = searchTerm.replaceAll("[*]", "%")
//                        if(ignoreCase) {
//                            ilike(field, searchTerm)
//                        } else {
//                            like(field, searchTerm)
//                        }
//                    }
//                }
//            }
//            for(DtReqOrder ord : req.orders)
//                order(req.columns.get(ord.column).data, ord.dir)
//            for(DtReqColumn col : req.columns) {
//                if(col.search.value) {
//                    if(!col.search.regex) {
//                        eq(col.data, getValue(col.search.value), [ignoreCase: ignoreCase])
//                    }
//                    else {
//                        def searchTerm = getValue(col.search.value)
//                        if(searchTerm instanceof String)  searchTerm = searchTerm.replaceAll("[*]", "%")
//                        if(ignoreCase) {
//                            ilike(col.data, searchTerm)
//                        } else {
//                            like(col.data, searchTerm)
//                        }
//                    }
//                }
//            }
//        }
//        resp.recordsFiltered = results.totalCount
//        resp.withData(results.list)
//        resp.recordsTotal = total
//        resp
    }


    def populateDataTablePage(String key, DataTableRequest req, Closure baseCriteriaClosure, boolean ignoreCase, Closure customCriteriaClosure = null) {
        DataTableResponse resp = new DataTableResponse(draw: req.draw)

        def domainClz = hidaUiUtilService.getClassFromKey(key)?.clazz
        long total = domainClz.createCriteria().get {
            baseCriteriaClosure(delegate)
            projections { rowCount() }
        }
        PagedResultList results = domainClz.createCriteria().list(max : req.length, offset: req.start) { //PagedResultList
            baseCriteriaClosure(delegate)
            if(req.search.value) {
                if(req.columns.size() > 0) {
                    String field= req.columns[0].data
                    if(!req.search.regex) {
                        eq(field, getValue(req.search.value), [ignoreCase: ignoreCase])
                    }
                    else {
                        def searchTerm = getValue(req.search.value)
                        if(searchTerm instanceof String)  searchTerm = searchTerm.replaceAll("[*]", "%")
                        if(ignoreCase) {
                            ilike(field, searchTerm)
                        } else {
                            like(field, searchTerm)
                        }
                    }
                }
            }
            if(customCriteriaClosure) customCriteriaClosure(delegate)
            for(DtReqOrder ord : req.orders)
                order(req.columns.get(ord.column).data, ord.dir)
            for(DtReqColumn col : req.columns) {
                if(col.search.value) {
                    if(!col.search.regex) {
                        eq(col.data, getValue(col.search.value), [ignoreCase: ignoreCase])
                    }
                    else {
                        def searchTerm = getValue(col.search.value)
                        if(searchTerm instanceof String)  searchTerm = searchTerm.replaceAll("[*]", "%")
                        if(ignoreCase) {
                            ilike(col.data, searchTerm)
                        } else {
                            like(col.data, searchTerm)
                        }
                    }
                }
            }
        }
        resp.recordsFiltered = results.totalCount
        resp.withData(results.list)
        resp.recordsTotal = total
        resp
    }

    protected def getValue(String data) {
        if( data ==~ /\d+/) {
            return Long.parseLong(data)
        }
        else if( data ==~ /\d+[.]\d+/) return new BigDecimal(data)
        return data
    }
}
