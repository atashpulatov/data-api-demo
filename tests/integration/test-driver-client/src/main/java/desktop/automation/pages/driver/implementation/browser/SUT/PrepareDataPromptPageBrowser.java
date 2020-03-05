package desktop.automation.pages.driver.implementation.browser.SUT;

import desktop.automation.driver.wrappers.Browser;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.SUT.PrepareDataPromptPage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

import static junit.framework.TestCase.assertEquals;

public class PrepareDataPromptPageBrowser extends PrepareDataPromptPage {
    private static final By ATTRIBUTE_CHECKBOX_ELEM = By.xpath("//*[@id='Attribute']/ancestor::div[@class='attribute-forms']//li");
    private static final By METRIC_CHECKBOX_ELEM = By.xpath("//span[text()='Metrics']/../..//input");
    private static final By FILTER_LIST_ELEM = By.xpath("//div[text()='Filters']/..//li");
    private static final By FILTER_VALUE_CHECKBOX_ELEM = By.xpath("//div[@class='selector-title']/div/../..//input");

    public PrepareDataPromptPageBrowser(Browser browser) {
        super(browser);
    }

    @Override
    public void assertPrepareDataPromptTitlePresent(boolean isDataset, String objectName) {
        List<WebElement> titleElems = getTitleElems();
        String actualTitleStart = titleElems.get(0).getText();
        assertEquals(isDataset ? "Import Dataset >" : "Import Report >", actualTitleStart);
        assertEquals(objectName, titleElems.get(1).getText());
    }

    public List<WebElement> getTitleElems(){
        By TITLE_ROOT_ELEM = By.cssSelector("#root .folder-browser-title");
        By TITLE_ELEMS = By.cssSelector("#root .folder-browser-title > span");

        machine.waitAndFind(TITLE_ROOT_ELEM);
        return machine.driver.findElements(TITLE_ELEMS);
    }

    @Override
    public WebDriverElemWrapper[] getAttributes(int[] attributes) {
        List<WebElement> allAttributeCheckBoxElems = getAllAttributeCheckBoxElems();

        WebDriverElemWrapper attributeAllCheckboxElem = getAttributeAllCheckboxElem();
        WebDriverElemWrapper[] res = new WebDriverElemWrapper[attributes.length];
        for (int i = 0; i < attributes.length; i++) {
            int attribute = attributes[i];
            if (attribute == -1)
                res[i] = attributeAllCheckboxElem;
            else
                res[i] = new WebDriverElemWrapper(allAttributeCheckBoxElems.get(attribute));
        }

        return res;
    }

    public WebDriverElemWrapper getAttributeAllCheckboxElem(){
        return machine.waitAndFindElemWrapper(By.xpath("//input[@name='All']/.."));
    }

    public List<WebElement> getAllAttributeCheckBoxElems(){
        machine.waitAndFind(ATTRIBUTE_CHECKBOX_ELEM);
        return machine.driver.findElements(ATTRIBUTE_CHECKBOX_ELEM);
    }

    @Override
    public WebDriverElemWrapper[] getMetrics(int[] metrics) {
        List<WebElement> allMetricCheckBoxElems = getAllMetricCheckBoxElems();

        WebDriverElemWrapper[] res = new WebDriverElemWrapper[metrics.length];
        for (int i = 0; i < metrics.length; i++) {
            int metric = metrics[i];
            res[i] = new WebDriverElemWrapper(allMetricCheckBoxElems.get(metric + 1));
        }

        return res;
    }

    public List<WebElement> getAllMetricCheckBoxElems(){
        machine.waitAndFind(METRIC_CHECKBOX_ELEM);
        return machine.driver.findElements(METRIC_CHECKBOX_ELEM);
    }

    @Override
    public WebDriverElemWrapper[] getFilters(int[] filters) {
        List<WebElement> allFitlerElems = getAllFitlerElems();

        WebDriverElemWrapper[] res = new WebDriverElemWrapper[filters.length];
        for (int i = 0; i < filters.length; i++) {
            int filter = filters[i];
            res[i] = new WebDriverElemWrapper(allFitlerElems.get(filter));
        }

        return res;
    }

    public List<WebElement> getAllFitlerElems(){
        machine.waitAndFind(FILTER_LIST_ELEM);
        return machine.driver.findElements(FILTER_LIST_ELEM);
    }

    @Override
    public WebDriverElemWrapper[] getFilterValues(int[] filterValues) {
        List<WebElement> allFilterValueCheckboxElems = getAllFilterValueCheckboxElems();

        WebDriverElemWrapper[] res = new WebDriverElemWrapper[filterValues.length];
        for (int i = 0; i < filterValues.length; i++) {
            int filterValue = filterValues[i];
            res[i] = new WebDriverElemWrapper(allFilterValueCheckboxElems.get(filterValue + 1));
        }

        return res;
    }

    public List<WebElement> getAllFilterValueCheckboxElems(){
        machine.waitAndFind(FILTER_VALUE_CHECKBOX_ELEM);
        return machine.driver.findElements(FILTER_VALUE_CHECKBOX_ELEM);
    }
}
