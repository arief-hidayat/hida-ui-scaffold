//= require /app/ui-components/app-hida-datatables
//= require_self

(function($, Backbone, _, moment, App){
    App.view.TableOnlyPage = App.view.TableRegion.extend({ // AbstractTableFormSinglePage without form. default action is only delete.
        el: '#list-section',
        otherInitialization : function(opt) {
            var urlController = this.key.charAt(0).toLowerCase() + this.key.substr(1);
            this.urlDeleteJSON = opt.urlDeleteJSON || (App.url + "/" + urlController + "/deleteJSON/");
            this.urlDeleteConfirmationForm = opt.urlDeleteConfirmationForm; // optional
            this.subscribeEvt("table:action:delete", this.deleteItems);
            this.otherTableActions = opt.otherTableActions || this.otherTableActions || { }; // other than show, create, delete
            for(var customAction in this.otherTableActions) {
                if(this.otherTableActions.hasOwnProperty(customAction)) {
                    this.subscribeEvt("table:action:" + customAction, this.otherTableActions[customAction]);
                }
            }
        },
        deleteItems : function(data) { // {selectedRows : selectedRows}
            if(!confirm('Are you sure you want to delete selected item?')) return;
            var ajaxArray = [], i, len;
            for (i = 0, len = data.selectedRows.length; i < len; i += 1) {
                var idAsParam = this.getIdAsParam(data, i);
                if(idAsParam != undefined) {
                    ajaxArray.push( this.postJSON(this.urlDeleteJSON, idAsParam));
                }
            }
            if(ajaxArray.length > 0) {
                $.when.apply(this, ajaxArray).done(function(){
                    this.publishEvt("table:item:deleted", data.selectedRows);//TODO: onCreate... publish item:created
                    this.reloadTable();
                });
            }
        },
        postJSON : function(url, option, callback) {
            return $.ajax({
                type: "POST",
                url: url,
                data: option || {},
                success: callback || function(){},
                dataType: "json",
                context : this // make sure this BB view is the context
            });
        },
        getIdAsParam:  function(eventData, idx) {
            var opt = {};
            if(eventData && eventData.selectedRows.length > 0) {
                opt.id = eventData.selectedRows[idx || 0];
            }
            return opt;
        }
    });

    App.view.FormSinglePage = App.View.extend({
        el : '#content-section', formEl : '#detail-section', form : null,
        events : {
        },
        remove: function() {
            return App.View.prototype.remove.apply(this, arguments);
        },
        removeForm : function() {
            if(this.form != null) { this.form.remove(); this.form = undefined; }
            return this;
        },
        otherInitialization : function(opt) {
            this.initialForm = opt.initialForm || {};
        },
        initFormActionListeners : function(opt) {
            this.otherFormActions = opt.otherFormActions || this.otherFormActions || { }; // other than show, create, delete
            this.subscribeEvt("form:action:save", this.onSaveForm);
            this.subscribeEvt("form:action:edit", this.onEditForm);
            this.subscribeEvt("form:action:delete", this.onDeleteForm);
            this.subscribeEvt("form:action:update", this.onUpdateForm);
            for(var customAction in this.otherFormActions) {
                if(this.otherFormActions.hasOwnProperty(customAction)) {
                    this.subscribeEvt("form:action:" + customAction, this.otherFormActions[customAction]);
                }
            }
        },
        initialize: function(opt) {
            this.formEl = opt.formEl || this.formEl;
            this.otherInitialization(opt);
            this.setupInitView();
            this.initFormActionListeners(opt);
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
        getStringId : function(formId) {
            return formId.id;
        },
        buildForm : function(initialForm) {
            if(this.form == undefined) {
                var options = {el: this.formEl, key: this.key, pubSub: this.pubSub};
                if(initialForm) {
                    if(initialForm.id) options.formId = initialForm.id;
                    if(initialForm.action == "show") {
                        if(!options.formId) {
                            return; // show without id.
                        }
                        this.setReadOnlyForm(options);
                        return;
                    }
                }
                this.setEditableForm(options);
            }
        },
        setReadOnlyForm : function(options) {
            options.readOnly = true;
            this.form = new App.view.CombinedForm(options);
        },
        setEditableForm : function(options) {
            this.form = new App.view.CombinedForm(options);
        },
        resetForm : function() {
            this.getHtml(this.urlCreateForm, null, function( data ) {
                if(this.form != null) { this.form.remove(); this.form = undefined; }
                $(this.formEl).html(data); // note that 'append' only work for two tabs.
                this.buildForm();
            });
        },
        setupInitView : function() {
            this.buildForm(this.initialForm);
        },
        getFormId : function() {
            var $formContainer = $(this.formEl);
            if($formContainer) {
                var $idField = $formContainer.find("[name='id']");
                if($idField) {
//                    App.logDebug("form Id :" + $idField.val());
                    return {'id' : $idField.val()};
                }
            }
            return null;
        },
        showForm : function() {

        },
        onDeleteForm : function(dt){
            if(!confirm('Are you sure you want to delete selected item?')) {
                this.enableButtons();
                return;
            }
            var url = dt.url, form = dt.form;
            this.ajaxRequestForPartialView("POST", url, form ,
                { action : "create"},{ id : form.id, action : "show"}, true);
            // backend is expected to delete item and return _partialCreate
        },
        onEditForm : function(dt){
            var url = dt.url, form = dt.form;
            this.ajaxRequestForPartialView("GET", url, form ,
                { id : form.id, action : "edit"}, { id : form.id, action : "show"});
        },
        onSaveForm : function(dt) {
            var url = dt.url, form = dt.form;
            this.ajaxRequestForPartialView("POST", url, form ,
                { action : "show"}, {  action : "create"}, true);
        },
        onUpdateForm : function(dt) {
//            App.logDebug("onUpdateForm ..." );
            var url = dt.url, form = dt.form;
            this.ajaxRequestForPartialView("POST", url, form ,
                { id : form.id, action : "show"}, { id : form.id, action : "update"}, true);
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
        postJSON : function(url, option, callback) {
            return $.ajax({
                type: "POST",
                url: url,
                data: option || {},
                success: callback || function(){},
                dataType: "json",
                context : this // make sure this BB view is the context
            });
        },
        ajaxHtml : function(action, url, option, successCallBack, failCallback) {
            return $.ajax({
                type: action,
                url: url,
                data: option || {},
                context : this // make sure this BB view is the context
            }).done(successCallBack || function(){}).fail(failCallback || function(){});
        },
        enableButtons : function() {
            $(this.formEl).find(".buttons .btn").each(function(){ $(this).removeAttr('disabled');});
        },
        ajaxRequestForPartialView : function(action, url, form, expectedForm, initialForm, publishReloadEvt) {
            var successCallback = (function(expectedForm, publishReloadEvt) {
                return function( data ) {
                    if(this.form != null) { this.form.remove(); this.form = undefined; }
                    $(this.formEl).html(data); // note that 'append' only work for two tabs.
                    if(expectedForm.action == "show" && !expectedForm.id) {
                        expectedForm.id = $(this.formEl).find("[name='id']").val();
                    }
                    this.buildForm(expectedForm); // pass id, action
                }
            })(expectedForm, publishReloadEvt);
            var failCallback = (function(initialForm){
                return function(jqXHR) {
                    switch (jqXHR.status) {
                        case 404:
                        case 500:
                            this.$(".message-container").html(jqXHR.responseText); // untested
                            this.enableButtons();
                            break;
                        default : // 412 used for save/update failed duePrecondition Failed
                            if(this.form != null) { this.form.remove(); this.form = undefined; }
                            $(this.formEl).html(jqXHR.responseText); // note that 'append' only work for two tabs.
                            if(initialForm.action == "show" && !initialForm.id) {
                                initialForm.id = $(this.formEl).find("[name='id']").val();
                            }
                            this.buildForm(initialForm); // pass id, action
                    }
                }
            })(initialForm);
            form._partial = true;
            this.ajaxHtml(action, url, form, successCallback, failCallback);
        }
    });

    App.view.AbstractTableFormSinglePage = App.View.extend({
        el : '#content-section', tableEl : '#list-section', formEl : '#detail-section',
        table : null, form : null, tableCustomConfig : null,
        events : {
        },
        remove: function() {
            this.removeForm().removeTable();
            return App.View.prototype.remove.apply(this, arguments);
        },
        removeForm : function() {
            if(this.form != null) { this.form.remove(); this.form = undefined; }
            return this;
        },
        removeTable: function() {
            if(this.table != null) { this.table.remove(); this.table = undefined; }
            return this;
        },
        otherInitialization : function(opt) {
            this.initialForm = opt.initialForm || {};
            this.tableCustomConfig = opt.tableCustomConfig;
        },
        initTableActionListeners : function(opt) {
            var urlController = this.key.charAt(0).toLowerCase() + this.key.substr(1);
            this.urlCreateForm = opt.urlCreateForm || (App.url + "/" + urlController + "/createForm/");
            this.urlShowForm = opt.urlShowForm || (App.url + "/" + urlController + "/showForm/");
            this.urlEditForm = opt.urlEditForm || (App.url + "/" + urlController + "/editForm/");
            this.urlDeleteJSON = opt.urlDeleteJSON || (App.url + "/" + urlController + "/deleteJSON/");
            this.urlDeleteConfirmationForm = opt.urlDeleteConfirmationForm; // optional

            this.otherTableActions = opt.otherTableActions || this.otherTableActions || { }; // other than show, create, delete
            this.subscribeEvt("table:action:create", this.loadForm(this.urlCreateForm));
            this.subscribeEvt("table:action:show", this.loadForm(this.urlShowForm));
            this.subscribeEvt("table:action:delete", this.deleteItems);
            this.subscribeEvt("table:action:edit", this.loadForm(this.urlEditForm)); // is this used?
            for(var customAction in this.otherTableActions) {
                if(this.otherTableActions.hasOwnProperty(customAction)) {
                    //console.log (">>> custom action :" + customAction);
                    this.subscribeEvt("table:action:" + customAction, this.otherTableActions[customAction]);
                }
            }
        },
        initFormActionListeners : function(opt) {
            this.otherFormActions = opt.otherFormActions || this.otherFormActions || { }; // other than show, create, delete
            this.subscribeEvt("form:action:save", this.onSaveForm);
            this.subscribeEvt("form:action:edit", this.onEditForm);
            this.subscribeEvt("form:action:delete", this.onDeleteForm);
            this.subscribeEvt("form:action:update", this.onUpdateForm);
            for(var customAction in this.otherFormActions) {
                if(this.otherFormActions.hasOwnProperty(customAction)) {
                    this.subscribeEvt("form:action:" + customAction, this.otherFormActions[customAction]);
                }
            }
        },
        initialize: function(opt) {
            this.tableEl = opt.tableEl || this.tableEl;
            this.formEl = opt.formEl || this.formEl;
//            this.setEditableForm = opt.setEditableForm || opt.setForm || this.setEditableForm;
//            this.setReadOnlyForm = opt.setReadOnlyForm || opt.setForm || this.setReadOnlyForm;
            this.otherInitialization(opt);
            this.setupInitView();
            this.initTableActionListeners(opt);
            this.initFormActionListeners(opt);
        },
        loadForm : function(url, action) {
            return function(eventData) {
//                App.logDebug("enter loadForm from url" + url);
                if(!action) {
                    if(url == this.urlCreateForm) action = "create";
                    else if(url == this.urlShowForm) action = "show";
                    else if(url == this.urlEditForm) action = "edit";
                }
                var buildFormParam = { action : action};
                var idAsParam = this.getIdAsParam(eventData);
                if(url != this.urlCreateForm) {
                    if(idAsParam == undefined || idAsParam.id == undefined) {
                        //App.logDebug("warning: no id found.");
                        return;
                    } else {
                        buildFormParam.id = idAsParam.id;
                    }
                }
                var callback = (
                    function(buildFormParam) {
                        return function( data ) {
                            this.removeForm();
                            this.$(this.formEl).html(data); // note that 'append' only work for two tabs.
                            this.buildForm(buildFormParam);
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
        getStringId : function(formId) {
            return formId.id;
        },
        deleteItems : function(data) { // {selectedRows : selectedRows}
            if(!confirm('Are you sure you want to delete selected item?')) return;
            var ajaxArray = [], i, len, formId = this.getFormId(), resetForm = false;
//            App.logDebug("deleteItems... formId=" + formId);

            for (i = 0, len = data.selectedRows.length; i < len; i += 1) {
                if(formId) {
                    //App.logDebug("compare with data.selectedRows[i] = " + data.selectedRows[i]);
                    if(this.getStringId(formId) == data.selectedRows[i]) {
                        //App.logDebug("reset form...");
                        resetForm = true;
                    }
                }
                var idAsParam = this.getIdAsParam(data, i);
                if(idAsParam != undefined) {
                    ajaxArray.push( this.postJSON(this.urlDeleteJSON, idAsParam));
                }
            }
            if(ajaxArray.length > 0) {
                $.when.apply(this, ajaxArray).done(function(){
//                    App.logDebug("rebuild table ");
                    this.publishEvt("table:item:deleted", data.selectedRows);//TODO: onCreate... publish item:created
                    this.buildTable(true);
                });
            }
            if(resetForm) this.resetForm();
        },
        buildTable : function(publishReload) {
            if(this.table == undefined) {
                this.table = new App.view.TableRegion( {el: this.tableEl, key: this.key, pubSub: this.pubSub, customConfig : this.tableCustomConfig} );
            }
            else this.table.reloadTable();
            if(publishReload) {
                this.publishEvt("table:reloaded", {});
            }
        },
        buildForm : function(initialForm) {
            if(this.form == undefined) {
                var options = {el: this.formEl, key: this.key, pubSub: this.pubSub};
                if(initialForm) {
                    if(initialForm.id) options.formId = initialForm.id;
                    if(initialForm.action == "show") {
                        if(!options.formId) {
                            return; // show without id.
                        }
                        this.setReadOnlyForm(options);
//                        this.form = new App.view.ReadOnlyForm(options);
                        return;
                    }
                }
                this.setEditableForm(options);
//                this.form = new App.view.EditableForm(options );
            }
        },
        setReadOnlyForm : function(options) {
//            this.form = new App.view.ReadOnlyForm(options);
        },
        setEditableForm : function(options) {
//            this.form = new App.view.EditableForm(options);
        },
        resetForm : function() {
            this.getHtml(this.urlCreateForm, null, function( data ) {
                if(this.form != null) { this.form.remove(); this.form = undefined; }
                $(this.formEl).html(data); // note that 'append' only work for two tabs.
                this.buildForm();
            });
        },
        setupInitView : function() {
            this.buildTable();
            this.buildForm(this.initialForm);
        },
        getFormId : function() {
            var $formContainer = $(this.formEl);
            if($formContainer) {
                var $idField = $formContainer.find("[name='id']");
                if($idField) {
//                    App.logDebug("form Id :" + $idField.val());
                    return {'id' : $idField.val()};
                }
            }
            return null;
        },
        showForm : function() {

        },
        showTable : function() {

        },
        onDeleteForm : function(dt){
            if(!confirm('Are you sure you want to delete selected item?')) {
                this.enableButtons();
                return;
            }
            var url = dt.url, form = dt.form;
            this.ajaxRequestForPartialView("POST", url, form ,
                { action : "create"},{ id : form.id, action : "show"}, true);
            // backend is expected to delete item and return _partialCreate
        },
        onEditForm : function(dt){
            var url = dt.url, form = dt.form;
            this.ajaxRequestForPartialView("GET", url, form ,
                { id : form.id, action : "edit"}, { id : form.id, action : "show"});
        },
        onSaveForm : function(dt) {
            var url = dt.url, form = dt.form;
            this.ajaxRequestForPartialView("POST", url, form ,
                { action : "show"}, {  action : "create"}, true);
        },
        onUpdateForm : function(dt) {
//            App.logDebug("onUpdateForm ..." );
            var url = dt.url, form = dt.form;
            this.ajaxRequestForPartialView("POST", url, form ,
                { id : form.id, action : "show"}, { id : form.id, action : "update"}, true);
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
        postJSON : function(url, option, callback) {
            return $.ajax({
                type: "POST",
                url: url,
                data: option || {},
                success: callback || function(){},
                dataType: "json",
                context : this // make sure this BB view is the context
            });
        },
        ajaxHtml : function(action, url, option, successCallBack, failCallback) {
            return $.ajax({
                type: action,
                url: url,
                data: option || {},
                context : this // make sure this BB view is the context
            }).done(successCallBack || function(){}).fail(failCallback || function(){});
        },
        enableButtons : function() {
            $(this.formEl).find(".buttons .btn").each(function(){ $(this).removeAttr('disabled');});
        },
        ajaxRequestForPartialView : function(action, url, form, expectedForm, initialForm, publishReloadEvt) {
            var successCallback = (function(expectedForm, publishReloadEvt) {
                return function( data ) {
                    if(this.form != null) { this.form.remove(); this.form = undefined; }
                    $(this.formEl).html(data); // note that 'append' only work for two tabs.
                    if(expectedForm.action == "show" && !expectedForm.id) {
                        expectedForm.id = $(this.formEl).find("[name='id']").val();
                    }
                    this.buildForm(expectedForm); // pass id, action
                    this.buildTable(publishReloadEvt);
                }
            })(expectedForm, publishReloadEvt);
            var failCallback = (function(initialForm){
                return function(jqXHR) {
                    switch (jqXHR.status) {
                        case 404:
                        case 500:
                            this.$(".message-container").html(jqXHR.responseText); // untested
                            this.enableButtons();
                            break;
                        default : // 412 used for save/update failed duePrecondition Failed
                            if(this.form != null) { this.form.remove(); this.form = undefined; }
                            $(this.formEl).html(jqXHR.responseText); // note that 'append' only work for two tabs.
                            if(initialForm.action == "show" && !initialForm.id) {
                                initialForm.id = $(this.formEl).find("[name='id']").val();
                            }
                            this.buildForm(initialForm); // pass id, action
                    }
                }
            })(initialForm);
            form._partial = true;
            this.ajaxHtml(action, url, form, successCallback, failCallback);
        }
    });
    App.view.AbstractTableFormTabs = App.view.AbstractTableFormSinglePage.extend({
        events : {
            "click .nav-tabs li:eq(0) a" : "buildTable",
            "click .nav-tabs li:eq(1) a" : "buildForm"
        },
        setupInitView : function() {
            this.tableIdx = 0;
            this.formIdx = 1;
            var $tableLi = this.$(".nav-tabs li:eq(0)"),
                $formLi = this.$(".nav-tabs li:eq(1)");
            var $tableA = $tableLi.find("a"),
                $formA = $formLi.find("a");
            this.tableEl = this.$($tableA.attr("href")); this.formEl = this.$($formA.attr("href"));
            if(this.tableEl == undefined || this.formEl == undefined) App.logErr("Please check the tab UI");
            if($tableLi.hasClass("active")) {
                $tableA.tab("show");
                this.buildTable();
            } else {
                $formA.tab("show");
                this.buildForm(this.initialForm);
            }
        },
        showForm : function() {
            this.showTab(this.formIdx);
        },
        showTable : function() {
            this.showTab(this.tableIdx);
        },
        showTab : function(idx) {
            this.$(".nav-tabs li:eq("+ idx +") a").tab("show");
        }
    });
})(jQuery, Backbone, _, moment, App);

