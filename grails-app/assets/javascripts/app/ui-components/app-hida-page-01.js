//= require /app/util/app-hida-server
//= require /app/ui-components/app-hida-custom-form
//= require /app/ui-components/app-hida-custom-table-form
//= require_self

(function($, Backbone, _, moment, App){
    App.view.TableFormSinglePage = App.view.AbstractTableFormSinglePage.extend({
        setReadOnlyForm : function(options) {
            options.readOnly = true;
            this.form = new App.view.CombinedForm(options);
        },
        setEditableForm : function(options) {
            this.form = new App.view.CombinedForm(options);
        }
    });

    App.view.TableFormTabs = App.view.AbstractTableFormTabs.extend({
        setReadOnlyForm : function(options) {
            options.readOnly = true;
            this.form = new App.view.CombinedForm(options);
        },
        setEditableForm : function(options) {
            this.form = new App.view.CombinedForm(options);
        }
    });

    // new App.view.DynamicTabs( { el :"#employee-page", key: "Employee", tabs : [], allTabsAreRelated : true });
    // { tabId : "current-employee", tabNameCd : "employee.current.label", tabNameDefault : "Current Employee",
    // contentTemplate : "/employee/_partialSinglePage",
    // url : { showForm : "/employee/showFormForCurrEmployee",  urlEditForm : "/employee/editFormForCurrEmployee"}" }
    // dataTable : { url : "/dataTable/Employee" , data : { 'f_status' : 'ACTIVE' }
    App.view.DynamicTabs = App.View.extend({
        tabsView : [], tabs: null, tabsPubSub : [], el : ".content", allTabsAreRelated : false,
        initialize : function(opt) {
            this.tabs = opt.tabs;
            this.allTabsAreRelated = opt.allTabsAreRelated || this.allTabsAreRelated;
            this.renderView();
            this.subscribeEvt("top:table:reloaded", function(data){
                // e.g. once table in a tab is reloaded, tables in other tabs are also reloaded
                if(this.allTabsAreRelated) {
                    var relatedTableReloadedCallback = (function(data){
                        return function(view, index) {
                            if(data.index != index) view.buildTable();
                        }
                    })(data);
                    _.each(this.tabsView, relatedTableReloadedCallback);
                }
            });
        },
        getHtml : function(url, option, callback) {
            return $.ajax({
                type: "GET",
                url: url,
                data: option || {},
                success: callback || function(){},
                context : this // make sure this BB view is the context
            });
        },
        onViewRendered : function() {
            var urlController = this.key.charAt(0).toLowerCase() + this.key.substr(1);
            _.each(this.tabs, function(tab, index) {
                var tabPubSub = _.extend({},Backbone.Events);
                this.tabsPubSub.push(tabPubSub);
                var tableFormOpt = { key : this.key,
                    el : "#" + tab.tabId + "content-section", //NOTE: make sure: the partialPage also with _prefix = tab.tabId
                    tableEl : "#" + tab.tabId + "list-section",
                    formEl : "#" + tab.tabId + "detail-section",
                    pubSub : tabPubSub
                };
                if(tab.url) {
                    if(tab.url.createForm) tableFormOpt.urlCreateForm = App.url + tab.url.createForm;
                    if(tab.url.showForm) tableFormOpt.urlShowForm = App.url + tab.url.showForm;
                    if(tab.url.editForm) tableFormOpt.urlEditForm = App.url + tab.url.editForm;
                    if(tab.url.deleteJSON) tableFormOpt.urlDeleteJSON = App.url + tab.url.deleteJSON;
                }
                if(tab.dataTable) tableFormOpt.tableCustomConfig = { url :  App.url + tab.dataTable.url, data : tab.dataTable.data} ;
                var tabView = new App.view.TableFormSinglePage(tableFormOpt);
                this.tabsView.push(tabView);
                var tableReloadedCallback = (function(tab, index, context){
                    return function() { context.publishEvt("top:table:reloaded", {tabId: tab.id, index : index}); }
                })(tab, index, this);
                tabView.subscribeEvt("table:reloaded", tableReloadedCallback);
                // later we can customize how should we handle this table reload event
            }, this);
        },
        renderView : function() {
            this.getHtml(App.url + "/viewHelper/renderDynamicTab", { tabs : this.tabs }, function(view){
                this.$el.html(view);
                this.renderEachTab();
            });
        },
        renderEachTab : function() {
            var ajaxArray = [], i, len;
            var urlController = this.key.charAt(0).toLowerCase() + this.key.substr(1);
            for (i = 0, len = this.tabs.length; i < len; i += 1) {
                var tab = this.tabs[i];
                var templateName = tab.contentTemplate || ("/" + urlController + "?_partial=true&_prefix=" + tab.tabId);
                // default call index with _partial. we expect default template to return _partialSinglePage

                var renderSingleTabCallback = (function(tab){
                    return function(view) { $("#"+ tab.tabId).html(view); }
                })(tab);
                ajaxArray.push(this.getHtml(App.url + templateName, {}, renderSingleTabCallback));
            }
            if(ajaxArray.length > 0) {
                var callbackAfterRenderView = (function(thisView) {
                   return function() {
                       thisView.onViewRendered();
//                       thisView.$(".nav-tabs li:eq(0)").tab("show"); // not work
                       thisView.$(".nav-tabs li a:eq(0)").tab("show"); // show first tab
//                       thisView.$(".nav-tabs li a:last").tab("show"); // show first tab
                   }
                })(this);
                $.when.apply(this, ajaxArray).done(callbackAfterRenderView);
            }
        },
        remove : function() {
            _.each(this.tabsView, function(view) { view.remove(); });
            return App.View.prototype.remove.apply(this, arguments);
        }
    });
})(jQuery, Backbone, _, moment, App);

