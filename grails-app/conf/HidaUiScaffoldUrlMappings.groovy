class HidaUiScaffoldUrlMappings {

	static mappings = {
        "/dataTable/$domainName" (controller: 'dataTable', action: 'list')
        "/typeAhead/$domainName" (controller: 'typeAhead', action: 'list')
	}
}
