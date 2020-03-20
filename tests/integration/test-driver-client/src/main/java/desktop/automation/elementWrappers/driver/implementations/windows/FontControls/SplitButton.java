package desktop.automation.elementWrappers.driver.implementations.windows.FontControls;

import desktop.automation.elementWrappers.driver.implementations.windows.WebElementWithGetValue;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class SplitButton extends WebElementWithGetValue {
    public static final String GREEN = "Green, Accent 6";
    public static final String ORANGE = "Orange, Accent 2";

    public SplitButton(WebElement element) {
        super(element);
    }

    private WebElement getMoreOptionsMenuBtnElem(){
        return element.findElement(By.xpath("//*[@Name=\"More Options\"]"));
    }

    private WebElement getColorElem(String color){
        return element.findElement(By.xpath("//*[@LocalizedControlType='List Item'][@Name='" + color + "']"));
    }

    public void changeColor(String color){
        getMoreOptionsMenuBtnElem().click();
        getColorElem(color).click();
    }
}
