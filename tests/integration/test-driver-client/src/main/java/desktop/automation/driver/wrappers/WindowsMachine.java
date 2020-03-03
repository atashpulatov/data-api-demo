package desktop.automation.driver.wrappers;

import desktop.automation.pages.SUT.DataPreviewPage;
import desktop.automation.pages.SUT.ImportRefreshProgressPopUp;
import desktop.automation.pages.SUT.prompts.*;
import desktop.automation.pages.SUT.refresh.popups.RefreshPromptPage;
import desktop.automation.pages.driver.implementation.windows.SUT.*;
import desktop.automation.pages.driver.implementation.windows.SUT.prompts.*;
import desktop.automation.pages.driver.implementation.windows.SUT.refresh.popups.ImportingDataSingleRefreshPopUpPageWindowsMachine;
import desktop.automation.pages.driver.implementation.windows.SUT.refresh.popups.RefreshAllPopUpPageWindowsMachine;
import desktop.automation.pages.driver.implementation.windows.nonSUT.PreSUTPageWindowsMachine;
import io.appium.java_client.windows.WindowsDriver;
import junit.framework.AssertionFailedError;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.net.URL;
import java.util.Set;

import static desktop.automation.ConfigVars.SKIP_STANDARD_INITIALIZATION_AND_TEAR_DOWN;
import static junit.framework.TestCase.assertTrue;

public class WindowsMachine extends Machine {
    public Actions actions;
    //extend folder to 1)Windows, 2)Mac desktop, 3) browser

    public WindowsMachine(String host) {
        super(host, DriverType.WINDOWS_DESKTOP, 30);

        preSUTPage = new PreSUTPageWindowsMachine(this);
        loginPage = new LoginPageWindowsMachine(this);
        mainPage = new MainPageWindowsMachine(this);
        importPromptPage = new ImportPromptPageWindowsMachine(this);
        prepareDataPromptPage = new PrepareDataPromptPageWindowsMachine(this);
        dataPreviewPage = new DataPreviewPage(this);
        importRefreshProgressPopUp = new ImportRefreshProgressPopUp(this);
        conditionalFormattingPage = new FormattingPageWindowsMachine(this);
        formatCellsPromptPage = new FormatCellsPromptPageWindowsMachine(this);
        refreshPromptPage = new RefreshPromptPage(this);
        moreItemMenuPage = new MoreItemMenuPageWindowsMachine(this);
        browserPage = new BrowserPageWindowsMachine(this);
        importingDataSingleRefreshPopUpPage = new ImportingDataSingleRefreshPopUpPageWindowsMachine(this);
        refreshAllPopUpPage = new RefreshAllPopUpPageWindowsMachine(this);
        applicationSelectionPopUpPage = new ApplicationSelectionPopUpPageWindowsMachine(this);

        standardPromptPage = new StandardPromptPage(this);
        datePromptPage = new DatePromptPageWindowsMachine(this);
        bigDecimalPromptPage = new BigDecimalPromptPage(this);
        numericPromptPage = new NumericPromptPage(this);
        textValuePromptPage = new TextValuePromptPage(this);
        hierarchyPromptPage = new HierarchyPromptPageWindowsMachine(this);
        objectPromptPage = new ObjectPromptPageWindowsMachine(this);
        attributeElementPromptPage = new AttributeElementPromptPage(this);
        hierarchyQualificationPromptPage = new HierarchyQualificationPromptPage(this);
        metricQualificationPromptPage = new MetricQualificationPromptPageWindowsMachine(this);
        attributeQualificationPromptPage = new AttributeQualificationPromptPageWindowsMachine(this);
        multiplePrompts = new MultiplePromptsPage(this);
    }

    @Override
    protected void initDriver(String remoteAddress) {
        DesiredCapabilities capabilities = new DesiredCapabilities();
        capabilities.setCapability("app", "Root");
        capabilities.setCapability("newCommandTimeout", 360);

        for (int i = 0; i < 10; i++) {
            System.out.println("Initializing driver. Attempt: " + i);
            try {
                URL url = new URL(remoteAddress);

                driver = new WindowsDriver(url, capabilities);
                actions = new Actions(driver);

                Thread.sleep(5000);
                ((WindowsDriver)driver).launchApp();

                if (!SKIP_STANDARD_INITIALIZATION_AND_TEAR_DOWN) {
                    String expectedAppTitleToContain =
                            "Desktop 1"
                            //"Excel"
                            ;
                    String assertionMessage = String.format("application tile does not match.\nActual:%s\nExpected:%s\n", driver.getTitle(), expectedAppTitleToContain);
                    assertTrue(assertionMessage, driver.getTitle().contains(expectedAppTitleToContain));

                    System.out.println("Initialized");
                }
                break;
            } catch (Exception | AssertionFailedError e) {
                e.printStackTrace();
            }
        }
    }

    public WebElement waitAndFindAndGetScreenshot(By selector, WebDriverWait wait, String screeshotName) throws IOException {
        //time measuremnt was initially set for debugging purposes, but decided to leave it
        long start = System.currentTimeMillis();

        WebElement res = wait.until(ExpectedConditions.visibilityOfElementLocated(selector));

        long diff = System.currentTimeMillis() - start;
        System.out.println(diff / 1000 + "," + diff % 1000);

        //screenshot phase
        takeElementScreenshotWithDetails(res, screeshotName);

        return res;
    }

    public RemoteWebElement waitAndClick(By selector) {
        return waitAndClick(selector, ONE_UNIT);
    }

    public RemoteWebElement waitAndClick(By selector, WebDriverWait wait){
        RemoteWebElement element = waitAndFind(selector, wait);
        element.click();
        return element;
    }

    public RemoteWebElement waitAndChangeWindowHandle(By selector) {
        Set<String> handles = driver.getWindowHandles();

        for (String handle : handles) {
            try {
                System.out.println("trying handle: " + handle);
                driver.switchTo().window(handle);
                return waitAndFind(selector);
            } catch (Exception e){
                System.out.println("failed to find with current window handle");
                e.printStackTrace();
            }
        }

        return waitAndFind(selector);
    }

    public ImportRefreshProgressPopUp getImportRefreshProgressPopUp() {
        return importRefreshProgressPopUp;
    }

    public boolean isButtonEnabled(WebElement button) {
        String res = button.getAttribute("IsEnabled").trim();
        return "True".matches(res);
    }

    public int getGridIndex(WebElement element) {
        return Integer.parseInt(element.getAttribute("GridItem.Row"));
    }

}
