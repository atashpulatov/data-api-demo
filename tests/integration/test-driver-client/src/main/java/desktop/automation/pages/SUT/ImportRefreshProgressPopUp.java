package desktop.automation.pages.SUT;

import desktop.automation.driver.wrappers.WindowsMachine;
import org.openqa.selenium.By;
import org.openqa.selenium.remote.RemoteWebElement;

public class ImportRefreshProgressPopUp {
    private WindowsMachine windowsMachine;

    private static final By IMPORTING_DATA_MESSAGE_ELEM = By.name("Importing data");

    public ImportRefreshProgressPopUp(WindowsMachine windowsMachine) {
        this.windowsMachine = windowsMachine;
    }

    public RemoteWebElement getImportingDataMessageElem(){
        return windowsMachine.waitAndFind(IMPORTING_DATA_MESSAGE_ELEM);
    }
}
