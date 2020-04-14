package desktop.automation.pages.nonSUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.selectors.SUT.MoreItemsMenuLinkPageSelectors;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.awt.datatransfer.UnsupportedFlavorException;
import java.io.IOException;

public abstract class MoreItemsMenuLinkPage extends MoreItemsMenuLinkPageSelectors {
    protected Machine machine;

    private String privacyPolicyLink1 = "https://www.microstrategy.com/us/legal-folder/privacy-policy";
    private String privacyPolicyLink2 = "https://www.microstrategy.com/legal-folder/privacy-policy";
    private String privacyPolicyLink3 = "microstrategy.com/us/legal-folder/privacy-policy";

    private String termsOfUseLink1 = "https://www.microstrategy.com/us/legal-folder/legal-policies/terms-of-use";
    private String termsOfUseLink2 = "microstrategy.com/us/legal-folder/legal-policies/terms-of-use";
    private String helpLink = "www2.microstrategy.com/producthelp/Current/Office/en-us/Content/home.htm";


    public MoreItemsMenuLinkPage(Machine machine) {
        this.machine = machine;
    }

    public void assertExpectedHelpPageUrlDisplayed() throws IOException, UnsupportedFlavorException {
        assertUrlAsExpected(helpLink);
    }

    public void assertExpectedTermsOfServicePageUrlDisplayed() throws IOException, UnsupportedFlavorException {
        assertUrlAsExpected(termsOfUseLink1, termsOfUseLink2);
    }

    public void assertExpectedPrivacyPolicyPageUrlDisplayed() throws IOException, UnsupportedFlavorException {
        assertUrlAsExpected(privacyPolicyLink1, privacyPolicyLink2, privacyPolicyLink3);
    }

    private void assertUrlAsExpected(String... expectedUrlUrls) throws IOException, UnsupportedFlavorException {
        String actualUrl = getUrl();

        boolean isFound = false;
        for (String expectedUrlUrl : expectedUrlUrls) {
            if ((isFound = actualUrl.equals(expectedUrlUrl)))
                break;
        }

        close();
        if (!isFound) {
            StringBuilder message = new StringBuilder(String.format("Non of the provided expected urls matched the actual.\n" +
                    "Actual: %s\n" +
                    "Expected: ", actualUrl));
            for (String expectedUrlUrl : expectedUrlUrls) {
                message = message.append(expectedUrlUrl);
                message = message.append("\n");
            }

            throw new RuntimeException(message.toString());
        }
    }

    protected abstract String getUrl() throws IOException, UnsupportedFlavorException;

    private WebElement getTaskBarElem() {
        return machine.waitAndFind(TASK_BAR_ELEM);
    }

    protected WebElement getTaskBarCloseElem() {
        return machine.waitAndFind(TASK_BAR_CLOSE_ELEM);
    }

    private WebDriverElemWrapper getCloseConfirmationPopupElem() {
        By selector = By.xpath("/AXApplication[@AXTitle='Firefox']/AXWindow[@AXSubrole='AXStandardWindow']/AXSheet");

        return machine.waitAndFindElemWrapper(selector, machine.HALF_UNIT);
    }

    public void close(){
        machine.contextClickElem(getTaskBarElem());
        try {
            Thread.sleep(1_000);
            getTaskBarCloseElem().click();
            Thread.sleep(1_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
