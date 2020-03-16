package desktop.automation.elementWrappers.driver.implementations.windows;

import desktop.automation.elementWrappers.enums.RefreshStatus;
import org.openqa.selenium.WebElement;

public class RefreshedObjectInlist {
    private RefreshStatus status;
    private WebElement statusElem;
    private WebElement nameElem;

    public RefreshedObjectInlist(RefreshStatus status, WebElement statusElem, WebElement nameElem) {
        this.status = status;
        this.statusElem = statusElem;
        this.nameElem = nameElem;
    }

    public RefreshStatus getStatus() {
        return status;
    }

    public WebElement getStatusElem() {
        return statusElem;
    }

    public WebElement getNameElem() {
        return nameElem;
    }
}
