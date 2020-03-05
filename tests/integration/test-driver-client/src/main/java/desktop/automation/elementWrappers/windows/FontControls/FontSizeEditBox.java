package desktop.automation.elementWrappers.windows.FontControls;

import desktop.automation.elementWrappers.windows.WebElementWithGetValue;
import org.openqa.selenium.WebElement;

public class FontSizeEditBox extends WebElementWithGetValue {
    public FontSizeEditBox(WebElement element) {
        super(element);
    }

    public int getFontSize(){
        return Integer.parseInt(getValue());
    }
}
