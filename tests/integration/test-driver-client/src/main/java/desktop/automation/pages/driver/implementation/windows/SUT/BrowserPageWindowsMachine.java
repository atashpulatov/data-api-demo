package desktop.automation.pages.driver.implementation.windows.SUT;

import desktop.automation.driver.wrappers.WindowsMachine;
import desktop.automation.elementWrappers.windows.BrowserAdressBar;
import desktop.automation.pages.nonSUT.BrowserPage;
import org.openqa.selenium.By;

public class BrowserPageWindowsMachine extends BrowserPage {
    private static final By ADDRESS_BAR_ELEM = By.name("Address and search bar");

    public BrowserPageWindowsMachine(WindowsMachine machine) {
        super(machine);
    }

    @Override
    protected String getUrl(){
        return new BrowserAdressBar(machine.waitAndFind(ADDRESS_BAR_ELEM)).getURL();
    }
}
