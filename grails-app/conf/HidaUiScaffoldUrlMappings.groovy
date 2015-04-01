class HidaUiScaffoldUrlMappings {

	static mappings = {
        "/dataTable/display" (controller: 'dataTable', action: 'display')
        "/dataTable/$domainName" (controller: 'dataTable', action: 'list')
        "/typeAhead/$domainName" (controller: 'typeAhead', action: 'list')
	}
}
