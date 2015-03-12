// bootstrap 3.1.1
// + datetimepicker 3.0.0 https://github.com/Eonasdan/bootstrap-datetimepicker http://eonasdan.github.io/bootstrap-datetimepicker
// + typeahead https://github.com/bassjobsen/Bootstrap-3-Typeahead
//
//
//= require /app/settings
//= require /lib/jquery-1.11.1.min
//= require /lib/bootstrap-3.2.0.min
//= require /lib/bootstrap-datetimepicker.min
//= require_self

(function($, App){

    $.ajaxSetup({
//        beforeSend : function(xhr, event) {
//        },
        error : function(jqXHR, textStatus, errorThrown) {
            window.console && console.log("AJAX error jqXHR.statusText=[" + jqXHR.statusText + "] jqXHR.status=[" + jqXHR.status + "]");
            if(jqXHR.statusText == "net::ERR_CONNECTION_RESET") {
                App.onLoggedOut();
            }
        },
        statusCode: {
            // Set up a global AJAX error handler to handle the 401
            // unauthorized responses. If a 401 status code comes back,
            // the user is no longer logged-into the system and can not
            // use it properly.
            401: function() {
                App.onLoggedOut();
            }
        }
    });

    $.fn.datetimepicker.defaults = {
        pickDate: true,                 //en/disables the date picker
        pickTime: true,                 //en/disables the time picker
        useMinutes: true,               //en/disables the minutes picker
        useSeconds: true,               //en/disables the seconds picker
        useCurrent: true,               //when true, picker will set the value to the current date/time
        minuteStepping:1,               //set the minute stepping
        minDate:'1/1/1960',               //set a minimum date
//    maxDate: ,     //set a maximum date (defaults to today +100 years)
        showToday: true,                 //shows the today indicator
//        language: App.options.language,                  //sets language locale
        defaultDate:"",                 //sets a default date, accepts js dates, strings and moment objects
        disabledDates:[],               //an array of dates that cannot be selected
        enabledDates:[],                //an array of dates that can be selected
        icons : {
            time: 'glyphicon glyphicon-time',
            date: 'glyphicon glyphicon-calendar',
            up:   'glyphicon glyphicon-chevron-up',
            down: 'glyphicon glyphicon-chevron-down'
        },
        useStrict: false,               //use "strict" when validating dates
        sideBySide: true,              //show the date and time picker side by side
        daysOfWeekDisabled:[]          //for example use daysOfWeekDisabled: [0,6] to disable weekends
    };


})(jQuery, App);

