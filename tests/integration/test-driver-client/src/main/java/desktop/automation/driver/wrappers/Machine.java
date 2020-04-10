package desktop.automation.driver.wrappers;

import desktop.automation.driver.wrappers.enums.DriverType;
import desktop.automation.driver.wrappers.enums.OS;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.exceptions.ImageBasedElemNotFound;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import desktop.automation.pages.SUT.*;
import desktop.automation.pages.SUT.prompts.*;
import desktop.automation.pages.SUT.refresh.popups.ImportingDataSingleRefreshPopUpPage;
import desktop.automation.pages.SUT.refresh.popups.RefreshAllPopUpPage;
import desktop.automation.pages.driver.implementation.browser.nonSUT.PreSUTPageBrowser;
import desktop.automation.pages.driver.implementation.mac.SUT.PrepareDataPromptPageMacMachine;
import desktop.automation.pages.driver.implementation.windows.SUT.PrepareDataPromptPageWindowsMachine;
import desktop.automation.pages.nonSUT.MoreItemsMenuLinkPage;
import desktop.automation.pages.nonSUT.PreSUTPage;
import org.apache.commons.io.FileUtils;
import org.checkerframework.checker.nullness.compatqual.NullableDecl;
import org.opencv.core.CvException;
import org.opencv.core.Mat;
import org.opencv.imgcodecs.Imgcodecs;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.Point;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.RemoteWebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import tools.CompareImages;

import java.awt.*;
import java.awt.datatransfer.DataFlavor;
import java.awt.datatransfer.UnsupportedFlavorException;
import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import static desktop.automation.ConfigVars.*;
import static desktop.automation.exceptions.ElementPresentException.getElementPresentException;

public abstract class Machine {
    private DriverType driverType;
    public WebDriver driver;
    public Actions actions;
    public static BrowserFocusedFrame browserFocusedFrame = null;

    private static final By CHILDREN_ELEMS = By.xpath(".//*");

    private static final String rootImageFolder = "src/test/resources/images/";
    private static String currentDriverRootImageFolder;

    private int unitIntValue;
    public WebDriverWait QUARTER_UNIT;
    public WebDriverWait HALF_UNIT;
    public WebDriverWait ONE_UNIT;
    public WebDriverWait TWO_UNITS;
    public WebDriverWait FOUR_UNITS;
    public WebDriverWait SIX_UNITS;
    public WebDriverWait TWELVE_UNITS;

    PreSUTPage preSUTPage;
    LoginPage loginPage;
    MainPage mainPage;
    MoreItemMenuPage moreItemMenuPage;
    MoreItemsMenuLinkPage moreItemsMenuLinkPage;
    FormattingPage conditionalFormattingPage;
    FormatCellsPromptPage formatCellsPromptPage;
    ImportPromptPage importPromptPage;
    ImportDossierPage importDossierPage;
    PrepareDataPromptPage prepareDataPromptPage;
    ImportingDataSingleRefreshPopUpPage importingDataSingleRefreshPopUpPage;
    RefreshAllPopUpPage refreshAllPopUpPage;
    DataPreviewPage dataPreviewPage;
    ApplicationSelectionPopUpPage applicationSelectionPopUpPage;

    StandardPromptPage standardPromptPage;
    DatePromptPage datePromptPage;
    BigDecimalPromptPage bigDecimalPromptPage;
    NumericPromptPage numericPromptPage;
    TextValuePromptPage textValuePromptPage;
    HierarchyPromptPage hierarchyPromptPage;
    ObjectPromptPage objectPromptPage;
    AttributeElementPromptPage attributeElementPromptPage;
    HierarchyQualificationPromptPage hierarchyQualificationPromptPage;
    MetricQualificationPromptPage metricQualificationPromptPage;
    AttributeQualificationPromptPage attributeQualificationPromptPage;
    MultiplePromptsPage multiplePrompts;

    public Machine(String host, DriverType driverType, int unitIntValue) {
        this.driverType = driverType;
        initDriver(host);
        actions = new Actions(driver);
        initCurrentDriverRootImageFolder(driverType);

        this.unitIntValue = unitIntValue;
        QUARTER_UNIT = new WebDriverWait(driver, unitIntValue / 4);
        HALF_UNIT = new WebDriverWait(driver, unitIntValue / 2);
        ONE_UNIT = new WebDriverWait(driver, unitIntValue);
        TWO_UNITS = new WebDriverWait(driver, unitIntValue * 2);
        FOUR_UNITS = new WebDriverWait(driver, unitIntValue * 4);
        SIX_UNITS = new WebDriverWait(driver, unitIntValue * 6);
        TWELVE_UNITS = new WebDriverWait(driver, unitIntValue * 12);

        if (!SKIP_STANDARD_INITIALIZATION_AND_TEAR_DOWN && DESIRED_DRIVER_TYPE.equals(DriverType.BROWSER))
            ((PreSUTPageBrowser)preSUTPage).getToExcelInitialPage(EXCEL_USER_NAME, EXCEL_USER_PASS);
    }

