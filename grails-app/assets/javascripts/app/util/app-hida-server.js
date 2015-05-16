//
//= require /app/settings
//= require /lib/jquery-1.11.1.min
//= require /lib/app-hida-backbone
//= require_self

(function($, App){
    App.AJAX = App.AJAX || {
        defaultErrorCallback : function($messageContainer){
            return function(jqXHR) {
                var message = jqXHR.responseText;
                if(jqXHR.responseJSON && jqXHR.responseJSON.message) message = jqXHR.responseJSON.message;
                console.log(">>>>>" + message);
                console.log(">>>>>" + $messageContainer);
                if($messageContainer == undefined || $messageContainer.length == 0) {
                    alert(message);
                } else {
                    $messageContainer.html('<p class="bg-danger" style="padding: 10px">'+message+'</p>');
                }
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
})(jQuery, App);

