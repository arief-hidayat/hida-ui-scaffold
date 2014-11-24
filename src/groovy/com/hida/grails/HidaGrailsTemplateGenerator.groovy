package com.hida.grails

import org.codehaus.groovy.grails.scaffolding.DefaultGrailsTemplateGenerator
import org.codehaus.groovy.runtime.IOGroovyMethods
import org.springframework.core.io.AbstractResource
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.Resource
import org.springframework.core.io.support.PathMatchingResourcePatternResolver

/**
 * Created by arief.hidayat on 24/11/2014.
 */
class HidaGrailsTemplateGenerator extends DefaultGrailsTemplateGenerator {
    HidaGrailsTemplateGenerator(ClassLoader classLoader) {
        super(classLoader)
    }
    protected String getTemplateText(String template) throws IOException {
        InputStream inputStream = null;
        if (resourceLoader != null && grailsApplication.isWarDeployed()) {
            inputStream = resourceLoader.getResource("/WEB-INF/templates/" + getScaffoldingFolderName() + "/" + template).getInputStream();
        }
        else {
            AbstractResource templateFile = getTemplateResource(template);
            if (templateFile.exists()) {
                inputStream = templateFile.getInputStream();
            }
        }

        return inputStream == null ? null : IOGroovyMethods.getText(inputStream);
    }
    protected AbstractResource getTemplateResource(String template) throws IOException {
        String name = "src/templates/" + getScaffoldingFolderName() + "/"  + template;
        AbstractResource templateFile = new FileSystemResource(new File(basedir, name).getAbsoluteFile());
        if (!templateFile.exists()) {
            templateFile = new FileSystemResource(new File(getPluginDir(), name).getAbsoluteFile());
        }

        return templateFile;
    }
    protected Set<String> getTemplateNames() throws IOException {

        if (resourceLoader != null && grailsApplication.isWarDeployed()) {
            try {
                PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(resourceLoader);
                return extractNames(resolver.getResources("/WEB-INF/templates/" + getScaffoldingFolderName() + "/*.gsp" ));
            }
            catch (Exception e) {
                return Collections.emptySet();
            }
        }

        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Set<String> resources = new HashSet<String>();

        String templatesDirPath = basedir + "/src/templates/" + getScaffoldingFolderName();
        Resource templatesDir = new FileSystemResource(templatesDirPath);
        if (templatesDir.exists()) {
            try {
                resources.addAll(extractNames(resolver.getResources("file:" + templatesDirPath + "/*.gsp")));
            }
            catch (Exception e) {
                log.error("Error while loading views from " + basedir, e);
            }
        }

//        File pluginDir = getPluginDir();
//        try {
//            resources.addAll(extractNames(resolver.getResources("file:" + pluginDir + "/src/templates/" + getScaffoldingFolderName() + "/*.gsp")));
//        }
//        catch (Exception e) {
//            // ignore
//            log.error("Error locating templates from " + pluginDir + ": " + e.getMessage(), e);
//        }

        return resources;
    }
    protected String getScaffoldingFolderName() {
        return System.getProperty("grails.scaffolding.folder", "scaffolding");
    }
}
