package desktop.automation.pages.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.bases.BasePromptWithSingleSelectionListPage;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;


public class AttributeElementPromptPage extends BasePromptWithSingleSelectionListPage {
    public AttributeElementPromptPage(Machine machine) {
        super(machine);
    }

    @Override
    public void answerPromptCorrectly() {
        WebElement runBtn = machine.getAttributeElementPromptPage().getRunBtnElem();

        WebElement searchElem = machine.getAttributeElementPromptPage().getSearchElem();
        searchElem.sendKeys("Books");
        searchElem.sendKeys(Keys.ENTER);

        machine.getAttributeElementPromptPage().getAddBtnElem().click();
        runBtn.click();
    }

    public void filterAndClickOption(String option){
        WebElement searchElem = machine.getAttributeElementPromptPage().getSearchElem();
        searchElem.clear();
        searchElem.sendKeys(option);
        searchElem.sendKeys(Keys.ENTER);

        machine.getAttributeElementPromptPage().getAddBtnElem().click();
    }

    public WebElement getSearchElem() {
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFind(ATTRIBUTE_SEARCH_ELEM);
    }
}
