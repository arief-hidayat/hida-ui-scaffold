package com.hida.ui.dt

/**
 * Created by hida on 25/5/2014.
 */
class DataTableRequest {
//    https://datatables.net/manual/server-side

    static final String FILTER_PREFIX = "dt_"
    int draw, start, length
    DtReqSearch search
    List<DtReqOrder> orders
    List<DtReqColumn> columns

    public DataTableRequest(def params) {
        this.draw = Integer.parseInt("${params.draw}");
        this.start = Integer.parseInt("${params.start}");
        this.length = Integer.parseInt("${params.length}");
        this.search = new DtReqSearch(value: params["search[value]"], regex: Boolean.parseBoolean(params["search[regex]"]))
        this.orders = new ArrayList<>()
        int orderCount = 0;
        while (true) {
            if (!params["order[$orderCount][column]"]) break
            this.orders.add(new DtReqOrder(column: Integer.parseInt(params["order[$orderCount][column]"]), dir: params["order[$orderCount][dir]"]))
            orderCount++
        }
        this.columns = new ArrayList<>()
        int colCount = 0;
        while (true) {
            if (!params["columns[$colCount][data]"]) break
            this.columns.add(new DtReqColumn(
                    data: params["columns[$colCount][data]"],
                    name: params["columns[$colCount][name]"],
                    searchable: Boolean.parseBoolean(params["columns[$colCount][searchable]"]),
                    orderable: Boolean.parseBoolean(params["columns[$colCount][orderable]"]),
                    search: new DtReqSearch(value: params["columns[$colCount][search][value]"], regex: Boolean.parseBoolean(params["columns[$colCount][search][regex]"]))
            ))
            colCount++
        }
    }

    static Map getFilterData(def params) {
        if(params.filter && params.filter instanceof Map) return params.filter
        Map filter= [:]
        params.each { String key, val ->
            if(key.startsWith(DataTableRequest.FILTER_PREFIX)) {
                filter.put(key.substring(DataTableRequest.FILTER_PREFIX.length()), val)
            }
        }
        filter
    }

}
