package desktop.automation.pages.driver.implementation.windows.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.SUT.FormattingPage;
import org.openqa.selenium.By;

public class FormattingPageWindowsMachine extends FormattingPage {
    private static final By ORANGE_STYLE_ELEM = By.xpath(".//*[contains(@Name,'Orange')]");

    public FormattingPageWindowsMachine(Machine machine) {
        super(machine);
    }

    @Override
    public WebDriverElemWrapper getFirstTableStyleElem() {
        return machine.waitAndFindElemWrapper(TABLE_STYLE_CONTAINER_ELEM).getDriverElement().findElement(ORANGE_STYLE_ELEM);
    }

    @Override
    public boolean isTableStyleElemSelected(WebDriverElemWrapper tableStyleElem) {
        return tableStyleElem.getDriverElement().isSelected();
    }
}
