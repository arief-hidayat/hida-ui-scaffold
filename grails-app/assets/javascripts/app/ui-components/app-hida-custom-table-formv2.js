//= require /app/util/app-hida-server
//= require /app/ui-components/app-hida-datatables
//= require_self

(function($, Backbone, _, moment, App){

    // UI:
    // button: data-ajax="DELETE" data-confirm="Are you sure you want to delete selected item?" data-url="" ...
    // form wrapper: class="row detail-form-container" data-readonly="true"
    App.view.SearchTableFormPage = App.View.extend({
        el : '#content-section',
        tableEl : '#list-section', searchEl : "#search-section", detailEl : '#detail-section', messageEl : "#message-section",
        tablePubSub : null, searchPubSub: null, detailPubSub : null,
        tableView : null, searchView : null, detailView : null, $message : null,
        tableConfig : null, searchConfig : null, formConfig : null,
        events : { },
        selectedId : null,
        showDetailUrl : null, createDetailUrl : null,
        initialize: function(opt) {
            this.tableEl = opt.tableEl || this.tableEl; this.detailEl = opt.detailEl || this.detailEl; this.searchEl = opt.searchEl || this.searchEl;
            this.tablePubSub = _.extend({},Backbone.Events); this.searchPubSub = _.extend({},Backbone.Events); this.detailPubSub = _.extend({},Backbone.Events);
            this.tableConfig = opt.tableConfig; this.searchConfig = opt.searchConfig; this.formConfig = opt.formConfig;
            this.alwaysPassFilterData = opt.alwaysPassFilterData || this.alwaysPassFilterData;

            this.$message = this.$(this.messageEl);
            App.AJAX.errorHtmlCall = App.AJAX.errorHtmlCall || App.AJAX.defaultErrorCallback(this.$message);
            App.AJAX.errorJsonCall = App.AJAX.errorJsonCall || App.AJAX.defaultErrorCallback(this.$message);

            var urlController = this.key.charAt(0).toLowerCase() + this.key.substr(1);
            this.showDetailUrl = opt.showDetailUrl || App.url + "/" + urlController + "/showForm/";
            this.createDetailUrl = opt.createDetailUrl || App.url + "/" + urlController + "/createForm/";

            this.setupListeners();
            this.initView();
        },
        setupListeners: function() {
            this.subscribeSearchEvt("general.action.search", function() { this.removeTable().buildTable(); });
            this.subscribeSearchEvt("general.action.create", this.loadCreateDetailForm );
            this.subscribeDetailEvt("form:button:clicked", this.onDetailFormAction);
        },
        initView : function() {
            this.initSearchView({el: this.searchEl, key: this.key, pubSub: this.searchPubSub});
            this.publishSearchEvt("general.action.search"); // to build table.
        },
        onSearch : function() {
            this.tableConfig.data = this.getSearchFormData(); // use this as dataTable filter.
            this.removeTable().buildTable();
        },
        onDetailFormAction : function(data) { // url, form , $btn
            var $btn = data.$btn;
            if($btn.data("confirm") &&!confirm($btn.data("confirm"))) { this.enableDetailFormButtons(); return; }
            var ajaxType = $btn.data("ajax") || "GET"; // POST, PUT, DELETE, GET
            this.ajaxHTML(ajaxType, data.url, data.form, this.onDetailFormSuccessSubmission, this.onDetailFormFailSubmission);
        },
        onDetailFormSuccessSubmission : function(newView) { this.buildDetailForm(newView).reloadTable(); },
        onDetailFormFailSubmission : function(jqXHR) {
            switch (jqXHR.status) {
                // this is for those who need to reload the content, e.g. original form (probably updated with field error).
                case 412: // 412 used for save/update failed duePrecondition Failed
                    this.buildDetailForm(jqXHR.responseText);
                    break;
                default : // only update error message.
                    App.AJAX.errorHtmlCall(jqXHR);
                    this.detailView.enableButtons();
            }
        },
        loadShowDetailForm : function() {
            var opts = this.alwaysPassFilterData ? $.this.getSearchFormData() : {};
            this.getHTML(this.showDetailUrl, $.extend(opts, {id : this.selectedId}), this.buildDetailForm);
        },
        loadCreateDetailForm : function() {
            var opts = this.alwaysPassFilterData ? this.getSearchFormData() : {};
            this.getHTML(this.createDetailUrl, opts, this.buildDetailForm);
        },
        getSearchFormData : function() {
            var form = this.searchView.serializeForm();
            delete form.action;
            return form;
        },
        initSearchView : function(options) {
            this.searchView = new App.view.DetailForm(options);
        },
        buildTable : function() {
            if(this.tableView == undefined) this.initTable(); else this.reloadTable();
        },
        // Table-override start
        initTable : function() {
            this.tableView = new App.view.TableTabRegion( {el: this.tableEl, key: this.key, pubSub: this.tablePubSub,
                customConfig : this.tableConfig} );
            this.subscribeTableEvt("table:row:select",
                function(){ this.selectedId = this.tableView.getSelectedId(); this.loadShowDetailForm(); });
            this.subscribeTableEvt("table:row:deselect",
                function(){ this.selectedId = null; this.removeDetailForm(); });
        },
        reloadTable : function() { this.tableView.reloadTable(); this.publishTableEvt("table:reloaded"); },
        // Table-override end
        // detail form override -start
        buildDetailForm : function(newView) {
            this.removeDetailForm(); this.$(this.detailEl).html(newView);
            this.initDetailForm({el: this.detailEl, key: this.key, pubSub: this.detailPubSub});
            return this;
        },
        initDetailForm : function(options) { this.detailView = new App.view.DetailForm(options); },
        postHTML : function(url, option, callback) { return App.AJAX.postHTML(this, url, option, callback); },
        getHTML : function(url, option, callback) { return App.AJAX.getHTML(this, url, option, callback); },
        postJSON : function(url, option, callback) { return App.AJAX.postJSON(this, url, option, callback); },
        ajaxHTML : function(action, url, option, successCallBack, failCallback) {
            return App.AJAX.ajax(this, action, "html",  url, option, successCallBack, failCallback);
        },
        enableDetailFormButtons : function() {
            $(this.detailEl).find(".buttons .btn").each(function(){ $(this).removeAttr('disabled');});
        },
        remove: function() {
            this.removeDetailForm().removeTable().removeSearchForm();
            return App.View.prototype.remove.apply(this, arguments);
        },
        removeDetailForm : function() {
            if(this.detailView != null) { this.detailView.remove(); this.detailView = undefined; }
            return this;
        },
        removeSearchForm : function() {
            if(this.searchView != null) { this.searchView.remove(); this.searchView = undefined; }
            return this;
        },
        removeTable: function() {
            if(this.tableView != null) { this.tableView.remove(); this.tableView = undefined; }
            return this;
        },
        publishTableEvt : function(code, data) { this.tablePubSub.trigger(code, _.extend({key : this.key}, data)); },
        subscribeTableEvt : function(code, callback) { this.listenTo(this.tablePubSub, code, callback ,this); },
        publishSearchEvt : function(code, data) { this.searchPubSub.trigger(code, _.extend({key : this.key}, data)); },
        subscribeSearchEvt : function(code, callback) { this.listenTo(this.searchPubSub, code, callback ,this); },
        subscribeDetailEvt : function(code, callback) { this.listenTo(this.detailPubSub, code, callback ,this); }
    });

    App.view.SearchForm = App.view.CombinedForm.extend({
        publishFormEvent : function($btn, formData) {
            var actionUrl = $btn.data("url") || formData.action;
            if($btn.data("action") && actionUrl) {
                var data = { url : actionUrl, form : formData, $btn : $btn};
//                this.publishEvt("form:action:"+ $btn.data("action"),data);
                this.publishEvt("form:button:clicked", data); // this is for general listener.
            } else {
                App.logErr("Must set data-action and/or data-url in the button ");
            }
        }
    });

    App.view.DetailForm = App.view.CombinedForm.extend({
        initialize : function(opt) { this.readOnly = this.isReadOnlyForm(); this.setupUiComponents(); },
        isReadOnlyForm : function() { return this.$(".detail-form-container").data("readonly") === "true" },
        getFormId : function() {
            var $idField = this.$("form [name='id']"); if($idField) return {'id' : $idField.val()};
            return null;
        },
        enableButtons : function() { this.$(".buttons .btn").each(function(){ $(this).removeAttr('disabled');}); },
        publishFormEvent : function($btn, formData) {
            var actionUrl = $btn.data("url") || formData.action;
            if($btn.data("action") && actionUrl) {
                var data = { url : actionUrl, form : formData, $btn : $btn};
//                this.publishEvt("form:action:"+ $btn.data("action"),data);
                this.publishEvt("form:button:clicked", data); // this is for general listener.
            } else {
                App.logErr("Must set data-action and/or data-url in the button ");
            }
        }
    });
    // must be single row selection. --> once selected, we should open the detail.
    App.view.TableTabRegion = App.View.extend({ // new App.view.TableTabRegion( el: '#asset-list', key: 'Asset' )
        tableView : null,
        otherInitialization : function(opt) { },
        initialize: function(opt) { this.customConfig = opt.customConfig; this.otherInitialization(opt); this.initView(opt); },
        initView : function(opt) { this.initTable(); },
        reloadTable: function() { this.initTable(this.tableView.getSelectedRows()); },
        initTable : function(selectedRows) {
            this.removeTable();
            this.tableView = new App.view.Table({el: this.$(".table"), key: this.key, pubSub : this.pubSub,
                selectedRows : selectedRows, customConfig : this.customConfig, selectionMode : "single"});
        },
        getSelectedId: function(){ return this.tableView.getSelectedRows()[0]; },
        removeTable : function() { if(this.tableView != null) { this.tableView.remove(); this.tableView = undefined; } },
        remove: function() { this.removeTable(); return App.View.prototype.remove.apply(this, arguments); }
    });
})(jQuery, Backbone, _, moment, App);

