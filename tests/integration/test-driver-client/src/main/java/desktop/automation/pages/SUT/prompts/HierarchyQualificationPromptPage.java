package desktop.automation.pages.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.pages.SUT.prompts.bases.BasePromptPage;
import org.openqa.selenium.By;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebElement;

public class HierarchyQualificationPromptPage extends BasePromptPage {
    //mapping not finished, but enough to execute the relevant test case
//    private static final By HIERARCHY_SEARCH_ELEM = MobileBy.AccessibilityId("id_mstr45_txt");
    private static Point AddBtnLoc = null;

    public HierarchyQualificationPromptPage(Machine machine) {
        super(machine);
    }

    @Override
    public void answerPromptCorretly() {
        try {
            Thread.sleep(3_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        WebElement runBtn = machine.getHierarchyQualificationPromptPage().getRunBtnElem();
        runBtn.click();
    }

    //element is disabled
//    public WebElement getSearchElem(){
//        return machine.waitAndFind(HIERARCHY_SEARCH_ELEM);
//    }

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

//    public WebElement getFormLinkElem(){
//        return machine.waitAndFind(By.xpath("//*[@Name='Form']"), machine.THREE_MINUTES);
//    }
//
//    public WebElement getFormOptionElemByName(String name){
//        String locator = String.format("//Group/Text[@Name=\"%s\"]", name);
//        return machine.waitAndFind(By.xpath(locator));
//    }

    //alternative implementation helper
//    private String formatFormOptionName(String formName, String attributeName){
//        return String.format("%s. %s %s", formName, attributeName, formName);
//    }

//    public WebElement getFirstEqualsLinkElem(){
//        return machine.waitAndFind(By.xpath("//Link[@Name='Equals']"));
//    }
//
//    public WebElement getAttributeOperatorOptionElemByName(String name){
//        String locator = String.format("//Group/Group[@Name=\"%s\"]", name);
//        return machine.waitAndFind(By.xpath(locator));
//    }
//
//    public WebElement getValueLinkElem(){
//        return machine.waitAndFind(By.xpath("//Link[@Name=\"Value\"]"));
//    }
}
