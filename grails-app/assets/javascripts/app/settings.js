// for testing only. this will not be included as part of deliverable

//= require core.settings
//= require_self

App.dt.config.table = {
    Employee : { columns: [ { "data": "code" }, { "data": "jobTitle" }, { "data": "fullName" }, { "data": "type" } ] },
    EmployeeType : { columns: [ { "data": "type" } ] }
};

App.dt.config.customUrl = { /// for dataTable query
//        Asset : {
//            url : "only for custom",
//            data : function(){},
//            extraParams : function(request) { }
//        }
};