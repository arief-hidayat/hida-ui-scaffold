package com.hida.ui

/**
 * Created by arief.hidayat on 25/11/2014.
 */
class DynamicTabItem {
    String tabId, cssIcon, tabNameCd, tabNameDefault
//    , contentTemplate

//    tabId  list-section
//    cssIcon glyphicon glyphicon-th-list
//    tabNameCd default.list.label

    static List<DynamicTabItem> fromParams(def params) {
        int i = 0;
        List<DynamicTabItem> items = []
        while (true) {
            if (!params["tabs[${i}][tabId]"]) break
            DynamicTabItem item = new DynamicTabItem(
                    tabId: params["tabs[${i}][tabId]"],
                    cssIcon: params["tabs[${i}][cssIcon]"],
                    tabNameCd: params["tabs[${i}][tabNameCd]"],
                    tabNameDefault: params["tabs[${i}][tabNameDefault]"]
            )
            items.add item
            i++
        }
        items
    }
}
