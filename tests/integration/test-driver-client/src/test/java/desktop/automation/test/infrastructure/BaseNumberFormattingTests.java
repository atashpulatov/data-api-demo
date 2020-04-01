package desktop.automation.test.infrastructure;

import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.helpers.windows.PowerPoint;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;

import java.io.IOException;

import static desktop.automation.ConfigVars.RECORD_TEST_CASE;
import static desktop.automation.ConfigVars.SKIP_STANDARD_INITIALIZATION_AND_TEAR_DOWN;

public abstract class BaseNumberFormattingTests extends BaseLoggedInTests {
    protected static PowerPoint powerPoint;
    private static boolean isNumberFormattingReportImported = false;

    @BeforeClass
    public static void beforeAllNumberFormatting() throws IOException {
        if (!SKIP_STANDARD_INITIALIZATION_AND_TEAR_DOWN) {
            getToSUTAndLogIn();

            //import Number Formatting report if not imported
            if (!isNumberFormattingReportImported) {
                ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                        .withObjectName("Number Formatting")
                        .isFirstImport(true)
                        .build();
                ImportPrepareDataHelper.importObject(argumments);

                //excel jumps back to cell A1 if goToCell call is made to quickly, since the table hasn't finished loading
                try {
                    Thread.sleep(2_000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                isNumberFormattingReportImported = true;
            }
        }
    }

    @Before
    public void beforeEach(){
        if (RECORD_TEST_CASE) {
            powerPoint = new PowerPoint(machine);
            powerPoint.startRecording();
        }
    }

    @After
    public void afterEach(){
        if (RECORD_TEST_CASE)
            powerPoint.stopRecording();
    }

    @AfterClass
    public static void afterAll() throws IOException {
        if (!SKIP_STANDARD_INITIALIZATION_AND_TEAR_DOWN)
            handleTearDown();
    }
}
