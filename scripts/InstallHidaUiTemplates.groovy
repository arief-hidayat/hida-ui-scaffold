includeTargets << grailsScript("_GrailsInit")

target(installHidaUiTemplates: "Installs Hida UI scaffolding template") {
    List params = argsMap["params"]
    String scaffoldingSrcFolder = (params && params.size() > 0 ) ? params.get(0) : "scaffolding"
    String scaffoldingDestFolder = (params && params.size() > 0) ? ( params.size() == 2 ? params.get(1) : "scaffolding") : "scaffolding"
    event "StatusUpdate", ["Looking for scaffolding template $scaffoldingSrcFolder to be copied on to $scaffoldingDestFolder"]
    def srcFolder = new File("$hidaUiScaffoldPluginDir/src/templates/${scaffoldingSrcFolder}")
    def destdir = new File("$basedir/src/templates/${scaffoldingDestFolder}/")

    if (srcFolder?.isDirectory()) {
        event "StatusUpdate", ["Copying templates from $hidaUiScaffoldPluginDir"]

        File[] listOfFiles = srcFolder.listFiles()
        for (int i = 0; i < listOfFiles.length; i++) {
            File srcFile = listOfFiles[i]
            if (srcFile.isFile()) {
                File destFile = new File(destdir, srcFile.name)
                ant.copy file: srcFile.absolutePath, tofile: destFile.absolutePath, overwrite: true, failonerror: false
            }
        }
        event "StatusFinal", ["Template installation complete"]
    } else {
        event "StatusError", ["Unable to install templates as plugin template files are missing"]
    }
}

setDefaultTarget(installHidaUiTemplates)

