package com.hida.ui

import com.hida.ui.DynamicTabItem

class ViewHelperController {

    def renderDynamicTab() {
        List<DynamicTabItem> tabs = DynamicTabItem.fromParams(params)
        render(model : [tabs : tabs], view : "_dynamicTabs")
    }
}
