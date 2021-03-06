import com.hida.grails.HidaGrailsTemplateGenerator
import org.codehaus.groovy.grails.commons.spring.BeanConfiguration
import org.codehaus.groovy.grails.commons.spring.RuntimeSpringConfiguration

class HidaUiScaffoldGrailsPlugin {
    // the plugin version
    def version = "0.1"
    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "2.3 > *"
    // resources that are excluded from plugin packaging
    def pluginExcludes = [
            "grails-app/views/error.gsp",
            "grails-app/views/index.gsp",
            "grails-app/views/employee*/**",
            "grails-app/domain/test/Employee*",
            "grails-app/controllers/test/Employee*",
            "grails-app/assets/javascripts/app/settings.js"
    ]

    // TODO Fill in these fields
    def title = "Hida Ui Scaffold Plugin" // Headline display name of the plugin
    def author = "Arief Hidayat"
    def authorEmail = ""
    def description = '''\
UI scaffolding with jQuery, Backbone, Bootstrap, Select2, DataTables, & server-side rendering.
'''

    // URL to the plugin's documentation
    def documentation = "http://grails.org/plugin/hida-ui-scaffold"

    // Extra (optional) plugin metadata

    // License: one of 'APACHE', 'GPL2', 'GPL3'
//    def license = "APACHE"

    // Details of company behind the plugin (if there is one)
//    def organization = [ name: "My Company", url: "http://www.my-company.com/" ]

    // Any additional developers beyond the author specified above.
//    def developers = [ [ name: "Joe Bloggs", email: "joe@bloggs.net" ]]

    // Location of the plugin's issue tracker.
//    def issueManagement = [ system: "JIRA", url: "http://jira.grails.org/browse/GPMYPLUGIN" ]

    // Online location of the plugin's browseable source code.
//    def scm = [ url: "http://svn.codehaus.org/grails-plugins/" ]

    def doWithWebDescriptor = { xml ->
        // TODO Implement additions to web.xml (optional), this event occurs before
    }

    def loadAfter = ['scaffolding']
    def doWithSpring = {
        scaffoldingTemplateGenerator(HidaGrailsTemplateGenerator, ref("classLoader")) {
            grailsApplication = ref("grailsApplication")
        }
//        jspViewResolver(ScaffoldingViewResolver) { bean ->
//            bean.lazyInit = true
//            bean.parent = 'abstractViewResolver'
//
//            templateGenerator = scaffoldingTemplateGenerator
//            scaffoldedActionMap = ref("scaffoldedActionMap")
//            scaffoldedDomains = controllerToScaffoldedDomainClassMap
//        }
    }

    def doWithDynamicMethods = { ctx ->
        // TODO Implement registering dynamic methods to classes (optional)
    }

    def doWithApplicationContext = { ctx ->
        // TODO Implement post initialization spring config (optional)
    }

    def onChange = { event ->
        // TODO Implement code that is executed when any artefact that this plugin is
        // watching is modified and reloaded. The event contains: event.source,
        // event.application, event.manager, event.ctx, and event.plugin.
    }

    def onConfigChange = { event ->
        // TODO Implement code that is executed when the project configuration changes.
        // The event is the same as for 'onChange'.
    }

    def onShutdown = { event ->
        // TODO Implement code that is executed when the application shuts down (optional)
    }
}
