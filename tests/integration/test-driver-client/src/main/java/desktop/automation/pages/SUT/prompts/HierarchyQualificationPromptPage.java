package desktop.automation.pages.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.pages.SUT.prompts.bases.BasePromptPage;
import org.openqa.selenium.By;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebElement;

public class HierarchyQualificationPromptPage extends BasePromptPage {
    private static Point AddBtnLoc = null;

    public HierarchyQualificationPromptPage(Machine machine) {
        super(machine);
    }

    @Override
    public void answerPromptCorrectly() {
        try {
            Thread.sleep(3_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        WebElement runBtn = machine.getHierarchyQualificationPromptPage().getRunBtnElem();
        runBtn.click();
    }

    public WebElement getHierarchyElemByNameAndClick(String name) {
        WebElement res = getHierarchyElemByName(name);
        machine.actions
                .moveToElement(res, 10, 13)
                .click()
                .perform();

        return res;
    }

    public WebElement getHierarchyElemByName(String name) {
        String locator = String.format(HIERARCHY_BASE, name);
        return machine.waitAndFind(By.xpath(locator));
    }

    public WebElement getAttributeElemByName(String name) {
        String locator = String.format(ATTRIBUTE_BASE, name);
        return machine.waitAndFind(By.xpath(locator));
    }

    public WebElement getAttributeValueInputElem(){
        return machine.waitAndFind(By.xpath("//Edit[@Name=\"Enter value:\"]"));
    }

    public WebElement getAttributeValueOKBtnElem(){
        return machine.waitAndFind(By.xpath("//Button[@Name='OK']"));
    }


    public WebElement getAddBtnElem(){
        WebElement res = machine.waitAndFind(By.xpath("//Group[@Name='Add']"));
        AddBtnLoc = res.getLocation();
        return res;
    }

    private void moveByOffsetFromAddBtnElemAndClick(int x, int y) {
        if (AddBtnLoc == null)
            getAddBtnElem();

        machine.actions
                .moveToElement(ImageComparisonElem.getDesktopElem(), 0, 0)
                .moveByOffset(AddBtnLoc.getX(), AddBtnLoc.getY())
                .moveByOffset(x, y)
                .click()
                .pause(1000)
                .perform();
    }

    //hard coded path for specific attribute in specific flow
    public void getCustomerLastNameDoesNotEqualHierarchySelectionWithValueInputOpen(){
        moveByOffsetFromAddBtnElemAndClick(222, 0);
        moveByOffsetFromAddBtnElemAndClick(280, 55);
        moveByOffsetFromAddBtnElemAndClick(300, -5);
        moveByOffsetFromAddBtnElemAndClick(360, 60);
        moveByOffsetFromAddBtnElemAndClick(410, -5);
    }
}
