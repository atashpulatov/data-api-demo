package desktop.automation.pages.driver.implementation.mac.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.SUT.FormattingPage;
import org.openqa.selenium.By;

public class FormattingPageMacMachine extends FormattingPage {

    public FormattingPageMacMachine(Machine machine) {
        super(machine);
    }

    @Override
    public WebDriverElemWrapper getFirstTableStyleElem() {
        return machine.waitAndFindElemWrapper(By.xpath(String.format(TABLE_STYLE_ELEM_BASE, 0)));
    }

    @Override
    public boolean isTableStyleElemSelected(WebDriverElemWrapper tableStyleElem) {
        return tableStyleElem.getDriverElement().getAttribute("AXValue").equals("1");
    }
}
