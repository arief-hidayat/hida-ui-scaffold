App = window.App || {};
App.options = App.options || {
    language : "en"
};
App.format = App.format || {
    LocalDate : "YYYY-MM-DD", LocalDateTime : "YYYY-MM-DD HH:mm", LocalTime : "HH:mm"
};
//ref jodatime.format.org.joda.time.LocalDate and http://momentjs.com/docs #format

App.compositekeydelimiter = '_';

App.dt = App.dt || { };
App.dt.config = App.dt.config || {};

App.url = App.url || "http://localhost:8080/my-app-here"; // please override

App.css = App.css || {
    selected : 'danger'
};

App.view = App.view || {};
App.util = App.util || {};


App.datakey = App.datakey || {
    selectedRows : 'selectedRows'
};

App.logDebug = App.logDebug || function(msg) { window.console&&console.log(msg);};
App.logErr = App.logErr || function(msg) { window.console&&console.error(msg);};

App.dropdownSelection = App.dropdownSelection || {};
App.template =  App.template || {};

App.template.select2  = App.template.select2 || {};
App.template.select2.defaultTemplate = function(sourceFieldNm, targetFieldNm) {
    return function(item) {
        return "<input type='hidden' name='"+ targetFieldNm + "' value='" + item[sourceFieldNm] + "'>" + item[sourceFieldNm];
    }
};
App.template.select2.formatResult  = App.template.select2.formatResult || {};
App.template.select2.formatSelection  = App.template.select2.formatSelection || {};


App.view.form = App.view.form || {};

App.onLoggedOut = function() {
    window.location = App.url;
};