package desktop.automation.elementWrappers.driver.implementations.windows;

import org.openqa.selenium.WebElement;

import static org.junit.Assert.assertEquals;


public class BrowserAdressBar extends WebElementWithGetValue {
    private String privacyPolicyLink1 = "https://www.microstrategy.com/us/legal-folder/privacy-policy";
    private String privacyPolicyLink2 = "https://www.microstrategy.com/legal-folder/privacy-policy";
    private String privacyPolicyLink3 = "microstrategy.com/us/legal-folder/privacy-policy";

    private String termsOfUseLink1 = "https://www.microstrategy.com/us/legal-folder/legal-policies/terms-of-use";
    private String termsOfUseLink2 = "microstrategy.com/us/legal-folder/legal-policies/terms-of-use";
    private String helpLink = "www2.microstrategy.com/producthelp/Current/Office/en-us/Content/home.htm";

    public BrowserAdressBar(WebElement element) {
        super(element);
    }

    public String getURL(){
        return getValue();
    }

    public void assertPrivacyPolicyPageLoaded() {
        String urlStr = getURL();

        try {
            assertEquals(privacyPolicyLink1, urlStr);
        } catch (org.junit.ComparisonFailure e) {
            try {
                assertEquals(privacyPolicyLink2, urlStr);
            } catch (org.junit.ComparisonFailure e1) {
                assertEquals(privacyPolicyLink3, urlStr);
            }
        }
    }

    public void assertTermsOfUsePageLoaded() {
        String urlStr = getURL();
        try {
            assertEquals(termsOfUseLink1, urlStr);
        } catch (org.junit.ComparisonFailure e) {
            assertEquals(termsOfUseLink2, urlStr);
        }
    }

    public void assertHelpPageLoaded(){
        assertEquals(helpLink, getURL());
    }
}
