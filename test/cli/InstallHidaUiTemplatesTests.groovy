import grails.test.AbstractCliTestCase

class InstallHidaUiTemplatesTests extends AbstractCliTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testInstallHidaUiTemplates() {

        execute(["install-hida-ui-templates"])

        assertEquals 0, waitForProcess()
        verifyHeader()
    }
}
