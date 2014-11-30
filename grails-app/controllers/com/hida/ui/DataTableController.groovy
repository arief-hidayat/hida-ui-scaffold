package com.hida.ui

import com.hida.ui.dt.DataTableRequest
import grails.converters.JSON

class DataTableController {
    static scope = "singleton"

    def dataTableService

    def list(String domainName) {
        DataTableRequest req = new DataTableRequest(params)
        Map filterData = getFilterData(params)
        println "dataTable list $domainName filter data ${filterData}"
        render dataTableService.list(domainName, req, filterData) as JSON
    }

    private Map getFilterData(def params) {
        if(params.filter && params.filter instanceof Map) return params.filter
        Map filter= [:]
        params.each { String key, val ->
            if(key.startsWith("f_")) {
                filter.put(key.substring(2), val)
            }
        }
        filter
    }
}
