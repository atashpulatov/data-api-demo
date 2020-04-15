package desktop.automation.elementWrappers;

import desktop.automation.driver.wrappers.Machine;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class WebDriverElemWrapper implements AnyInterfaceElement {
    private static Machine machine;
    private WebElement driverElement;

    public WebDriverElemWrapper(WebElement driverElement) {
        this.driverElement = driverElement;
    }

    @Override
    public void click() {
        try {
            driverElement.click();
        } catch (org.openqa.selenium.ElementNotInteractableException e){
            System.out.println("failed to click element because of ElementClickInterceptedException");
            try {
                Thread.sleep(2_000);
            } catch (InterruptedException ex) {
                ex.printStackTrace();
            }
            machine.ONE_UNIT.until(ExpectedConditions.elementToBeClickable(driverElement));
            driverElement.click();
        }
    }

    @Override
    public void clickExplicitlyByActionClass() {
        machine.clickObject(driverElement);
    }

    @Override
    public void sendKeys(CharSequence... input) {
        driverElement.sendKeys(input);
    }

    @Override
    public void clear() {
        driverElement.clear();
    }

    @Override
    public String getText() {
            return machine.isBrowser() ? driverElement.getAttribute("value") : driverElement.getText();
    }

    public WebElement getDriverElement() {
        return driverElement;
    }

    public static void setMachine(Machine machine){
        WebDriverElemWrapper.machine = machine;
    }
}
