Hida UI Scaffold

> grails install-hida-ui-templates

Create domain with all fields then generate view & controller with:
> grails generate-hida-ui test.Employee --> it will generate view and controller from src/templates/scaffolding
> grails generate-hida-ui different-scaffold:test.Employee --> from src/templates/different-scaffold

Known to be incompatible with hibernate:3.6.10.18.
You need to override the implementation in DataTableService.