    private void initCurrentDriverRootImageFolder(DriverType driverType){
        String subfolder;
        switch (driverType){
            case BROWSER:
                subfolder = "browser/";
                break;
            case MAC_DESKTOP:
                subfolder = "mac/";
                break;
            case WINDOWS_DESKTOP:
                subfolder = "windows/";
                break;
            default:
                throw new NotImplementedForDriverWrapperException();
        }

        currentDriverRootImageFolder = rootImageFolder + subfolder;
    }

    public static String getCurrentDriverRootImageFolder() {
        return currentDriverRootImageFolder;
    }

    protected abstract void initDriver(String host);

    public RemoteWebElement waitAndFind(By selector){
        return waitAndFind(selector, ONE_UNIT);
    }

    public WebElement waitAndFind(By[] selectors) {
        return waitAndFind(selectors, unitIntValue);
    }

    public WebElement waitAndFind(By[] selectors, int secondsToWaitFor) {
        long start = System.currentTimeMillis();

        int i = 0;
        while (true) {
            i %= selectors.length;
            By selector = selectors[i++];

            try {
                return driver.findElement(selector);
            } catch (org.openqa.selenium.NoSuchElementException e) {
                if (System.currentTimeMillis() - start > secondsToWaitFor * 1000)
                    throw e;
            }
        }
    }

    public RemoteWebElement waitAndFind(By selector, WebDriverWait wait){
        //time measurement was initially set for debugging purposes, but decided to leave it
        long start = System.currentTimeMillis();

        RemoteWebElement res = (RemoteWebElement) wait.until(ExpectedConditions.visibilityOfElementLocated(selector));
        long diff = System.currentTimeMillis() - start;
        System.out.println(diff / 1000 + String.format(",%3d", diff % 1000).replace(' ', '0'));

        return res;
    }

    public WebDriverElemWrapper waitAndFindElemWrapper(By selector){
        return waitAndFindElemWrapper(selector, ONE_UNIT);
    }

    public WebDriverElemWrapper waitAndFindElemWrapper(By selector, WebDriverWait wait) {
        return new WebDriverElemWrapper(waitAndFind(selector, wait));
    }

    public WebDriverElemWrapper waitAndFindElemWrapper(By[] selectors) {
        return waitAndFindElemWrapper(selectors, unitIntValue);
    }

    public WebDriverElemWrapper waitAndFindElemWrapper(By[] selectors, int secondsToWaitFor){
        long start = System.currentTimeMillis();

        int i = 0;
        while (true) {
            i %= selectors.length;
            By selector = selectors[i++];

            try {
                return new WebDriverElemWrapper(driver.findElement(selector));
            } catch (org.openqa.selenium.NoSuchElementException e) {
                if (System.currentTimeMillis() - start > secondsToWaitFor * 1000)
                    throw e;
            }
        }
    }

    public void assertNotPresent(By selector){
        try {
            WebElement elem = driver.findElement(selector);

            if (!isBrowser() || elem.isDisplayed())
                throw getElementPresentException(selector, elem);
        } catch (org.openqa.selenium.NoSuchElementException ignored){ }
    }

    public List<WebElement> getChildren(RemoteWebElement parent){
        return parent.findElements(CHILDREN_ELEMS);
    }

    public List<WebDriverElemWrapper> getChildrenElemWrapper(RemoteWebElement parent){
        List<WebElement> children = getChildren(parent);
        List<WebDriverElemWrapper> res = new LinkedList<>();

        for (WebElement child : children)
            res.add(new WebDriverElemWrapper(child));

        return res;
    }

    public void printChildren(RemoteWebElement parent) {
        List<WebElement> res = getChildren(parent);
        printChildren(res);
    }

    public List<WebElement> printChildren(List<WebElement> children) {
        int i = 0;
        for (WebElement child : children) {
            System.out.println("child: " + i++);
            System.out.println("text: " + child.getText());
            System.out.println("tag name: " + child.getTagName());
            System.out.println("location: " + child.getLocation());
            System.out.println("Size: " + child.getSize());
            System.out.println();
        }

        return children;
    }

