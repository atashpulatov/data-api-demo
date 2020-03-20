package desktop.automation.pages.driver.implementation.mac.SUT;

import desktop.automation.driver.wrappers.MacMachine;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.SUT.MoreItemMenuPage;
import desktop.automation.pages.driver.implementation.mac.nonSUT.PreSUTPageMacMachine;
import org.openqa.selenium.By;

import static org.junit.Assert.assertEquals;

public class MoreItemMenuPageMacMachine extends MoreItemMenuPage {
    By EMAIL_CLIENT_IN_DOCK = By.xpath("/AXApplication[@AXTitle='Dock']/AXList[0]/AXDockItem[@AXTitle='Mail' and @AXSubrole='AXApplicationDockItem']");

    public MoreItemMenuPageMacMachine(MacMachine machine) {
        super(machine);
    }

    @Override
    public WebDriverElemWrapper getUserInitialElem() {
        return machine.waitAndFindElemWrapper(USER_INITIAL_TEXT_ELEM);
    }

    @Override
    public WebDriverElemWrapper getUserNameTextElem() {
        return machine.waitAndFindElemWrapper(USER_NAME_TEXT_ELEM);
    }

    @Override
    public void assertEmailClientCalled() {
        WebDriverElemWrapper webDriverElemWrapper = machine.waitAndFindElemWrapper(EMAIL_CLIENT_IN_DOCK);
        machine.contextClickElem(webDriverElemWrapper.getDriverElement());
        ((PreSUTPageMacMachine)machine.getPreSUTPage()).getContextMenuQuitBtnElem().click();
        try {
            Thread.sleep(1_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void assertUserInitialsAndUserName(String expectedUserName, String expectedUserInitials){
        assertEquals(expectedUserInitials, getUserInitialElem().getText());
        assertEquals(expectedUserName, getUserNameTextElem().getText());
    }
}
