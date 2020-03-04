package desktop.automation.pages.driver.implementation.windows.SUT;

import desktop.automation.driver.wrappers.WindowsMachine;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.SUT.MoreItemMenuPage;
import org.openqa.selenium.WebElement;

import java.util.List;

import static org.junit.Assert.assertEquals;

public class MoreItemMenuPageWindowsMachine extends MoreItemMenuPage {

    public MoreItemMenuPageWindowsMachine(WindowsMachine windowsMachine) {
        super(windowsMachine);
    }

    @Override
    public WebDriverElemWrapper getUserInitialElem() {
        return new WebDriverElemWrapper(getUserDetailListItemElems().get(0));
    }

    @Override
    public WebDriverElemWrapper getUserNameTextElem() {
        return new WebDriverElemWrapper(getUserDetailListItemElems().get(1));
    }

    @Override
    public void assertEmailClientCalled() {
        machine.getMoreItemMenuPage().getEmailClientConfirmationElem();
    }

    @Override
    public void assertUserInitialsAndUserName(String expectedUserName, String expectedUserInitials){
        List<WebElement> userDetailListItemElems = getUserDetailListItemElems();

        String actualUserInitials = userDetailListItemElems.get(1).getText();
        assertEquals(expectedUserInitials, actualUserInitials);

        String actualUserName = userDetailListItemElems.get(2).getText();
        assertEquals(expectedUserName, actualUserName);
    }
}
