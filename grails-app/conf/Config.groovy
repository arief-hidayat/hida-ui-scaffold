// configuration for plugin testing - will not be included in the plugin zip

log4j = {
    // Example of changing the log pattern for the default console
    // appender:
    //
    //appenders {
    //    console name:'stdout', layout:pattern(conversionPattern: '%c{2} %m%n')
    //}

    error  'org.codehaus.groovy.grails.web.servlet',  //  controllers
           'org.codehaus.groovy.grails.web.pages', //  GSP
           'org.codehaus.groovy.grails.web.sitemesh', //  layouts
           'org.codehaus.groovy.grails.web.mapping.filter', // URL mapping
           'org.codehaus.groovy.grails.web.mapping', // URL mapping
           'org.codehaus.groovy.grails.commons', // core / classloading
           'org.codehaus.groovy.grails.plugins', // plugins
           'org.codehaus.groovy.grails.orm.hibernate', // hibernate integration
           'org.springframework',
           'org.hibernate',
           'net.sf.ehcache.hibernate'
}


jodatime.format.org.joda.time.LocalDate = "yyyy-MM-dd"
jodatime.format.org.joda.time.LocalDateTime = "yyyy-MM-dd HH:mm"
jodatime.format.org.joda.time.LocalTime = "HH:mm"
grails.databinding.useSpringBinder = true
hida {
    datepicker {
        showValueOnEdit = true
    }
    singlePage = ["EmployeeType"] //TODO: add any views to be displayed as singlePage
    datatable {
        singlepage {
            width {
//                StockInTxn = 3 // to override width.
            }
        }
        compositekeydelimiter = '_'
        rowclass = [:]
        domainkey = [
                //            Asset : ["firstKey", "secondKey"] // for composite id
        ]
        domainfields = [ // TODO: to be displayed as table columns
                         Employee : ["code", "jobTitle", "fullName", "type"],
                         EmployeeType : ["type"]
        ]
    }

    typeahead {
        ignoreCase = true
        displayKey = [
                Employee : "code", EmployeeType: "type"
        ]
        populatedFields {
            employeeInstance = [:]
        }
    }
}

