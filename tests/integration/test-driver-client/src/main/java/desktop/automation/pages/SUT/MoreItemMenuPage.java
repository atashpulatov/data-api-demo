package desktop.automation.pages.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.selectors.SUT.MoreItemsMenuPageSelectors;
import org.openqa.selenium.WebElement;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static desktop.automation.ConfigVars.EXCEL_ADD_IN_TEST_USER_INITIALS;
import static desktop.automation.ConfigVars.EXCEL_ADD_IN_TEST_USER_NAME;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public abstract class MoreItemMenuPage extends MoreItemsMenuPageSelectors {
    protected Machine machine;

    public MoreItemMenuPage(Machine machine) {
        this.machine = machine;
    }

    public List<WebElement> getUserDetailListItemElems(){
        List<WebElement> elems = machine.getChildren(machine.waitAndFind(USER_DETAIL_LIST_ITEM_ELEM));

        return elems;
    }

    public abstract void assertUserInitialsAndUserName(String expectedUserName, String expectedUserInitials);

    public abstract WebDriverElemWrapper getUserInitialElem();

    public abstract WebDriverElemWrapper getUserNameTextElem();

    public WebElement getClearDataBtnElem(){
        return machine.waitAndFind(CLEAR_DATA_BTN_ELEM);
    }

    public WebDriverElemWrapper getManageApplicationsBtnElem(){
        return machine.waitAndFindElemWrapper(MANAGE_APPLICATIONS_BTN_ELEM);
    }

    public WebElement getPrivacyPolicyBtnElem() {
        return machine.waitAndFind(PRIVACY_POLICY_BTN_ELEM);
    }

    public WebElement getTermsOfUseBtnElem() {
        return machine.waitAndFind(TERMS_OF_USE_BTN_ELEM);
    }

    public WebElement getHelpBtnElem() {
        return machine.waitAndFind(HELP_BTN_ELEM);
    }

    public WebElement getContacUsBtnElem() {
        return machine.waitAndFind(CONTACT_US_BTN_ELEM);
    }

    public WebElement getEmailClientConfirmationElem(){
        return machine.waitAndFind(EMAIL_CLIENT_CONFIRMATION_ELEM);
    }

    public WebElement getEmailPopUpTitleElem(){
        return machine.waitAndFind(EMAIL_POP_UP_TITLE_ELEM);
    }

    public WebElement getLogOutBtnElem() {
        machine.focusOnAddInFrameForBrowser();
        return machine.waitAndFind(LOGOUT_BTN_ELEM);
    }

    public WebElement getVersionNumberElem() {
        return machine.waitAndFind(VERSION_ELEM);
    }

    public void assertClearDataTitleIsCorrect(){
        String expected = "Are you sure you want to Clear Data?";
        assertEquals(expected, getClearDataTitleStr());
    }

    public String getClearDataTitleStr(){
        StringBuilder res = new StringBuilder();
        res.append(getClearDataTitlePartOneElem().getText());
        res.append(getClearDataTitlePartTwoElem().getText());
        res.append(getClearDataTitlePartThreeElem().getText());

        return res.toString();
    }

    public WebElement getClearDataTitlePartOneElem(){
        return machine.waitAndFind(CLEAR_DATA_TITLE_PART_ONE);
    }

    public WebElement getClearDataTitlePartTwoElem(){
        return machine.waitAndFind(CLEAR_DATA_TITLE_PART_TWO);
    }

    public WebElement getClearDataTitlePartThreeElem(){
        return machine.waitAndFind(CLEAR_DATA_TITLE_PART_THREE);
    }

    public void assertClearDataMessageIsCorrect(){
        String expected = "This removes all MicroStrategy data from the workbook.\n" +
                "In order to re-import the data, you will have to click the View Data button, which will appear in the add-in panel.";
        assertEquals(expected, getClearDataMessageStr());
    }

    public String getClearDataMessageStr(){
        StringBuilder res = new StringBuilder();
        res.append(getClearDataMessagePartOneElem().getText());
        res.append('\n');
        res.append(getClearDataMessagePartTwoElem().getText());
        res.append(getClearDataMessagePartThreeElem().getText());
        res.append(getClearDataMessagePartFourElem().getText());

        return res.toString();
    }

    public WebElement getClearDataMessagePartOneElem(){
        return machine.waitAndFind(CLEAR_DATA_MESSAGE_PART_ONE);
    }

    public WebElement getClearDataMessagePartTwoElem(){
        return machine.waitAndFind(CLEAR_DATA_MESSAGE_PART_TWO);
    }

    public WebElement getClearDataMessagePartThreeElem(){
        return machine.waitAndFind(CLEAR_DATA_MESSAGE_PART_THREE);
    }

    public WebElement getClearDataMessagePartFourElem(){
        return machine.waitAndFind(CLEAR_DATA_MESSAGE_PART_FOUR);
    }

    public void assertClearDataOKBtnNotPresent(){
        machine.assertNotPresent(CLEAR_DATA_OK_BTN);
    }

    public WebElement getClearDataOKBtnElem(){
        return machine.waitAndFind(CLEAR_DATA_OK_BTN);
    }

    public WebElement getClearDataCancelBtnElem(){
        return machine.waitAndFind(CLEAR_DATA_CANCEL_BTN);
    }

    public void assertMenuLoadedCorrectly(){
        assertEquals(EXCEL_ADD_IN_TEST_USER_INITIALS, getUserInitialElem().getText());
        assertEquals(EXCEL_ADD_IN_TEST_USER_NAME, getUserNameTextElem().getText());

        getClearDataBtnElem();
        getPrivacyPolicyBtnElem();
        getTermsOfUseBtnElem();
        getHelpBtnElem();
        getContacUsBtnElem();
        getLogOutBtnElem();
        assertVersionIsOfCorrectForm();
    }

    public void assertVersionIsOfCorrectForm(){
        Pattern p = Pattern.compile("^Version \\d{2}\\.\\d\\.\\d{4}\\.\\d+$");
        Matcher m = p.matcher(getVersionNumberElem().getText());
        assertTrue(m.matches());
    }

    public abstract void assertEmailClientCalled();

}
