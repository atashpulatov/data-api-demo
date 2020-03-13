package desktop.automation.elementWrappers.mac.FontControls;

import desktop.automation.elementWrappers.mac.enums.FontValue;
import org.openqa.selenium.WebElement;

public class FontInput {
    private WebElement element;

    public FontInput(WebElement element) {
        this.element = element;
    }

    public void inputFont(FontValue fontValue) {
        element.sendKeys(fontValue.getInputValue());
    }

    public boolean isSelectedFont(FontValue fontValue) {
        return element.getText().matches(fontValue.getInputValue());
    }

    public WebElement getElement() {
        return element;
    }
}
