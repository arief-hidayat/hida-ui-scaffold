//= require /app/ui-components/app-hida-datatables
//= require /app/ui-components/app-hida-typeahead
//= require /app/ui-components/app-hida-datepicker
//= require /lib/select2.min
//= require_self

(function($, Backbone, _, App){

    App.view.CombinedForm = App.View.extend({
        manyToManyFields : [], readOnly : false,
        select2Els : [],
        datePickers : [],
        typeAheadFields : [],
        events : { //TODO
            "submit form" : "ignoreSubmit",
            "click .buttons .btn" : "submitForm"
        },
        remove: function() {
            _.each(this.datePickers, function(view) {
                view.remove()
            });
            _.each(this.typeAheadFields, function(view) { view.remove()});
            _.each(this.select2Els, function(elem){
                var $select2 = this.$(elem);
                if($select2) $select2.select2("destroy");
            }, this);
            return App.View.prototype.remove.apply(this, arguments);
        },
        ignoreSubmit : function() {
            var $btn = this.$(".buttons .btn:focus");
            if($btn && $btn.data("nojs")) {
                return true;
            }
            App.logDebug("ignoreSubmit");
            return false;
        },
        submitForm : function(evt) {
            var $btn = $(evt.currentTarget);
//            $btn.attr('disabled','disabled');
            if($btn.data("nojs")) {
                var $form = $btn.closest("form");
                if($btn.data("url")) {
                    $form.attr("action", $btn.data("url"));
                }
                $form.submit(function(){
                    $form.submit(function(){ return false; });
                });
//                $btn.removeAttr('disabled');
                return false;
            }
            var form = this.serializeForm();
            var actionUrl = $btn.data("url") || form.action;
            App.logDebug("actionUrl " + actionUrl +", action " + $btn.data("action"));
            if($btn.data("action") && actionUrl) { // not yet tested, must alter the UI
                // e.g. <button data-action="showDialogBeforeSubmit" ... then define the customActions in App.view.TableFormTabs
                this.publishEvt("form:action:"+ $btn.data("action"),
                    { url : actionUrl, form : form});
            } else {
                App.logErr("Must set data-action and/or data-url in the button ");
            }
//            $btn.removeAttr('disabled');
            return false;
        },
        serializeForm : function(form) {
            var $form = form ? $(form) : this.$("form:first");
            var formData = $form.hasClass("submit-nonempty-fields") ?
                this.getFormDataWithFilter($form, function(k) { return $.trim(k.value) != ""; }) : this.getFormDataWithFilter($form);

            if(!formData.action) {
                formData.action = $form.attr('action');
            }
            return formData;
        },
        getFormDataWithFilter : function($form, filterCallback) {
            var formData = {};
            var serializedDataFunc = function (nvp) {
                if(formData[nvp.name]) {
                    if(!$.isArray(formData[nvp.name])) {
                        var firstItem = formData[nvp.name];
                        formData[nvp.name] = [];
                        formData[nvp.name].push(firstItem);
                    }
                    formData[nvp.name].push(nvp.value);
                } else {
                    if(nvp.value != "") formData[nvp.name] = nvp.value;
                    else  formData[nvp.name] = null;
                }
            };
            if(filterCallback) {
                _($form.serializeArray().filter(filterCallback)).each(serializedDataFunc);
            } else {
                _($form.serializeArray()).each(serializedDataFunc);
            }
            return formData;
        },
        initialize: function(opt) {
            this.formId = opt.formId; // seems like not used
            this.readOnly = opt.readOnly || this.readOnly;
            this.setupUiComponents();
        },
        setupUiComponents : function(parentEl) {
            this.setupDatePickerFields(parentEl);
            this.setupTypeAheadFields(parentEl);
            this.setupSelect2(this.readOnly, parentEl);
            App.logDebug("done setup select2");
            if(App.view.form && App.view.form.moreUiSetup) {
                App.logDebug("setting up App.view.form.moreUiSetup");
                App.view.form.moreUiSetup.apply(this, [parentEl]);
            }
        },
        setupDatePickerFields : function(parentEl) {
            var $datePickers = parentEl == undefined ? this.$(".date") : this.$(parentEl + " .date");
            _.each($datePickers, function(elem){
                var dpEl = this.$el.selector + " #" + elem.id;
                if($(dpEl).data('readonly') != "true") { // add this checking. TODO: verify
                    this.datePickers.push(new App.view.DatePicker({ el : dpEl, pubSub : this.pubSub}));
                }
            }, this);
        },
        setupTypeAheadFields : function(parentEl) {
            var $typeAhead = parentEl == undefined ? this.$(".type-ahead") : this.$(parentEl + " .type-ahead");
            _.each($typeAhead, function(elem){
                var dpEl = this.$el.selector + " #" + elem.id;
//                App.logDebug("setup type ahead dpEl:"+ dpEl);
                if($(dpEl).data('readonly') != "true") {
                    var typeAheadView = new App.view.TypeAhead({ el : dpEl, pubSub : this.pubSub});
                    this.typeAheadFields.push(typeAheadView);
                }
            }, this);

            var $taDependentFields = parentEl == undefined ? this.$(".display-from-typeahead") : this.$(parentEl + " .display-from-typeahead");
            _.each($taDependentFields, function(elem){
                var $theField = $(elem);
                var theTypeAheadNm = $theField.data('ta-dependency');
                if(theTypeAheadNm) {
                    var sp = theTypeAheadNm.split(":", 2);
                    this.subscribeEvt('ta:search:' + sp[0], function(item){
                        $theField.val(item[sp[1]]);
                    });
                }
            }, this);
        },
        setupSelect2 : function(readOnly, parentEl) {
            var $select2Simples = parentEl == undefined ? this.$(".select2-simple") : this.$(parentEl + " .select2-simple");
            _.each($select2Simples, function(elem){
                var mmEl = this.$el.selector + " #" + elem.id;
                var $mmEl = $(mmEl);
                var isReadOnly = readOnly || ($mmEl.attr("readonly"));
                var $select2 = $mmEl.select2();
                if(isReadOnly) {
                    $select2.select2("readonly", true);
                }
                this.select2Els.push(mmEl);
            }, this);
            var $select2Remotes = parentEl == undefined ? this.$(".select2-remote") : this.$(parentEl + " .select2-remote");
            _.each($select2Remotes, function(elem){
                var mmEl = this.$el.selector + " #" + elem.id;
                var $mmEl = $(mmEl);
                var isReadOnly = readOnly || ($mmEl.attr("readonly")) || $mmEl.data("readonly");
                var domainId = $mmEl.data("id"), domainName = $mmEl.data("from"), initUrl = $mmEl.data("initurl"), dataType = $mmEl.data("datatype") || "json";
                var formatResult = App.template.select2.formatResult[$mmEl.data("resulttmpl") || domainName] || function(state) { return state.text; };
                var formatSelection = App.template.select2.formatSelection[$mmEl.data("selectiontmpl")] || formatResult;
                var multiple = $mmEl.data("multiple") == "yes";
                var select2Opts = {
                    placeholder : $mmEl.data("placeholder") || "search item",
                    minimumInputLength: 1,
                    ajax : {
                        url : App.url + "/typeAhead/" + domainName,
                        dataType : dataType,
                        data : function(term, page) { return { query: term } },
                        results : function(data, page) {
                            return { results : data };
                        }
                    },
                    multiple : multiple,
                    formatResult: formatResult, // omitted for brevity, see the source of this page
                    formatSelection: formatSelection,  // omitted for brevity, see the source of this page
                    dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
                    escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
                };
                if(!multiple) {
                    select2Opts.initSelection = function(element, callback) {
                        App.logDebug("initSelection , domainId " + domainId);
                        if(domainId) {
                            App.logDebug("init debug. call " + initUrl);
                            $.ajax({ url: initUrl, data : {id : domainId}, dataType: dataType}).done(function(data) { callback(data); });
                        }
                    }
                }
                if(multiple && domainId) {
                    var renderDataCallback = (function($mmEl){
                        return function(data) {
                            $mmEl.select2("data", data);
                        };
                    })($mmEl);
                    $.ajax({ url: initUrl, data : {id : domainId}, dataType: dataType}).done(renderDataCallback);
                }
                var $select2 = $mmEl.select2(select2Opts);
                if(isReadOnly) $select2.select2("readonly", true);
                this.select2Els.push(mmEl);
            }, this);
        }
    });

    App.view.CombinedFormWithEmbeddedTable = App.view.CombinedForm.extend({
        addEmbeddedTableRow : function(tablePrefix, relativeUrl, otherCallback) { // #labors
            var $table = this.$(tablePrefix + "-table");
            var i = $table.find("tbody tr").length - 1;
            var newRowEl = tablePrefix + i; // this should match _shift.gsp
            var $lastRow = $table.find("tbody tr:eq("+ i +")");
            App.logDebug("add "+ tablePrefix + " row "+ i);
            var successCallback = (function(newRowEl, otherCallback) {
                return function(row) {
                    $lastRow.before(row);
                    this.setupUiComponents(newRowEl);
                    if(otherCallback) otherCallback(newRowEl);
                }
            })(newRowEl, otherCallback);
            this.getHtml(App.url + relativeUrl, {i : i}, successCallback );
        },
        deleteRow : function(e) {
            App.logDebug(" delete row ");
            $(e.currentTarget).closest("tr").remove();
        },
        getHtml : function(url, option, callback) {
            return $.ajax({
                type: "GET",
                url: url,
                data: option || {},
                success: callback || function(){},
                context : this // make sure this BB view is the context
            });
        }
    });

})(jQuery, Backbone, _, App);

