package desktop.automation.elementWrappers;

import org.openqa.selenium.WebElement;

public class IndexedWebElement {
    private int index;
    private WebElement element;

    public IndexedWebElement(int index, WebElement element) {
        this.index = index;
        this.element = element;
    }

    public int getIndex() {
        return index;
    }

    public WebElement getElement() {
        return element;
    }

    @Override
    public String toString() {
        return getMessage(element.getText());
    }

    public String getText(){
        return element.getText();
    }

    private String getMessage(String message) {
        return "IndexedWebElement{" +
                "index=" + index +
                ", element=" + message +
                '}';
    }
}
