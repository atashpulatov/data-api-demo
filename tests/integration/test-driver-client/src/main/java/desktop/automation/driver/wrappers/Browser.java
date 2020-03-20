package desktop.automation.driver.wrappers;

import desktop.automation.driver.wrappers.enums.BrowserType;
import desktop.automation.driver.wrappers.enums.DriverType;
import desktop.automation.driver.wrappers.enums.OS;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import desktop.automation.pages.SUT.prompts.*;
import desktop.automation.pages.driver.implementation.browser.SUT.*;
import desktop.automation.pages.driver.implementation.browser.SUT.prompts.*;
import desktop.automation.pages.driver.implementation.browser.nonSUT.PreSUTPageBrowser;
import org.checkerframework.checker.nullness.compatqual.NullableDecl;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.RemoteWebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;

import java.util.List;

import static desktop.automation.ConfigVars.DESIRED_BROWSER_TYPE;

public class Browser extends Machine {
    public static String addInIframeId = null;
    public static String importPrepareDataIframeId = null;

    private static final By EXCEL_FRAME_ELEM = By.id("WebApplicationFrame");
    private static final By ADD_IN_FRAME_ELEM = By.cssSelector(".AddinIframe");
    private static final By PROMPT_POPUP_FRAME_ELEM = By.cssSelector("#root iframe");
    private static final By ADD_IN_OVERLAY_ELEM = By.id("overlay");
    private static final By ADD_IN_ROOT_ELEM = By.id("root");
    private static final By IMPORT_POPUP_FRAME_ELEM = By.cssSelector("#WACDialogOuterContainer iframe");

    public Browser(String host) {
        super(host, DriverType.BROWSER, 10);
    }

    @Override
    protected void initDriver(String host) {
        driver = initBrowserType(DESIRED_BROWSER_TYPE);
        driver.get(host);

        preSUTPage = new PreSUTPageBrowser(this);
        loginPage = new LoginPageBrowser(this);
        mainPage = new MainPageBrowser(this);
        applicationSelectionPopUpPage = new ApplicationSelectionPopUpPageBrowser(this);
        moreItemMenuPage = new MoreItemMenuPageBrowser(this);
        importPromptPage = new ImportPromptPageBrowser(this);
        importDossierPage = new ImportDossierPageBrowser(this);
        prepareDataPromptPage = new PrepareDataPromptPageBrowser(this);
        importingDataSingleRefreshPopUpPage = new ImportingDataSingleRefreshPopUpPageBrowser(this);

        datePromptPage = new DatePromptPageBrowser(this);
        numericPromptPage = new NumericPromptPage(this);
        textValuePromptPage = new TextValuePromptPage(this);
        bigDecimalPromptPage = new BigDecimalPromptPage(this);
        attributeElementPromptPage = new AttributeElementPromptPage(this);
        objectPromptPage = new ObjectPromptPageBrowser(this);
        standardPromptPage = new StandardPromptPage(this);
        multiplePrompts = new MultiplePromptsPage(this);
        metricQualificationPromptPage = new MetricQualificationPromptPageBrowser(this);
        attributeQualificationPromptPage = new AttributeQualificationPromptPageBrowser(this);
        hierarchyPromptPage = new HierarchyPromptPageBrowser(this);
    }

    @Override
    public boolean isButtonEnabled(WebElement button) {
        throw new NotImplementedForDriverWrapperException();
    }

    private void switchToWindowByIndex(int index) {
        driver.switchTo().window((String) driver.getWindowHandles().toArray()[index]);
    }

    public void switchToExcelInitialWindow(){
        switchToWindowByIndex(0);
    }

    public void switchToExcelWorkbookWindow(){
        switchToWindowByIndex(1);
    }

    public void switchToLoginPopUpWindow(){
        switchToWindowByIndex(2);
        browserFocusedFrame = null;
    }

    public void focusOnExcelFrame(){
        driver.switchTo().defaultContent();
        WebElement excelFrame = waitAndFind(EXCEL_FRAME_ELEM, TWO_UNITS);
        driver.switchTo().frame(excelFrame);
    }

