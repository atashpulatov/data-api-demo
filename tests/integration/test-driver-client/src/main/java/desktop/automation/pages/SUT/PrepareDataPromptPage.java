package desktop.automation.pages.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.helpers.FilterAndValues;
import desktop.automation.helpers.FilterAndValuesIndexBased;
import desktop.automation.selectors.SUT.PrepareDataPromptPageSelectors;
import org.openqa.selenium.By;

import java.util.LinkedList;
import java.util.List;

import static junit.framework.TestCase.assertEquals;


public abstract class PrepareDataPromptPage extends PrepareDataPromptPageSelectors {
    protected Machine machine;
    protected boolean isDataset;
    public PrepareDataPromptPage(Machine machine) {
        this.machine = machine;
    }

    public void assertColumnsAndFiltersTitlePresent(){
        machine.waitAndFindElemWrapper(COLUMNS_AND_FILTERS_SELECTION_TITLE_ELEM);
    }

    public abstract void assertPrepareDataPromptTitlePresent(boolean isDataset, String objectName);
    public abstract WebDriverElemWrapper[] getAttributes(int[] attributes);
    public abstract WebDriverElemWrapper[] getMetrics(int[] metrics);
    public abstract WebDriverElemWrapper[] getFilters(int[] filter);
    public abstract WebDriverElemWrapper[] getFilterValues(int[] filterValues);

    public void clickAttributes(int[] attributes){
        WebDriverElemWrapper[] attributeElems = getAttributes(attributes);
        for (WebDriverElemWrapper attributeElem : attributeElems)
            attributeElem.click();
    }

    public void clickMetrics(int[] metrics){
        WebDriverElemWrapper[] metricElems = getMetrics(metrics);
        for (WebDriverElemWrapper metricElem : metricElems)
            metricElem.click();
    }

    public void clickFiltersAndFilterValues(FilterAndValuesIndexBased[] filtersAndValues) {
        WebDriverElemWrapper[] filters = getFilters(getFilterIndexes(filtersAndValues));

        for (int i = 0; i < filtersAndValues.length; i++) {
            FilterAndValuesIndexBased filterAndValues = filtersAndValues[i];
            clickFilterAndFilterValues(filters[i], filterAndValues.getValues());
        }
    }

    public int[] getFilterIndexes(FilterAndValuesIndexBased[] filtersAndValues){
        if (filtersAndValues == null || filtersAndValues.length == 0)
            return null;

        List<Integer> res = new LinkedList<>();
        for (int i = 0; i < filtersAndValues.length; i++) {
            FilterAndValues filter = filtersAndValues[i];

            if (filter instanceof FilterAndValuesIndexBased)
                res.add(((FilterAndValuesIndexBased)filter).getFilter());
        }

        return res.size() == 0 ? null : res.stream().mapToInt(i -> i).toArray();
    }

    public void clickFilterAndFilterValues(AnyInterfaceElement filterElem, int[] filterValues){
        filterElem.click();
        WebDriverElemWrapper[] filterValueElems = getFilterValues(filterValues);
        for (WebDriverElemWrapper filterValueElem : filterValueElems) {
            filterValueElem.click();
        }
    }

    public WebDriverElemWrapper getViewSelectedSwitch(){
        return machine.waitAndFindElemWrapper(VIEW_SELECTED_BTN_ELEM);
    }

    public WebDriverElemWrapper getBackBtn(){
        return machine.waitAndFindElemWrapper(BACK_BTN_ELEM);
    }

    public WebDriverElemWrapper getDataPreviewBtn(){
        return machine.waitAndFindElemWrapper(DATA_PREVIEW_BTN_ELEM);
    }

    public AnyInterfaceElement getImportBtn(){
        return machine.waitAndFindElemWrapper(IMPORT_BTN);
    }

    public void clickImportDataBtnAndAssertImportFlow(int timeout){
        getImportBtn().click();
        machine.getImportingDataSingleRefreshPopUpPage().assertImportSingleFlow(timeout);
    }

    public void clickImportDataBtnAndAssertRefreshFlowSingle(boolean isDataset, int timeout){
        getImportBtn().click();
        machine.getImportingDataSingleRefreshPopUpPage().assertRefreshSingleFlow(isDataset, timeout);
    }

    public WebDriverElemWrapper getCancelBtn(){
        return machine.waitAndFindElemWrapper(CANCEL_BTN_ELEM);
    }

    public void assertPromptNotOpen(){
        if (machine.isBrowser()){
            machine.focusOnExcelFrameForBrowser();
            assertEquals(1, machine.driver.findElements(By.cssSelector(".AddinIframe")).size());
        }
        else
            machine.assertNotPresent(CANCEL_BTN_ELEM);
    }

    public WebDriverElemWrapper getFilterExcludesAllDataMessage(){
        return machine.waitAndFindElemWrapper(FILTER_EXCLUDES_ALL_DATA_ERROR_MESSAGE);
    }

    public WebDriverElemWrapper getDisplayAttributeFormNamesLinkElem(){
        return machine.waitAndFindElemWrapper(DISPLAY_ATTRIBUTE_FORM_NAMES_LINK_ELEM, machine.QUARTER_UNIT);
    }

    public WebDriverElemWrapper getCrosstabNotificationElem(){
        return machine.waitAndFindElemWrapper(CROSSTAB_NOTIFICATION, machine.QUARTER_UNIT);
    }

    public boolean isCrosstabReport(){
        try {
            getCrosstabNotificationElem();
            return true;
        } catch (org.openqa.selenium.TimeoutException e){
            return false;
        }
    }

    public void setDataset(boolean dataset) {
        isDataset = dataset;
    }
}
