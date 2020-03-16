package desktop.automation.pages.driver.implementation.browser.SUT;

import desktop.automation.driver.wrappers.Browser;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.SUT.PrepareDataPromptPage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

import static junit.framework.TestCase.assertEquals;

public class PrepareDataPromptPageBrowser extends PrepareDataPromptPage {
    private static final By ATTRIBUTE_CHECKBOX_ELEM_DATASET = By.xpath("//*[@id='Attribute']/ancestor::label/input");
    private static final By ATTRIBUTE_CHECKBOX_ELEM_REPORT = By.xpath("//*[@id='Attribute']/ancestor::div[@class='attribute-forms']//li");
    private static final By METRIC_CHECKBOX_ELEM = By.xpath("//span[text()='Metrics']/../..//input");
    private static final By FILTER_LIST_ELEM = By.xpath("//div[text()='Filters']/..//li");
    private static final By FILTER_VALUE_CHECKBOX_ELEM = By.xpath("//div[@class='selector-title']/div/../..//input");
    private static final By TITLE_ROOT_ELEM = By.cssSelector("#root .folder-browser-title");
    private static final By TITLE_ELEMS = By.cssSelector("#root .folder-browser-title > span");
    private static final By ATTRIBUTE_ALL_CHECKBOX_ELEM_REPORT = By.xpath("//input[@name='All']/..");

    public PrepareDataPromptPageBrowser(Browser browser) {
        super(browser);
    }

    @Override
    public void assertPrepareDataPromptTitlePresent(boolean isDataset, String expectedObjectName) {
        List<WebElement> titleElems = getTitleElems();

        String actualTitleStart = titleElems.get(0).getText();
        assertEquals(isDataset ? "Import Dataset >" : "Import Report >", actualTitleStart);

        String actualObjectName = titleElems.get(1).getText();
        assertEquals(expectedObjectName, actualObjectName);
    }

    public List<WebElement> getTitleElems(){
        machine.waitAndFind(TITLE_ROOT_ELEM);
        return machine.driver.findElements(TITLE_ELEMS);
    }

    @Override
    public WebDriverElemWrapper[] getAttributes(int[] attributes) {
        List<WebElement> allCheckBoxElems = isDataset ? getAllAttributeCheckBoxElemsDataset() : getAttributesReport();

        WebDriverElemWrapper[] res = new WebDriverElemWrapper[attributes.length];
        for (int i = 0; i < attributes.length; i++) {
            int attribute = attributes[i] + 1;
            res[i] = new WebDriverElemWrapper(allCheckBoxElems.get(attribute));
        }

        return res;
    }

    private List<WebElement> getAttributesReport() {
        List<WebElement> allAttributeCheckBoxElems = getAttributeElemCheckBoxElemsReport();
        allAttributeCheckBoxElems.add(0, getAttributeAllCheckboxElemReport().getDriverElement());

        return allAttributeCheckBoxElems;
    }

    private List<WebElement> getAllAttributeCheckBoxElemsDataset(){
        machine.waitAndFind(ATTRIBUTE_CHECKBOX_ELEM_DATASET);
        return machine.driver.findElements(ATTRIBUTE_CHECKBOX_ELEM_DATASET);
    }

    private WebDriverElemWrapper getAttributeAllCheckboxElemReport(){
        return machine.waitAndFindElemWrapper(ATTRIBUTE_ALL_CHECKBOX_ELEM_REPORT);
    }

    private List<WebElement> getAttributeElemCheckBoxElemsReport(){
        machine.waitAndFind(ATTRIBUTE_CHECKBOX_ELEM_REPORT);
        return machine.driver.findElements(ATTRIBUTE_CHECKBOX_ELEM_REPORT);
    }

    @Override
    public WebDriverElemWrapper[] getMetrics(int[] metrics) {
        List<WebElement> allMetricCheckBoxElems = getAllMetricCheckBoxElems();

        WebDriverElemWrapper[] res = new WebDriverElemWrapper[metrics.length];
        for (int i = 0; i < metrics.length; i++) {
            int metric = metrics[i] + 1;
            res[i] = new WebDriverElemWrapper(allMetricCheckBoxElems.get(metric));
        }

        return res;
    }

    private List<WebElement> getAllMetricCheckBoxElems(){
        machine.waitAndFind(METRIC_CHECKBOX_ELEM);
        return machine.driver.findElements(METRIC_CHECKBOX_ELEM);
    }

    @Override
    public WebDriverElemWrapper[] getFilters(int[] filters) {
        List<WebElement> allFitlerElems = getAllFilterElems();

        WebDriverElemWrapper[] res = new WebDriverElemWrapper[filters.length];
        for (int i = 0; i < filters.length; i++) {
            int filter = filters[i];
            res[i] = new WebDriverElemWrapper(allFitlerElems.get(filter));
        }

        return res;
    }

    private List<WebElement> getAllFilterElems(){
        machine.waitAndFind(FILTER_LIST_ELEM);
        return machine.driver.findElements(FILTER_LIST_ELEM);
    }

    @Override
    public WebDriverElemWrapper[] getFilterValues(int[] filterValues) {
        List<WebElement> allFilterValueCheckboxElems = getAllFilterValueCheckboxElems();

        WebDriverElemWrapper[] res = new WebDriverElemWrapper[filterValues.length];
        for (int i = 0; i < filterValues.length; i++) {
            int filterValue = filterValues[i] + 1;
            res[i] = new WebDriverElemWrapper(allFilterValueCheckboxElems.get(filterValue));
        }

        return res;
    }

    private List<WebElement> getAllFilterValueCheckboxElems(){
        machine.waitAndFind(FILTER_VALUE_CHECKBOX_ELEM);
        return machine.driver.findElements(FILTER_VALUE_CHECKBOX_ELEM);
    }
}
