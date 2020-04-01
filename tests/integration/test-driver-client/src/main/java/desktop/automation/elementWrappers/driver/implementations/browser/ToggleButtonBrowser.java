package desktop.automation.elementWrappers.driver.implementations.browser;

import desktop.automation.elementWrappers.ToggleButton;
import desktop.automation.elementWrappers.WebDriverElemWrapper;

public class ToggleButtonBrowser extends ToggleButton {

    public ToggleButtonBrowser(WebDriverElemWrapper element) {
        super(element);
    }

    @Override
    public boolean isOn() {
        String isPressedAttr = element.getDriverElement().getAttribute("aria-pressed");
        return Boolean.parseBoolean(isPressedAttr);
    }
}