    public void contextClickElem(WebElement element){
        actions.click(element)
                .contextClick()
                .perform();
    }

    public void doubleClickElem(WebElement element){
        actions.click(element)
                .doubleClick()
                .perform();
    }

    public List<WebElement> iterateOverBase(String base, int start, int end) {
        List<WebElement> res = new LinkedList<>();
        for (int i = start; i < end; i++){
            try {
                String selector = String.format(base, i);
                WebElement resEntry = waitAndFind(By.xpath(selector), ONE_UNIT);
                res.add(resEntry);
            } catch (Exception ignored) {}
        }

        return res;
    }

    public List<WebElement> iterateOverBaseUntilExceptionEncountered(String base) {
        List<WebElement> res = new LinkedList<>();

        try {
            int i = 0;
            String selector = String.format(base, i++);
            WebElement tmp = waitAndFind(By.xpath(selector), ONE_UNIT);
            res.add(tmp);

            while (true) {
                selector = String.format(base, i++);
                tmp = waitAndFind(By.xpath(selector), QUARTER_UNIT);
                res.add(tmp);
            }
        } catch (Exception ignored) {}

        return res;
    }


    public PreSUTPage getPreSUTPage() {
        return preSUTPage;
    }

    public LoginPage getLoginPage() {
        return loginPage;
    }

    public MainPage getMainPage() {
        return mainPage;
    }

    public PrepareDataPromptPage getPrepareDataPromptPage() {
        return prepareDataPromptPage;
    }

    public ImportingDataSingleRefreshPopUpPage getImportingDataSingleRefreshPopUpPage() {
        return importingDataSingleRefreshPopUpPage;
    }

    public RefreshAllPopUpPage getRefreshAllPopUpPage() {
        return refreshAllPopUpPage;
    }

    public PrepareDataPromptPageMacMachine getPrepareDataPromptPageMacMachine() {
        return (PrepareDataPromptPageMacMachine) prepareDataPromptPage;
    }

    public PrepareDataPromptPageWindowsMachine getPrepareDataPromptPageWindowsMachine() {
        return (PrepareDataPromptPageWindowsMachine) prepareDataPromptPage;
    }

    public DataPreviewPage getDataPreviewPage() {
        return dataPreviewPage;
    }

    public ApplicationSelectionPopUpPage getApplicationSelectionPopUpPage() {
        return applicationSelectionPopUpPage;
    }

    public ImportPromptPage getImportPromptPage() {
        return importPromptPage;
    }

    public ImportDossierPage getImportDossierPage() {
        return importDossierPage;
    }

    public DatePromptPage getDatePromptPage() {
        return datePromptPage;
    }

    public StandardPromptPage getStandardPromptPage() {
        return standardPromptPage;
    }

    public BigDecimalPromptPage getBigDecimalPromptPage() {
        return bigDecimalPromptPage;
    }

    public NumericPromptPage getNumericPromptPage() {
        return numericPromptPage;
    }

    public TextValuePromptPage getTextValuePromptPage() {
        return textValuePromptPage;
    }

    public HierarchyPromptPage getHierarchyPromptPage() {
        return hierarchyPromptPage;
    }

    public ObjectPromptPage getObjectPromptPage() {
        return objectPromptPage;
    }

    public AttributeElementPromptPage getAttributeElementPromptPage() {
        return attributeElementPromptPage;
    }

    public HierarchyQualificationPromptPage getHierarchyQualificationPromptPage() {
        return hierarchyQualificationPromptPage;
    }

    public MetricQualificationPromptPage getMetricQualificationPromptPage() {
        return metricQualificationPromptPage;
    }

    public AttributeQualificationPromptPage getAttributeQualificationPromptPage() {
        return attributeQualificationPromptPage;
    }

    public MultiplePromptsPage getMultiplePromptsPage() {
        return multiplePrompts;
    }

    public FormattingPage getFormattingPage(){
        return conditionalFormattingPage;
    }

    public FormatCellsPromptPage getFormatCellsPromptPage() {
        return formatCellsPromptPage;
    }

    public MoreItemMenuPage getMoreItemMenuPage() {
        return moreItemMenuPage;
    }

    public MoreItemsMenuLinkPage getMoreItemsMenuLinkPage() {
        return moreItemsMenuLinkPage;
    }

    public DriverType getDriverType() {
        return driverType;
    }

    public WebDriver getDriver() {
        return driver;
    }


    public abstract boolean isButtonEnabled(WebElement button);

