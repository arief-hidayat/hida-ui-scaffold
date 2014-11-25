package com.hida.imms

import com.hida.imms.ui.DynamicTabItem

class ViewHelperController {

    def renderDynamicTab() {
        List<DynamicTabItem> tabs = DynamicTabItem.fromParams(params)
        render(model : [tabs : tabs], view : "_dynamicTabs")
    }
}
