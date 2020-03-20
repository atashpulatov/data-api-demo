package desktop.automation.pages.driver.implementation.browser.nonSUT;

import desktop.automation.driver.wrappers.Browser;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import desktop.automation.pages.nonSUT.PreSUTPage;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class PreSUTPageBrowser extends PreSUTPage {
    private static final By USERNAME_INPUT_FIELD = By.id("i0116");
    private static final By NEXT_BTN = By.id("idSIButton9");
    private static final By PASSWORD_FIELD = By.id("i0118");
    private static final By SIGN_IN_BTN = By.id("idSIButton9");
    private static final By YES_BTN = By.id("idSIButton9");

    public PreSUTPageBrowser(Browser browser) {
        super(browser);
    }

    public void getToExcelInitialPage(String username, String password){
        getExcelUserNameInputElem().sendKeys(username);
        getExcelUserNameNextBtnElem().click();

        getExcelPasswordInputElem().sendKeys(password);
        getExcelPasswordSignInElem().click();

        getExcelStaySignedInYesBtnElem().click();
    }

    public WebDriverElemWrapper getExcelUserNameInputElem(){
        return machine.waitAndFindElemWrapper(USERNAME_INPUT_FIELD);
    }

    public WebDriverElemWrapper getExcelUserNameNextBtnElem(){
        return machine.waitAndFindElemWrapper(NEXT_BTN);
    }

    public WebDriverElemWrapper getExcelPasswordInputElem(){
        return machine.waitAndFindElemWrapper(PASSWORD_FIELD);
    }

    public WebDriverElemWrapper getExcelPasswordSignInElem(){
        return machine.waitAndFindElemWrapper(SIGN_IN_BTN);
    }

    public WebDriverElemWrapper getExcelStaySignedInYesBtnElem(){
        return machine.waitAndFindElemWrapper(YES_BTN);
    }

    @Override
    public WebDriverElemWrapper getSheetTabElemByIndex(int index) {
        machine.focusOnExcelFrameForBrowser();
        By selector = By.cssSelector(String.format(SHEET_BTN_BASE_BY_INDEX, index));
        machine.ONE_UNIT.until(ExpectedConditions.elementToBeClickable(selector));
        return machine.waitAndFindElemWrapper(selector);
    }

    @Override
    public void openFormatCellsPromptPage() {
        throw new NotImplementedForDriverWrapperException();
    }
}
