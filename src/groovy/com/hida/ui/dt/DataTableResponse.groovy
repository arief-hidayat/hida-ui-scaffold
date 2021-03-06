package com.hida.ui.dt

import grails.util.Holders

/**
 * new DataTableResponse(draw: 1, recordsTotal : 10, recordsFiltered : 10).withData( assets)
 */
class DataTableResponse {
    //https://datatables.net/examples/server_side/object_data.html
    //https://datatables.net/manual/server-side
    int draw, recordsTotal, recordsFiltered
    def data = []

    static def rowClassConf = Holders.config.hida?.datatable?.rowclass ?: [:]
    static def domainKeyConf = Holders.config.hida?.datatable?.domainkey ?: [:]
    static def domainFieldsConf = Holders.config.hida?.datatable?.domainfields ?: [:]
    // can be array of fieldName or callback function.
    static final String ROW_ID = "DT_RowId", ROW_CLASS = "DT_RowClass", ROW_DATA = "DT_RowData"

    static def domainKeyMap = [:]
    static String compositeKeyDelimiter = Holders.config.hida?.datatable?.compositekeydelimiter ?: "_"

    DataTableResponse withData(def list) {
        list.each { data << DataTableResponse.Item.build(it) }
        this
    }

    static class Item {
        def map

        private Item(def domainData) { // as map
            map = populateFieldData(domainData);
        }

        static def build(def domainData) {
            new Item(domainData).populateKey(domainData).populateRowClass(domainData).map
        }

        private def populateFieldData(def it) {
            def map = [:]
            String domainNm = it.class.simpleName
            if (!domainFieldsConf.containsKey(domainNm)) throw new RuntimeException("missing configuration for ${domainNm}")
            def conf = domainFieldsConf[domainNm]
            if (conf instanceof Collection) {
                conf.each { fieldKey -> map[fieldKey] = it[fieldKey] }
            } else {
                map = conf(it) //expect a callback function.
            }
            return map;
        }

        /**
         * if not configured (e.g hida.datatable.domainkey.Asset). then it's a domain with id as single PK.
         * @param map
         * @param it
         */
        private Item populateKey(def it) {
//            if (domainKeyConf.containsKey(it.class.simpleName)) {
//                def conf = domainKeyConf[it.class.simpleName] ?: []
//                conf.each { fieldKey -> map[fieldKey] = it[fieldKey] }
//            } else {
//                if (!domainKeyMap.containsValue(it.class.simpleName))
//                    domainKeyMap.put(it.class.simpleName, DomainClassUtil.getPrimaryKey(it.class))
//
//                def compositeKey = domainKeyMap.get(it.class.simpleName)
//                def val = [], data = [:]
//                for (String key : compositeKey) {
//                    val << it[key]; data[key] = it[key]
//                }
//                map[ROW_ID] = val.join(compositeKeyDelimiter)
//                map[ROW_DATA] = data
//            }
            String domainKey = it.class.simpleName
            if (!domainKeyMap.containsKey(domainKey))
                domainKeyMap.put(domainKey, domainKeyConf[domainKey] ?: DomainClassUtil.getPrimaryKey(it.class) )
            def compositeKey = domainKeyMap.get(domainKey)
            def val = [], data = [:]
            for (String key : compositeKey) {
                val << it[key]; data[key] = it[key]
            }
            map[ROW_ID] = val.join(compositeKeyDelimiter)
            map[ROW_DATA] = data
            return this
        }

        private Item populateRowClass(def it) {
            if (rowClassConf.containsKey(it.class.simpleName)) {
                def conf = rowClassConf[it.class.simpleName]
                String value = (conf instanceof String) ? conf : conf(it)
                if (value) map[ROW_CLASS] = value
            }
            return this
        }
    }


}
