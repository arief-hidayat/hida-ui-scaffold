
includeTargets << new File("$hidaUiScaffoldPluginDir/scripts/_GrailsGenerate.groovy")

generateViews = true
generateController = true

target(generateHidaUi: "The description of the script goes here!") {
    depends(checkVersion, parseArguments, packageApp)

    promptForName(type: "Domain Class")

    try {
        String name = argsMap["params"][0]
		if(name && name.indexOf(":") != -1) {
			String[] sp = name.split(":", 2);
			name = sp[1];
			if(sp[0]) System.setProperty("grails.scaffolding.folder", sp[0])
		}
        if (!name || name == "*") {
            uberGenerate()
        }
        else {
            generateForName = name
            generateForOne()
        }
    }
    catch (Exception e) {
        logError "Error running generate-hida-ui", e
    }
}

setDefaultTarget(generateHidaUi)
