import grails.test.AbstractCliTestCase

class _GrailsGenerateTests extends AbstractCliTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void test_GrailsGenerate() {

        execute(["grails-generate"])

        assertEquals 0, waitForProcess()
        verifyHeader()
    }
}