    void focusOnAddInFrame(){
        long start = System.currentTimeMillis();

        do {
            try {
                focusOnExcelFrame();

                WebElement addInFrame;
                if (addInIframeId == null) {
                    addInFrame = driver.findElement(ADD_IN_FRAME_ELEM);
                    String addInIframeIdCandidate = addInFrame.getAttribute("id");
                    driver.switchTo().frame(addInFrame);
                    findAddInRootElem();
                    addInIframeId = addInIframeIdCandidate;
                }
                else {
                    addInFrame = driver.findElement(By.id(addInIframeId));
                    driver.switchTo().frame(addInFrame);
                    findAddInRootElem();
                }
                return;
            } catch (Throwable ignored) {
            }
        } while (System.currentTimeMillis() - start < 30_000);

        throw new RuntimeException("failed to focus on add in iframe");
    }

    void focusOnImportDataPopUpFrame(){
        focusOnExcelFrame();
        RemoteWebElement popupFrameElem = waitAndFind(IMPORT_POPUP_FRAME_ELEM);

        //may not be necessary to loop
        try {
            for (int i = 0; i < 10; i++) {
                driver.switchTo().frame(popupFrameElem);
                Thread.sleep(1_000);
            }
        } catch (StaleElementReferenceException | InterruptedException ignored) {}
    }

    void focusOnImportRefreshPopUp(){
        //in progress
        long start = System.currentTimeMillis();
        do {
            try {
                focusOnExcelFrame();
                List<WebElement> elements = driver.findElements(By.cssSelector(".AddinIframe"));
                for (WebElement element : elements) {
                    String id = element.getAttribute("id");
                    if (!id.equals(addInIframeId) && !id.equals(importPrepareDataIframeId))
                        driver.switchTo().frame(element);
                }
            } catch (org.openqa.selenium.StaleElementReferenceException ignored) {}
            catch (org.openqa.selenium.WebDriverException e){
                if (!e.getMessage().equals("TypeError: can't access dead object"))
                    throw e;
            }
        } while (System.currentTimeMillis() - start < 10_000);

        throw new RuntimeException("Method not implemented");
    }

    public boolean isUserLoggedOut(){
        //in loop look for start login button and mstr logo icon
        focusOnAddInFrameForBrowser();
        long start = System.currentTimeMillis();
        do {
            try {
                mainPage.findOfficeAddInLogoElem();
                return false;
            } catch (NoSuchElementException ignored){}

            try {
                WebElement startLoginBtn = loginPage.findStartLoginBtn();
                startLoginBtn.click();
                return true;
            } catch (Throwable ignored){}
        } while (System.currentTimeMillis() - start < 20_000);

        throw new RuntimeException("Could not assert if user is logged in or logged out");
    }

    void focusOnPromptPopupFrame() {
        focusOnImportDataPopUpFrame();
        WebElement popupFrame = waitAndFind(PROMPT_POPUP_FRAME_ELEM);
        driver.switchTo().frame(popupFrame);
    }

    public WebElement getAddInOverlayElem(){
        return waitAndFind(ADD_IN_OVERLAY_ELEM);
    }

    public WebElement findAddInOverlayElem(){
        return driver.findElement(ADD_IN_OVERLAY_ELEM);
    }

    public WebElement findAddInRootElem(){
        return driver.findElement(ADD_IN_ROOT_ELEM);
    }

    public ExpectedCondition<Boolean> addInFrameReady(){
        return new ExpectedCondition<Boolean>() {
            @NullableDecl
            @Override
            public Boolean apply(@NullableDecl WebDriver driver) {
                focusOnAddInFrameForBrowser();

                WebElement overlay = getAddInOverlayElem();
                if (Double.parseDouble(overlay.getCssValue("opacity")) != 1)
                    return false;

                try {
                    getMainPage().findDialogOpenNotificationElem();
                    return false;
                } catch (Throwable e) {
                    return true;
                }
            }
        };
    }

    private WebDriver initBrowserType(BrowserType browserType){
        switch (browserType){
            case CHROME:
                System.setProperty("webdriver.chrome.driver", OS.getOSType().equals(OS.MAC) ? "libs/drivers/chromedriver" : "libs/drivers/chromedriver.exe");

                ChromeOptions chromeOptions = new ChromeOptions();
                chromeOptions.setPageLoadStrategy(PageLoadStrategy.NONE);

                return new ChromeDriver(chromeOptions);
            case FIREFOX:
                System.setProperty("webdriver.gecko.driver", OS.getOSType().equals(OS.MAC) ? "libs/drivers/geckodriver" : "libs/drivers/geckodriver.exe");
                return new FirefoxDriver();
            default:
                throw new RuntimeException("Test suite not set up for browser type");
        }
    }
}
