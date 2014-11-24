includeTargets << grailsScript("_GrailsInit")

target(installHidaUiTemplates: "Installs Hida UI scaffolding template") {
    def srcdir = new File("$hidaUiScaffoldPluginDir/src/templates/scaffolding")
    def destdir = new File("$basedir/src/templates/scaffolding/")

    if (srcdir?.isDirectory()) {
        event "StatusUpdate", ["Copying templates from $hidaUiScaffoldPluginDir"]

        def copyTemplates = ["_form.gsp", "_message.gsp", "_partialCreate.gsp", "_partialEdit.gsp", "_partialShow.gsp",
                             "_partialSinglePage.gsp", "Controller.groovy","index.gsp",
                             "renderEditor.template", "singlepage.gsp"]

        for (name in copyTemplates) {
            def srcfile = new File(srcdir, name)
            def destfile = new File(destdir, name)
            ant.copy file: srcfile.absolutePath, tofile: destfile.absolutePath, overwrite: true, failonerror: false
        }
        event "StatusFinal", ["Template installation complete"]
    } else {
        event "StatusError", ["Unable to install templates as plugin template files are missing"]
    }
}

setDefaultTarget(installHidaUiTemplates)

