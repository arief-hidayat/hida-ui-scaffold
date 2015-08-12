// = require /app/ui-components/app-hida-datatables
// = require /app/ui-components/app-hida-typeahead
// = require /app/ui-components/app-hida-datepicker
// = require /lib/select2.min
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
            this.datePickers = [];
            _.each(this.typeAheadFields, function(view) { view.remove()});
            this.typeAheadFields = [];
            this.removeSelect2();
            return App.View.prototype.remove.apply(this, arguments);
        },
        removeSelect2 : function() {
            _.each(this.select2Els, function(elem){
                var $select2 = this.$(elem);
                if($select2) $select2.select2("destroy");
            }, this);
            this.select2Els = [];
        },
        ignoreSubmit : function() {
            var $btn = this.$(".buttons .btn:focus");
            if($btn && $btn.data("nojs")) {
                return true;
            }
            //App.logDebug("ignoreSubmit");
            return false;
        },
        submitForm : function(evt) {
            var $btn = $(evt.currentTarget);
            if($btn.data("new-window") && $btn.data("url")) {
                window.open($btn.data("url"));
                return false;
            }
            this.$("form:first .buttons .btn").attr('disabled','disabled');
            if($btn.data("nojs")) {
                var $form = $btn.closest("form");
                if($btn.data("url")) {
                    $form.attr("action", $btn.data("url"));
                }
                $form.submit();
//                $btn.removeAttr('disabled');
                return false;
            }
            this.publishFormEvent($btn, this.serializeForm());
            return false;
        },
        publishFormEvent : function($btn, formData) {
            var actionUrl = $btn.data("url") || formData.action;
            //App.logDebug("actionUrl " + actionUrl +", action " + $btn.data("action"));
            if($btn.data("action") && actionUrl) { // not yet tested, must alter the UI
                // e.g. <button data-action="showDialogBeforeSubmit" ... then define the customActions in App.view.TableFormTabs
                var data = { url : actionUrl, form : formData, $btn : $btn};
                this.publishEvt("form:action:"+ $btn.data("action"),data);
                this.publishEvt("form:button:clicked", data); // this is for general listener.
            } else {
                App.logErr("Must set data-action and/or data-url in the button ");
            }
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
            if(App.view.form && App.view.form.moreUiSetup) {
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
            _.each(this.typeAheadFields, function(typeAheadField){
                typeAheadField.manuallyPublishData();
            });
        },
        setupSelect2 : function(readOnly, parentEl) {
            var $select2Simples = parentEl == undefined ? this.$(".select2-simple") : this.$(parentEl + " .select2-simple");
            _.each($select2Simples, function(elem){
                var mmEl = this.$el.selector + " #" + elem.id;
                var $mmEl = $(mmEl);
                var isReadOnly = readOnly || ($mmEl.attr("readonly"));

                var $select2 = null;
                var fromJsonSelection = $mmEl.data("from-json");
                if(fromJsonSelection && App.dropdownSelection && App.dropdownSelection[fromJsonSelection]) {
                    //$select2.select2("data", App.dropdownSelection[fromJsonSelection]);
                    $select2 = $mmEl.select2({
                        query: function (query){
                            var data = {
                                results: App.dropdownSelection[fromJsonSelection]
                            };
                            query.callback(data);
                        }
                    });
                } else {
                    $select2 = $mmEl.select2();
                }
                var initData= $mmEl.data("init-data");
                if(initData) {
                    $select2.select2('data', initData);
                }
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
                var domainId = $mmEl.data("id"), domainIdField = $mmEl.data("id-field") || "id",  domainName = $mmEl.data("from"), initData= $mmEl.data("init-data"),
                    initUrl = $mmEl.data("initurl"), dataType = $mmEl.data("datatype") || "json", srcField = $mmEl.data("src-field"), targetField = $mmEl.data("target-field");
                var resultTemplate = App.template.select2.formatResult[$mmEl.data("resulttmpl") || domainName] ||
                    App.template.select2.defaultTemplate;
                var formatResult = (targetField) ?  resultTemplate(srcField , targetField) : resultTemplate;
                var selectionTemplate = App.template.select2.formatSelection[$mmEl.data("selectiontmpl") || domainName] ||
                    App.template.select2.defaultTemplate;
                var formatSelection = (targetField) ?  selectionTemplate(srcField , targetField) : selectionTemplate;
                var multiple = $mmEl.data("multiple") == "yes";
                var typeAheadUrl = $mmEl.data("typeahead") || App.url + "/typeAhead/" + domainName;

                var select2Opts = {
                    placeholder : $mmEl.data("placeholder") || "search item",
                    minimumInputLength: 1,
                    ajax : {
                        url : typeAheadUrl,
                        dataType : dataType,
                        data : function(term, page) { return { query: term } },
                        results : function(data, page) {
                            return { results : data };
                        }
                    },
                    allowClear : true,
                    multiple : multiple,
                    formatResult: formatResult, // omitted for brevity, see the source of this page
                    formatSelection: formatSelection,  // omitted for brevity, see the source of this page
                    dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
                    escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
                };


                if(domainId && initUrl) {
                    var dataQuery = {}; dataQuery[domainIdField] = domainId;
                    if(multiple) {
                        var renderDataCallback = (function($mmEl){
                            return function(data) {
                                $mmEl.select2("data", data);
                            };
                        })($mmEl);
                        $.ajax({ url: initUrl, data : dataQuery, dataType: dataType}).done(renderDataCallback);
                    } else {
                        select2Opts.initSelection = function(element, callback) {
                            $.ajax({ url: initUrl, data : dataQuery, dataType: dataType}).done(function(data) { callback(data); });
                        }
                    }
                }
                var $select2 = $mmEl.select2(select2Opts);
                if(initData) {
                    $select2.select2('data', initData);
                }
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
            //App.logDebug("add "+ tablePrefix + " row "+ i);
            var successCallback = (function(newRowEl, otherCallback) {
                return function(row) {
                    $lastRow.before(row);
                    this.setupUiComponents(newRowEl);
                    if(otherCallback) otherCallback(newRowEl);
                }
            })(newRowEl, otherCallback);
            this.getHtml(App.url + relativeUrl, this.paramsForAddEmbeddedTableRow(i), successCallback );
        },
        paramsForAddEmbeddedTableRow : function(i) {
            return {i : i};
        },
        deleteRow : function(e) {
            //App.logDebug(" delete row ");
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

