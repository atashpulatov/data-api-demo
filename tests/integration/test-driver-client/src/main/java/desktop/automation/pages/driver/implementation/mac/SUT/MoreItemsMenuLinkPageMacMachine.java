package desktop.automation.pages.driver.implementation.mac.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.driver.implementation.mac.nonSUT.PreSUTPageMacMachine;
import desktop.automation.pages.nonSUT.MoreItemsMenuLinkPage;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

import java.awt.datatransfer.UnsupportedFlavorException;
import java.io.IOException;

public class MoreItemsMenuLinkPageMacMachine extends MoreItemsMenuLinkPage {

    public MoreItemsMenuLinkPageMacMachine(Machine machine) {
        super(machine);
    }

    @Override
    protected String getUrl() throws IOException, UnsupportedFlavorException {
        By root = By.xpath("/AXApplication[@AXTitle='Firefox']/AXWindow[@AXSubrole='AXStandardWindow']");
        WebElement remoteWebElement = machine.waitAndFind(root);

        new Actions(machine.getDriver())
                .moveToElement(remoteWebElement, 0, 0)
                .moveByOffset(400, 60)
                //The time for the url string to appear in the url input bar
                .pause(3_000)
                .click()
                .keyDown(Keys.COMMAND)
                .pause(500)
                .sendKeys("ac")
                .keyUp(Keys.COMMAND)
                .perform();

        return machine.getStringClipboardContent();
    }

    //alternative method the Toolkit java object method,
    //can be utilized in case issues encountered with Toolkit object implementation
    //in case after prolonged usage the Toolkit reliability is asserted then remove this method
    private String getClipboardContentUtilizingExcelFormulaBar(){
        ((PreSUTPageMacMachine)machine.getPreSUTPage()).getExcelInDockElem().click();
        By xpath = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXTextArea[@AXIdentifier='XLFormulaEditor']");
        WebDriverElemWrapper webDriverElemWrapper = machine.waitAndFindElemWrapper(xpath);
        machine.clickObject(webDriverElemWrapper.getDriverElement());
        machine.actions
                .keyDown(Keys.COMMAND)
                .pause(500)
                .sendKeys("v")
                .keyUp(Keys.COMMAND)
                .pause(1_000)
                .perform();

        String raw  = webDriverElemWrapper.getDriverElement().getAttribute("AXDescription");
        int start = raw.indexOf("A,1") + 4;
        return raw.substring(start).trim();
    }
}
