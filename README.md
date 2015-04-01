# Scripts to install template and generate UI

Install templates:
> grails install-hida-ui-templates

Create domain with all fields then generate view & controller (from src/templates/scaffolding):
> grails generate-hida-ui test.Employee

or generate from src/templates/different-scaffold, if you have such templates
> grails generate-hida-ui different-scaffold:test.Employee

Check the generated views and controller. you might want to change some contents. 
i.e. the JS portion in index.gsp and singlepage.gsp

# Additional Configuration

At the moment, you need to add new javascript assets: app/settings.js

    // override whatever is required from core.settings.
    //= require core.settings
    //= require_self
    
    App.dt.config.table = {
        // define dataTable columns
        EmployeeType : { columns: [ { "data": "type" } ] }
    };
    


You also need to update Config.groovy

	jodatime.format.org.joda.time.LocalDate="yyyy-MM-dd"
	jodatime.format.org.joda.time.LocalDateTime="yyyy-MM-dd HH:mm"
	grails.databinding.useSpringBinder = true

	hida {
		datepicker {
			showValueOnEdit = true
		}
		singlePage = ["EmployeeType"] //TODO: add any views to be displayed as singlePage
		datatable {
			singlepage {
				width {
					// StockInTxn = 3 // to override width.
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


# Limitation

Default API is incompatible with hibernate:3.6.10.18.
You need to override the implementation in DataTableService.


