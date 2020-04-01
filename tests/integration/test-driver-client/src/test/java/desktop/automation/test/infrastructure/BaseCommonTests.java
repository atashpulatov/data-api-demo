package desktop.automation.test.infrastructure;

import desktop.automation.driver.wrappers.Browser;
import desktop.automation.driver.wrappers.MacMachine;
import desktop.automation.driver.wrappers.Machine;
import desktop.automation.driver.wrappers.enums.DriverType;
import desktop.automation.exceptions.ImageBasedElemNotFound;
import desktop.automation.helpers.windows.PowerPoint;
import desktop.automation.pages.driver.implementation.mac.nonSUT.PreSUTPageMacMachine;
import desktop.automation.test.infrastructure.web.driver.rules.RepeatRule;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebElement;

import java.io.IOException;

import static desktop.automation.ConfigVars.*;

public abstract class BaseCommonTests extends BaseTests {
    public static Machine machine;
    public static Browser browser;
    private static PowerPoint powerPoint;
    private static boolean firstTC = true;

    @Rule
    public RepeatRule repeatRule = new RepeatRule();

    @BeforeClass
    public static void beforeAll(){
        if (machine == null) {
            machine = getMachine();
            browser = machine.isBrowser() ? (Browser)machine : null;

            Runtime.getRuntime().addShutdownHook(new Thread(() -> machine.driver.quit()));
        }
    }

    @Before
    public void beforeEach() throws IOException {
        if (!SKIP_STANDARD_INITIALIZATION_AND_TEAR_DOWN) {
            if (machine.isBrowser()) {
                try {
                    beforeStep();
                } catch (Throwable e) {
                    System.out.println("failed to set up test case");
                    resetBrowser();
                    beforeStep();
               }
            }
            else
                beforeStep();
        }
    }

    protected void beforeStep() throws IOException {
        getToSUT();
    }

    protected static void getToSUT() throws IOException {
        getToSUT(machine.getDriverType());
    }

    private static void getToSUT(DriverType driverType) throws IOException {
        switch (driverType) {
            case BROWSER:
                getToSUTBrowser();
                break;
            case MAC_DESKTOP:
                getToSUTMacMachine();
                break;
            case WINDOWS_DESKTOP:
                getToSUTWindowsMachine();
                break;
            default:
                throw new RuntimeException("Unimplemented driver requested, driver type: " + driverType);
        }
    }

    protected static void getToSUTWindowsMachine() {
        //open Excel, new blank sheet and open add in
        //Zero excel windows should be open for the test suite to work.
        if (RECORD_TEST_CASE) {
            powerPoint = new PowerPoint(machine);
            powerPoint.startRecording();
        }

        for (int i = 0; i < 3; i++) {
            try {
                machine.getPreSUTPage().getExcelStartElem(0).click();
                break;
            } catch (org.openqa.selenium.WebDriverException e) {
                try {
                    Thread.sleep(3_000);
                } catch (InterruptedException ex) {
                    ex.printStackTrace();
                }
            }
        }

        machine.getPreSUTPage().getBlankSheetElem().click();

        try {
            machine.getPreSUTPage().getAddInStartImageBasedElem().click();
        } catch (ImageBasedElemNotFound | IllegalArgumentException e) {
            machine.getPreSUTPage().getAddInStartElemAndTakeScreenshot().click();
        }
    }

    public static void getToSUTBrowser(){
        //On Google Chrome the command driver.switchTo().defaultContent() can perpetuate with default PageLoadStrategy
        //there PageLoadStrategy is set to PageLoadStrategy.NONE
        //however due to this when loading the workbook clicking the "New blank workbook" GUI node can misdirect often to one drive instead of new workbook
        //since the page only needs to load on the first run the below sleep does not introduce significant overhead in a longer test run
        //possible to change by 1)going through the menu in the top left corner, 2) changing selector, 3) or waiting for different element to load
        if (firstTC) {
            try {
                Thread.sleep(10_000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            firstTC = false;
        }

        machine.getPreSUTPage().getBlankSheetElem().click();
        Browser browser = (Browser)machine;
        browser.switchToExcelWorkbookWindow();
        machine.getDriver().manage().window().maximize();
        browser.focusOnExcelFrameForBrowser();

        WebElement addInStartElem = browser.getPreSUTPage().getAddInStartElem();
        try {
            Thread.sleep(1_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        addInStartElem.click();
    }

    public static void getToSUTMacMachine(){
        MacMachine macMachine = (MacMachine)machine;
        macMachine.driver.get("Microsoft Excel");
        macMachine.getPreSUTPage().getBlankSheetElem().click();

        //sometimes the Insert tab elem is not found and the driver quits immediately without waiting for the WebDriverWait, attempt to remedy bellow
        //seems like the issue is with the driver closing and opening windows, applications, waiting for 500 - 1_000 millis seems to solve the issue
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        macMachine.getPreSUTPage().getInsertTabElem().click();
        ((PreSUTPageMacMachine)macMachine.getPreSUTPage()).clickAddInDropDownElem();
        ((PreSUTPageMacMachine)macMachine.getPreSUTPage()).getAddInToImportElem().click();
        ((PreSUTPageMacMachine)macMachine.getPreSUTPage()).refocusOnHomeTab();
        macMachine.getPreSUTPage().getAddInStartElem().click();
    }

    @After
    public void afterEach() throws IOException {
        handleTearDown();
    }

    protected static void handleTearDown() throws IOException {
        handleTearDown(DESIRED_DRIVER_TYPE);
    }

    private static void handleTearDown(DriverType driverType) throws IOException {
        if (!SKIP_STANDARD_INITIALIZATION_AND_TEAR_DOWN) {
            switch (driverType) {
                case BROWSER:
                    handleTearDownBrowser();
                    break;
                case MAC_DESKTOP:
                    handleTearDownMacMachine();
                    break;
                case WINDOWS_DESKTOP:
                    handleTearDownWindowsMachine();
                    break;
                default:
                    throw new RuntimeException("Unimplemented driver requested, driver type: " + driverType);
            }
        }
    }

    private static void handleTearDownBrowser(){
        Browser.addInIframeId = null;
        Machine.browserFocusedFrame = null;
        browser.switchToExcelWorkbookWindow();
        browser.driver.close();
        browser.switchToExcelInitialWindow();

        if (MINIMIZE_WINDOW_AFTER_TEST_CASE) {
            Point position = browser.driver.manage().window().getPosition();
            browser.driver.manage().window().setPosition(new Point(-2000, 0));
            try {
                Thread.sleep(1_000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            browser.driver.manage().window().setPosition(position);
        }
    }

    private static void handleTearDownWindowsMachine(){
        //close sheet
        //first get the excel window element to confirm that the window is open, so as not to target the command prompt
        try {
            machine.getPreSUTPage().getCloseBtnElem().click();

            try {
                machine.getPreSUTPage().getDontSaveBtnImageBasedElem().click();
            } catch (ImageBasedElemNotFound | IllegalArgumentException e) {
                machine.getPreSUTPage().getDontSaveBtnElemAndTakeScreenshot().click();
            }

            //stop recording is running
            if (RECORD_TEST_CASE)
                powerPoint.stopRecording();
        } catch (Exception ignored) {}
    }

    private static void handleTearDownMacMachine() {
        ((PreSUTPageMacMachine)machine.getPreSUTPage()).closeExcel();
    }

    public static void resetBrowser(){
        machine.driver.quit();
        Browser.addInIframeId = null;
        Machine.browserFocusedFrame = null;
        firstTC = true;
        machine = getMachine();
        browser = (Browser)machine;
    }
}
