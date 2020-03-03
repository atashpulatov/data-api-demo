package desktop.automation.elementWrappers.windows;

import org.openqa.selenium.WebElement;

public class RadioButton {
    private WebElement element;

    public RadioButton(WebElement element) {
        this.element = element;
    }

    public WebElement getElement() {
        return element;
    }

    public boolean isSelected(){
        String isSelectedAttrValue = element.getAttribute("SelectionItem.IsSelected");

        return !"False".matches(isSelectedAttrValue);
    }
}
