package desktop.automation.driver.wrappers;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import desktop.automation.pages.SUT.prompts.*;
import desktop.automation.pages.driver.implementation.browser.SUT.*;
import desktop.automation.pages.driver.implementation.browser.SUT.prompts.*;
import desktop.automation.pages.driver.implementation.browser.nonSUT.PreSUTPageBrowser;
import org.checkerframework.checker.nullness.compatqual.NullableDecl;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;

import java.util.List;

public class Browser extends Machine {
    public static String addInIframeId = null;
    public static String importPrepareDataIframeId = null;

    public Browser(String host) {
        super(host, DriverType.BROWSER, 10);
    }

    @Override
    protected void initDriver(String host) {
        System.setProperty("webdriver.gecko.driver", OS.getOSType().equals(OS.MAC) ? "libs/drivers/geckodriver" : "libs/drivers/geckodriver.exe");

        //TODO add config parameter for browser type and switch on it here
        driver = new FirefoxDriver();
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

    public void switchToLoginPopUpElem(){
        switchToWindowByIndex(2);
    }

    public void focusOnExcelFrame(){
        driver.switchTo().defaultContent();
        By EXCEL_FRAME_ELEM = By.id("WebApplicationFrame");
        WebElement excelFrame = waitAndFind(EXCEL_FRAME_ELEM, TWO_UNITS);
        driver.switchTo().frame(excelFrame);
    }

    void focusOnAddInFrame(){
        focusOnExcelFrame();
        WebElement addInFrameElem;

        if (addInIframeId == null) {
            addInFrameElem = waitAndFind(By.cssSelector(".AddinIframe"), TWO_UNITS);
            addInIframeId = addInFrameElem.getAttribute("id");
        }

        addInFrameElem = waitAndFind(By.id(addInIframeId));
        driver.switchTo().frame(addInFrameElem);
    }

    void focusOnImportDataPopUpFrame(){
        focusOnExcelFrame();

        List<WebElement> elements;

        long start = System.currentTimeMillis();
        do {
            elements = driver.findElements(By.cssSelector(".AddinIframe"));
        } while (elements.size() < 2 && System.currentTimeMillis() - start < 10_000);

        for (WebElement element : elements) {
            try {
                if (!element.getAttribute("id").equals(addInIframeId)) {
                    importPrepareDataIframeId = element.getAttribute("id");
                    driver.switchTo().frame(element);
                }
            } catch (org.openqa.selenium.StaleElementReferenceException ignored) {}
        }
    }

    void focusOnImportRefreshPopUp(){
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
    }

    public boolean isUserLoggedOut(){
        //in loop look for start login button and mstr logo icon
//        try {
//            Thread.sleep(2_000);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }

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
        By selector = By.cssSelector("#root iframe");
        WebElement popupFrame = waitAndFind(selector);
        driver.switchTo().frame(popupFrame);
    }

    public WebElement getAddInOverlayElem(){
        return waitAndFind(By.id("overlay"));
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

}