    public void assertThatCellsAreBold(String[] cells){
        try {
            getMainPage().getBoldToggleButton();
        } catch (Throwable e) {
            getPreSUTPage().getHomeTabElem().click();
        }
        getMainPage().assertThatCellsAreBolded(cells);
    }

    public String takeScreenshot(String fileName, WebElement element, int diffLeft, int diffRight, int diffTop, int diffBottom) throws IOException{
        Mat screenshotCroppedByElement = getElementMat(fileName, element, diffLeft, diffRight, diffTop, diffBottom);

        Imgcodecs.imwrite(WindowsMachine.getCurrentDriverRootImageFolder() + fileName + ".png", screenshotCroppedByElement);

        return WindowsMachine.getCurrentDriverRootImageFolder() + fileName + ".png";
    }

    //crops to the element the element.getScreenshot method sometimes crashes
    public String takeScreenshot(String fileName, WebElement element) throws IOException {
        return takeScreenshot(fileName, element, 0, 0, 0, 0);
    }

    public String takeScreenshot(String fileName) throws IOException {
        File src= ((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE);
        File file = new File(
                getCurrentDriverRootImageFolder() +
                        (fileName == null ? new Date().toInstant().toString() : fileName) +
                        ".png"
        );

        FileUtils.copyFile(src, file);

        if (DEBUG_IMAGE_COMPARISON)
            System.out.println("Screenshot full path: " + file.getAbsolutePath());

        return file.getAbsolutePath();
    }

    public Mat getElementMat(String fileName, WebElement element) throws IOException {
        return getElementMat(fileName, element, 0, 0, 0, 0);
    }

    public Mat getElementMat(String fileName, WebElement element, int diffLeft, int diffRight, int diffTop, int diffBottom) throws IOException {
        Point loc = element.getLocation();
        Dimension size = element.getSize();

        Mat res;
        try {
            res = CompareImages.getSubMat(Imgcodecs.imread(takeScreenshot(fileName)),
                    loc.getX() + diffLeft,
                    loc.getX() + size.getWidth() - diffRight,
                    loc.getY() + diffTop,
                    loc.getY() + size.getHeight() - diffBottom);
        } catch (CvException e){
            new File(getCurrentDriverRootImageFolder() + fileName + ".png").delete();

            throw e;
        }

        return res;
    }

    public void takeElementScreenshotWithDetails(WebElement element, String screenshotName) throws IOException {
        takeElementScreenshotWithDetails(element, screenshotName, 0, 0, 0, 0);
    }

    public void takeElementScreenshotWithDetails(WebElement element, String screenshotName, int diffLeft, int diffRight, int diffTop, int diffBottom) throws IOException {
        Point loc = element.getLocation();
        Dimension size = element.getSize();
        takeScreenshot(screenshotName, element, diffLeft, diffRight, diffTop, diffBottom);

        System.out.format("Screenshot of element taken with fileName: %s\n" +
                        "At coordinates: startX: %d, endX: %d, startY: %d, endY: %d\n",
                screenshotName, loc.getX(), loc.getX() + size.getWidth(), loc.getY(), loc.getY() + size.getHeight());
    }

    public WebDriverElemWrapper takeElementScreenshotWithDetailsAndReturnElem(WebElement element, String screenshotName) {
        return takeElementScreenshotWithDetailsAndReturnElem(element, screenshotName, 0, 0, 0, 0);
    }

    public WebDriverElemWrapper takeElementScreenshotWithDetailsAndReturnElem(WebElement element, String screenshotName, int diffLeft, int diffRight, int diffTop, int diffBottom){
        try {
            takeElementScreenshotWithDetails(element, screenshotName,diffLeft ,diffRight, diffTop, diffBottom);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new WebDriverElemWrapper(element);
    }

    public void clickObject(WebElement root){
        actions.moveToElement(root)
                .click()
                .perform();
    }

    public void clickObjectWithOffset(WebElement root, int xOffset, int yOffset){
        actions.moveToElement(root, xOffset, yOffset)
                .click()
                .perform();
    }

    public int getUnitIntValue() {
        return unitIntValue;
    }

    public String getStringClipboardContent() throws IOException, UnsupportedFlavorException {
        return (String) Toolkit.getDefaultToolkit().getSystemClipboard().getData(DataFlavor.stringFlavor);
    }

    public static String[] getObjectNameArrayFromImportedObjectList(List<ImportedObjectInList> importedObjectInLists) {
        String[] res = new String[importedObjectInLists.size()];

        for (int i = 0; i < res.length; i++)
            res[i] = importedObjectInLists.get(i).getName();

        return res;
    }

    public void focusOnExcelFrameForBrowser(){
        if (driverType.equals(DriverType.BROWSER) && (browserFocusedFrame == null || !browserFocusedFrame.equals(BrowserFocusedFrame.EXCEL))) {
            ((Browser) this).focusOnExcelFrame();
            browserFocusedFrame = BrowserFocusedFrame.EXCEL;
        }
    }

    public void focusOnAddInFrameForBrowser(){
        if (isBrowser() && (browserFocusedFrame == null || !browserFocusedFrame.equals(BrowserFocusedFrame.ADD_IN))) {
            ((Browser) this).focusOnAddInFrame();
            browserFocusedFrame = BrowserFocusedFrame.ADD_IN;
        }
    }

    public void focusOnImportDataPopUpFrameForBrowser(){
        if (isBrowser() && (browserFocusedFrame == null || !browserFocusedFrame.equals(BrowserFocusedFrame.IMPORT_DATA_POPUP))) {
            ((Browser) this).focusOnImportDataPopUpFrame();
            browserFocusedFrame = BrowserFocusedFrame.IMPORT_DATA_POPUP;
        }
    }

    public void focusOnImportRefreshPopUpFrameForBrowser(){
        if (isBrowser() && (browserFocusedFrame == null || !browserFocusedFrame.equals(BrowserFocusedFrame.IMPORT_REFRESH_POPUP))){
            ((Browser)this).focusOnImportRefreshPopUp();
            browserFocusedFrame = BrowserFocusedFrame.IMPORT_REFRESH_POPUP;
        }
    }

    public void focusOnPromptPopUpFrameForBrowser(){
        if (isBrowser() && (browserFocusedFrame == null || !browserFocusedFrame.equals(BrowserFocusedFrame.PROMPT_POPUP))) {
            ((Browser) this).focusOnPromptPopupFrame();
            browserFocusedFrame = BrowserFocusedFrame.PROMPT_POPUP;
        }
    }

    public boolean isBrowser(){
        return this instanceof Browser;
    }

    public boolean isMacMachine(){
        return this instanceof MacMachine;
    }

    public boolean isWindowsMachine(){
        return this instanceof WindowsMachine;
    }

    public void waitForAddInFrameReadyForBrowser() {
        waitForAddInFrameReadyForBrowser(ONE_UNIT);
    }

    public void waitForAddInFrameReadyForBrowser(WebDriverWait wait){
        if (isBrowser()) {
            ExpectedCondition<Boolean> addInFrameReadyCondition = ((Browser)this).addInFrameReady();
            wait.until(addInFrameReadyCondition);
        }
    }

    public WebDriverElemWrapper waitAndFindInElement(WebElement parent, By childSelector) {
        return waitAndFindInElement(parent, childSelector, ONE_UNIT);
    }

    public WebDriverElemWrapper waitAndFindInElement(WebElement parent, By childSelector, WebDriverWait wait){
        ExpectedCondition<WebElement> findElementInElementExpectedCondition = findElementInElementExpectedCondition(parent, childSelector);
        return new WebDriverElemWrapper(wait.until(findElementInElementExpectedCondition));
    }

    private ExpectedCondition<WebElement> findElementInElementExpectedCondition(WebElement parent, By childSelector){
        return new ExpectedCondition<WebElement>() {
            @NullableDecl
            @Override
            public WebElement apply(@NullableDecl WebDriver webDriver) {
                return parent.findElements(childSelector).get(0);
            }
        };
    }

    public void sendSelectAll(){
        sendCommandKey("a");
    }

    public void sendCopyToClipboard(){
        sendCommandKey("c");
    }

    public void sendPaste(){
        sendCommandKey("v");
    }

    private void sendCommandKey(String keys) {
        Keys commandKey;
        OS os = OS.getOSType();
        if (os.equals(OS.MAC)){
            commandKey = Keys.COMMAND;
        }
        else if (os.equals(OS.WINDOWS)) {
            commandKey = Keys.CONTROL;
        }
        else
            throw new RuntimeException("Unrecognized OS");

        actions.keyDown(commandKey)
                .pause(500)
                .sendKeys(keys)
                .pause(500)
                .keyDown(commandKey)
                .perform();
    }

    public AnyInterfaceElement getImageComparisonElemFallBackToWebDriver(By selector, String image, int startX, int endX, int startY, int endY){
        try {
            return new ImageComparisonElem(image, startX, endX, startY, endY);
        } catch (ImageBasedElemNotFound e){
            WebDriverElemWrapper res = waitAndFindElemWrapper(selector);
            return takeElementScreenshotWithDetailsAndReturnElem(res.getDriverElement(), image);
        }
    }
}
