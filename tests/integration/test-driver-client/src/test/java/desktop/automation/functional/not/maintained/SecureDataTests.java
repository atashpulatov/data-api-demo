package desktop.automation.functional.not.maintained;

import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;

import java.awt.datatransfer.UnsupportedFlavorException;
import java.io.IOException;

public class SecureDataTests extends BaseLoggedInTests {

    //TC48799
    @Test
    public void privacyPolicy() throws IOException, UnsupportedFlavorException {
        machine.getMainPage().getMoreItemsMenuElem().click();

        machine.getMoreItemMenuPage().getPrivacyPolicyBtnElem().click();

        machine.getMoreItemsMenuLinkPage().assertExpectedPrivacyPolicyPageUrlDisplayed();
    }

    //TC55713
    @Test
    public void termsOfService() throws IOException, UnsupportedFlavorException {
        machine.getMainPage().getMoreItemsMenuElem().click();

        machine.getMoreItemMenuPage().getTermsOfUseBtnElem().click();

        machine.getMoreItemsMenuLinkPage().assertExpectedTermsOfServicePageUrlDisplayed();
    }

    //TC55714
    @Test
    public void help() throws IOException, UnsupportedFlavorException {
        machine.getMainPage().getMoreItemsMenuElem().click();

        machine.getMoreItemMenuPage().getHelpBtnElem().click();

        machine.getMoreItemsMenuLinkPage().assertExpectedHelpPageUrlDisplayed();
    }

    //TC55715
    @Test
    public void contactUs() throws IOException {
        machine.getMainPage().getMoreItemsMenuElem().click();

        machine.getMoreItemMenuPage().assertMenuLoadedCorrectly();

        machine.getMoreItemMenuPage().getContacUsBtnElem().click();
        machine.getMoreItemMenuPage().assertEmailClientCalled();

        AnyInterfaceElement moreItemsMenuBtn = machine.getMainPage().getMoreItemsMenuElem();
        moreItemsMenuBtn.clickExplicitlyByActionClass();

        machine.getMoreItemMenuPage().getLogOutBtnElem().click();

        machine.getLoginPage().getStartLoginBtnElem();
    }

}
