package notToBeRunAsPartOfTestSuite;

import org.junit.Test;

import static junit.framework.TestCase.assertTrue;

public class emptyTests {
//login log out tests,
//import report, dataset
//

    @Test
    public void testSuccess(){
        assertTrue(true);
    }

    @Test
    public void testFailure() {
        assertTrue(false);
    }
}
