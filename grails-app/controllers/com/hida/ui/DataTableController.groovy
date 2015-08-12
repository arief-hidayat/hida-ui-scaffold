package com.hida.ui

import com.hida.ui.dt.DataTableRequest
import grails.converters.JSON

class DataTableController {
    static scope = "singleton"

    def dataTableService
    def list(String domainName) {
        DataTableRequest req = new DataTableRequest(params)
        Map filterData = DataTableRequest.getFilterData(params)
        render dataTableService.list(domainName, req, filterData) as JSON
    }


    def display(String key) {
        render( template: "display", model: [ key : key])
    }
}
