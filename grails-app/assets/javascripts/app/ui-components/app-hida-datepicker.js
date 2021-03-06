// bootstrap 3.1.1
//
//
// + datetimepicker 3.0.0 https://github.com/Eonasdan/bootstrap-datetimepicker http://eonasdan.github.io/bootstrap-datetimepicker
// + typeahead https://github.com/bassjobsen/Bootstrap-3-Typeahead
//
//= require /app/settings
//= require /lib/moment.min
//= require /lib/app-hida-bootstrap
//= require  /lib/app-hida-backbone
//= require_self

(function($, Backbone, _, moment, App){
    App.view.DatePicker = App.View.extend({
        type : null, field : null,
        events : {
            "dp.show" : "onChangeDatePicker", // make sure default value is set.
            "dp.change" : "onChangeDatePicker"
        },
        initialize: function(opt) {
            this.type = this.$el.data("type");
            this.field = this.$el.data("field");
            this.$day = this.$el.parent().find("#"+this.field + "-day");
            this.$month = this.$el.parent().find("#"+this.field + "-month");
            this.$year = this.$el.parent().find("#"+this.field + "-year");
            this.$hour = this.$el.parent().find("#"+this.field + "-hour");
            this.$minute = this.$el.parent().find("#"+this.field + "-minute");

            // setup date picker
            var timePickerOpts = { pickDate: true };
            if(this.isTimePicker()) timePickerOpts.pickDate = false;
            this.$el.data("date-format", this.getDateFormat());
            this.picker = this.$el.datetimepicker(timePickerOpts);

            this.$el.on('keyup', $.proxy(this.checkOnDelete, this)); // make sure it's reset.

            // TODO: set date, if any
            var initDate = this.getDateValue();
            if(initDate != null) {
//                App.logDebug(this.field + ". set init date. " + initDate);

                this.picker.data("DateTimePicker").setDate(initDate);
            }
//            var initialValue = this.$("#" + this.field).val();
//            if(initialValue != undefined && initialValue != "")
//                this.picker.setDate(moment(initialValue, this.getDateFormat()));

            this.minBoundaries = this.$el.data("after") || [];
            this.maxBoundaries = this.$el.data("before") || [];
//            App.logDebug("on minBoundaries " + this.minBoundaries);

            // listen to min/max boundaries
            _.each(this.minBoundaries, function(element){
                if(element == this.field) return;
                this.subscribeEvt("dp.change:" + element, function(e) {
                    var date = e.date;
                    if(date == undefined || date == null) return;
                    var currMinDate = this.picker.options ? this.picker.options.minDate : null; // a moment
                    if( currMinDate == undefined || currMinDate == null || currMinDate.isAfter(date)) {
                        this.picker.data("DateTimePicker").setMinDate(date);
                    }
                });
            }, this);
            _.each(this.maxBoundaries, function(element){
                if(element == this.field) return;
                this.subscribeEvt("dp.change:" + element, function(e) {
                    var date = e.date;
                    if(date == undefined || date == null) return;
                    var currMaxDate = this.picker.options ? this.picker.options.maxDate : null; // a moment
                    if( currMaxDate == undefined || currMaxDate == null || currMaxDate.isBefore(date)) {
                        this.picker.data("DateTimePicker").setMaxDate(date);
                    }
                });
            }, this);

            if(this.$el.data('readonly') && this.$el.data('readonly') != "false") {
                this.picker.data("DateTimePicker").disable();
            }
        },
        checkOnDelete : function(e) {
            switch(e.keyCode) {
                case 8: // backspace
                case 46: // delete
                    var $el = $(e.currentTarget);
                    if($el.val() == "") {
                        this.reset();
                    }
                    break;
                default:
                    break;
            }
        },
        reset : function() { //TODO: test
            this.setValue(this.$year, undefined);
            this.setValue(this.$month, undefined);
            this.setValue(this.$day, undefined);
            this.setValue(this.$hour, undefined);
            this.setValue(this.$minute, undefined);
            // do we need to set the picker's date value as we?
        },
        onChangeDatePicker : function(e) {
            //App.logDebug("onChangeDatePicker " + this.field);
            if(e.date) {
                this.setDateValue(e.date);
                this.publishEvt("dp.change:" + this.field, e);
            }
        },
        getDateValue : function() {  return this.hasValue() ? new Date(this.year(), this.month(), this.day(), this.hour(), this.minute(), 0) : null},
        setDateValue : function(date) {
            //App.logDebug("setDateValue: " + date);
            this.setValue(this.$year, date.year());
            this.setValue(this.$month, date.month() ? (date.month() + 1) : date.month());
            this.setValue(this.$day, date.date());
            this.setValue(this.$hour, date.hour());
            this.setValue(this.$minute, date.minute());
        },
        getDateFormat : function () { return this.isDatePicker() ? App.format.LocalDate : (this.isTimePicker() ? App.format.LocalTime : App.format.LocalDateTime) },
        isTimePicker : function() { return this.type == "timePicker" },
        isDatePicker : function() { return this.type == "datePicker" },
        day : function() { return this.valueOf(this.$day) },
        month : function() {
            var val = this.valueOf(this.$month);
            if(val > 0) val = val - 1;
            return val;
        },
        year : function() { return this.valueOf(this.$year) },
        hour : function() { return this.valueOf(this.$hour) },
        minute : function() { return this.valueOf(this.$minute) },
        valueOf : function( $val ) {  return ($val == undefined || $val.val() == undefined) ? 0 : parseInt($val.val()); },
        setValue : function($val, value) { if($val != undefined) { $val.val(value); } },
        hasValue :function() {
            return this.isTimePicker() ? (this.hour() > 0): (this.year() > 0);
        }
    });
})(jQuery, Backbone, _, window.moment, App);

