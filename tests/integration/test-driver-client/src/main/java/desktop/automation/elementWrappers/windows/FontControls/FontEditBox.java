package desktop.automation.elementWrappers.windows.FontControls;

import desktop.automation.elementWrappers.windows.WebElementWithGetValue;
import org.openqa.selenium.WebElement;

public class FontEditBox extends WebElementWithGetValue {
    public FontEditBox(WebElement element) {
        super(element);
    }

    public String getFont(){
        return getValue();
    }
}
