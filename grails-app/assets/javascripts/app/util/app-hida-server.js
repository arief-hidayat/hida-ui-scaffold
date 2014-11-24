//
//= require /app/settings
//= require /lib/jquery-1.11.1.min
//= require /lib/app-hida-backbone
//= require_self

(function($, App){
    App.util.HtmlGetter = {
        getHtml : function(url, option, callback) {
            return $.ajax({
                type: "GET",
                url: url,
                data: option || {},
                success: callback || function(){},
                context : this // make sure this BB view is the context
            });
        }
    };
    App.util.JsonGetter = {
        //TODO:
    };
})(jQuery, App);

