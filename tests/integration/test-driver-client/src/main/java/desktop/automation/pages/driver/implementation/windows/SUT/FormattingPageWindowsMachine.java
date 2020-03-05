package desktop.automation.pages.driver.implementation.windows.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.SUT.FormattingPage;
import org.openqa.selenium.By;

public class FormattingPageWindowsMachine extends FormattingPage {

    public FormattingPageWindowsMachine(Machine machine) {
        super(machine);
    }

    @Override
    public WebDriverElemWrapper getFirstTableStyleElem() {
        return machine.waitAndFindElemWrapper(TABLE_STYLE_CONTAINER_ELEM).getDriverElement().findElement(By.xpath(".//*[contains(@Name,'Orange')]"));
    }

    @Override
    public boolean isTableStyleElemSelected(WebDriverElemWrapper tableStyleElem) {
        return tableStyleElem.getDriverElement().isSelected();
    }
}
