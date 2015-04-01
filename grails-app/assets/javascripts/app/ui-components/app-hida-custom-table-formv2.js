//= require /app/ui-components/app-hida-datatables
//= require_self

(function($, Backbone, _, moment, App){
    App.AJAX = App.AJAX || {
        defaultErrorCallback : function($messageContainer){
            return function(jqXHR) {
                var message = jqXHR.responseText;
                if(jqXHR.responseJSON && jqXHR.responseJSON.message) message = jqXHR.responseJSON.message;
                $messageContainer.html('<p class="bg-danger" style="padding: 10px">'+message+'</p>');
            }
        },
        ajax : function(context, type, dataType, url, option, successCallback, errorCallback) {
            return $.ajax({ type: type, url: url, data: option || {},dataType: dataType, context : context ,
                success: successCallback || function(){}, error : errorCallback  || function(){ }
            });
        },
        postJSON : function(context, url, option, successCallback, errorCallback) {
            return App.AJAX.ajax(context, "POST", "json", url, option, successCallback, errorCallback || App.AJAX.errorJsonCall);
        },
        getJSON : function(context, url, option, successCallback, errorCallback) {
            return App.AJAX.ajax(context, "GET", "json", url, option, successCallback, errorCallback || App.AJAX.errorJsonCall);
        },
        postHTML : function(context, url, option, successCallback, errorCallback) {
            return App.AJAX.ajax(context, "POST", "html", url, option, successCallback, errorCallback || App.AJAX.errorHtmlCall);
        },
        getHTML : function(context, url, option, successCallback, errorCallback) {
            return App.AJAX.ajax(context, "GET", "html", url, option, successCallback, errorCallback || App.AJAX.errorHtmlCall);
        }
    };

    App.view.SearchTableFormPage = App.View.extend({
        el : '#content-section',
        tableEl : '#list-section', searchEl : "#search-section", detailEl : '#detail-section', messageEl : "#message-section",
        tablePubSub : null, searchPubSub: null, detailPubSub : null,
        tableView : null, searchView : null, detailView : null, $message : null,
        tableConfig : null, searchConfig : null, formConfig : null,
        actionConfig : null,
        events : { },
        initialize: function(opt) {
            this.tableEl = opt.tableEl || this.tableEl; this.detailEl = opt.detailEl || this.detailEl; this.searchEl = opt.searchEl || this.searchEl;
            this.tablePubSub = _.extend({},Backbone.Events); this.searchPubSub = _.extend({},Backbone.Events); this.detailPubSub = _.extend({},Backbone.Events);
            this.tableConfig = opt.tableConfig; this.searchConfig = opt.searchConfig; this.formConfig = opt.formConfig;

            var urlController = this.key.charAt(0).toLowerCase() + this.key.substr(1);
            this.actionConfig = opt.actionConfig || {
                show : { url : (App.url + "/" + urlController + "/showForm/"), formInit : "setReadOnlyForm" , params : ["id"]},
                create : { url : (App.url + "/" + urlController + "/createForm/"), formInit : "setEditableForm", params : [] },
                edit : { url : (App.url + "/" + urlController + "/editForm/"), formInit : "setEditableForm" , params : ["id"]}
            };
            this.$message = this.$(this.messageEl);
            //TODO: build search form.

            this.buildTable();
            this.initTableActionListeners(opt);
            this.initFormActionListeners(opt);

            App.AJAX.errorHtmlCall = App.AJAX.errorHtmlCall || App.AJAX.defaultErrorCallback(this.$message);
            App.AJAX.errorJsonCall = App.AJAX.errorJsonCall || App.AJAX.defaultErrorCallback(this.$message);
        },
        initTableActionListeners : function(opt) {
            var urlController = this.key.charAt(0).toLowerCase() + this.key.substr(1);
            this.urlCreateForm = opt.urlCreateForm || (App.url + "/" + urlController + "/createForm/");
            this.urlShowForm = opt.urlShowForm || (App.url + "/" + urlController + "/showForm/");
            this.urlLoadTable = opt.urlLoadTable || (App.url + "/" + urlController + "/loadTable/");

            this.moreActions = opt.moreActions || this.moreActions || { }; // other than show, create, delete
            this.subscribeEvt("general:action:create", this.loadForm(this.urlCreateForm));
            for(var customAction in this.moreActions) {
                if(this.moreActions.hasOwnProperty(customAction)) {
                    this.subscribeEvt("general:action:" + customAction, this.moreActions[customAction]);
                }
            }
        },
        initFormActionListeners : function(opt) {
            this.otherFormActions = opt.otherFormActions || this.otherFormActions || { }; // other than show, create, delete
            this.subscribeDetailEvt("form:action:save", this.onSaveForm);
            this.subscribeDetailEvt("form:action:edit", this.onEditForm);
            this.subscribeDetailEvt("form:action:delete", this.onDeleteForm);
            this.subscribeDetailEvt("form:action:update", this.onUpdateForm);
            for(var customAction in this.otherFormActions) {
                if(this.otherFormActions.hasOwnProperty(customAction)) {
                    this.subscribeDetailEvt("form:action:" + customAction, this.otherFormActions[customAction]);
                }
            }
        },
        loadForm : function(url, action, buildFormParam) { // buildFormParam : action & id
            return function(eventData) {
                if(!action) {
                    if(url == this.urlCreateForm) action = "create";
                    else if(url == this.urlShowForm) action = "show";
                    else if(url == this.urlEditForm) action = "edit";
                }
                var buildFormParam = { action : action};
                var idAsParam = this.getIdAsParam(eventData);
                if(url != this.urlCreateForm) {
                    if(idAsParam == undefined || idAsParam.id == undefined) {
                        App.logDebug("warning: no id found.");
                        return;
                    } else {
                        buildFormParam.id = idAsParam.id;
                    }
                }
                var callback = (
                    function(buildFormParam) {
                        return function( data ) {
                            this.removeDetailForm();
                            this.$(this.detailEl).html(data); // note that 'append' only work for two tabs.
                            this.buildDetailForm(buildFormParam);
                            this.showForm();
                        }
                    }
                )(buildFormParam);
                this.getHtml(url, idAsParam, callback);
            }
        },
        getIdAsParam:  function(eventData, idx) {
            var opt = {};
            if(eventData && eventData.selectedRows.length > 0) {
                opt.id = eventData.selectedRows[idx || 0];
            } else {
                return this.getFormId();
            }
            return opt;
        },
        buildTable : function(publishReload) {
            if(this.tableView == undefined) this.initTable(); else this.reloadTable();
            if(publishReload) this.publishTableEvt("table:reloaded", {});
        },
        // Table-override start
        initTable : function() {
            this.tableView = new App.view.TableTabRegion( {el: this.tableEl, key: this.key, pubSub: this.tablePubSub, customUrl : this.tableConfig} );
        },
        reloadTable : function() { this.tableView.reloadTable(); },
        // Table-override end
        buildDetailForm : function(initialForm) {
            if(this.detailView == undefined) {
                var options = {el: this.detailEl, key: this.key, pubSub: this.detailPubSub};
                if(initialForm) {
                    if(initialForm.id) options.formId = initialForm.id;
                    if(initialForm.action != "create") {
                        if(!options.formId) { return; }
                        this.setReadOnlyForm(options);
                        return;
                    }
                }
                this.setEditableForm(options);
            }
        },
        // detail form override -start
        setReadOnlyForm : function(options) {
            this.detailView = new App.view.CombinedForm(options);
        },
        setEditableForm : function(options) {
            this.detailView = new App.view.CombinedForm(options);
        },
        // detail form override -start
        getFormId : function() {
            var $formContainer = $(this.detailEl);
            if($formContainer) {
                var $idField = $formContainer.find("[name='id']");
                if($idField) return {'id' : $idField.val()};
            }
            return null;
        },
        showForm : function() {

        },
        showTable : function() {

        },
        onDeleteForm : function(dt){
            if(!confirm('Are you sure you want to delete selected item?')) {
                this.enableDetailFormButtons();
                return;
            }
            var url = dt.url, form = dt.form;
            this.ajaxRequestForPartialView("POST", url, form , { action : "create"},{ id : form.id, action : "show"}, true);
            // backend is expected to delete item and return _partialCreate
        },
        onEditForm : function(dt){
            var url = dt.url, form = dt.form;
            this.ajaxRequestForPartialView("GET", url, form , { id : form.id, action : "edit"}, { id : form.id, action : "show"});
        },
        onSaveForm : function(dt) {
            var url = dt.url, form = dt.form;
            this.ajaxRequestForPartialView("POST", url, form , { action : "show"}, {  action : "create"}, true);
        },
        onUpdateForm : function(dt) {
            var url = dt.url, form = dt.form;
            this.ajaxRequestForPartialView("POST", url, form , { id : form.id, action : "show"}, { id : form.id, action : "update"}, true);
        },
        onPartialViewRequest : function() {

        },
        getHtml : function(url, option, callback) {
            return App.AJAX.getHTML(this, url, option, callback);
        },
        postJSON : function(url, option, callback) {
            return App.AJAX.postJSON(this, url, option, callback);
        },
        ajaxHtml : function(action, url, option, successCallBack, failCallback) {
            return App.AJAX.ajax(this, action, "html",  url, option, successCallBack, failCallback);
        },
        enableDetailFormButtons : function() {
            $(this.detailEl).find(".buttons .btn").each(function(){ $(this).removeAttr('disabled');});
        },
        ajaxRequestForPartialView : function(action, url, form, expectedForm, initialForm, publishReloadEvt) {
            var successCallback = (function(expectedForm, publishReloadEvt) {
                return function( data ) {
                    this.removeDetailForm();
                    $(this.detailEl).html(data); // note that 'append' only work for two tabs.
                    if(expectedForm.action == "show" && !expectedForm.id) {
                        expectedForm.id = $(this.detailEl).find("[name='id']").val();
                    }
                    this.buildDetailForm(expectedForm); // pass id, action
                    this.buildTable(publishReloadEvt);
                }
            })(expectedForm, publishReloadEvt);
//            form._partial = true; //TODO: remove _partial logic in controller
            this.ajaxHtml(action, url, form, successCallback);
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
//        publishSearchEvt : function(code, data) { this.searchPubSub.trigger(code, _.extend({key : this.key}, data)); },
        subscribeSearchEvt : function(code, callback) { this.listenTo(this.searchPubSub, code, callback ,this); },
//        publishDetailEvt : function(code, data) { this.detailPubSub.trigger(code, _.extend({key : this.key}, data)); },
        subscribeDetailEvt : function(code, callback) { this.listenTo(this.detailPubSub, code, callback ,this); }
    });


    // btn data-callback
    App.view.TableTabRegion = App.View.extend({ // new App.view.TableTabRegion( el: '#asset-list', key: 'Asset' )
        tableView : null,
        otherInitialization : function(opt) { },
        initialize: function(opt) {
            this.customConfig = opt.customConfig;
            this.otherInitialization(opt);
            this.initView(opt);
        },
        initView : function(opt) { this.initTable(); },
        reloadTable: function() { this.initTable(this.tableView.getSelectedRows()); },
        initTable : function(selectedRows) {
            this.removeTable();
            this.tableView = new App.view.Table({el: this.$(".table"), key: this.key, pubSub : this.pubSub,
                selectedRows : selectedRows, customUrl : this.customConfig});
        },
        removeTable : function() {
            if(this.tableView != null) { this.tableView.remove(); this.tableView = undefined; }
        },
        remove: function() {
            this.removeTable();
            return App.View.prototype.remove.apply(this, arguments);
        }
    });
})(jQuery, Backbone, _, moment, App);

