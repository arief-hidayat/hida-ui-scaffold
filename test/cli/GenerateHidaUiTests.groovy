import grails.test.AbstractCliTestCase

class GenerateHidaUiTests extends AbstractCliTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testGenerateHidaUi() {

        execute(["generate-hida-ui"])

        assertEquals 0, waitForProcess()
        verifyHeader()
    }
}
