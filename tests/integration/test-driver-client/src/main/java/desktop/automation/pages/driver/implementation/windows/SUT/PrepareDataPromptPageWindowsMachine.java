package desktop.automation.pages.driver.implementation.windows.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.SUT.PrepareDataPromptPage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

public class PrepareDataPromptPageWindowsMachine extends PrepareDataPromptPage {

    public PrepareDataPromptPageWindowsMachine(Machine machine) {
        super(machine);
    }

    @Override
    public void assertPrepareDataPromptTitlePresent(boolean isDataset, String objectName) {
        getTitleStartElem(isDataset);
        getTitleNameElem(isDataset, objectName);
    }

    public RemoteWebElement getPromptPaneElem() {
        return machine.waitAndFind(PANE);
    }

    public List<WebElement> getPanelElems(){
        return machine.getChildren(getPromptPaneElem());
    }

    private RemoteWebElement getPanelElem(int index){
        return (RemoteWebElement)getPanelElems().get(index);
    }

    public WebDriverElemWrapper getAttributeColAllElem(){
        return new WebDriverElemWrapper(getAllCheckboxElems().get(0));
    }

    public WebDriverElemWrapper getMetricColAllElem(){
        return new WebDriverElemWrapper(getAllCheckboxElems().get(1));
    }

    public WebDriverElemWrapper getFilterValueAllElem() {
        return new WebDriverElemWrapper(getAllCheckboxElems().get(2));
    }

    public List<WebElement> getAllCheckboxElems(){
        machine.waitAndFind(ALL_CHECKBOX_ELEMS);

        return machine.driver.findElements(ALL_CHECKBOX_ELEMS);
    }

    public WebElement getColumnsAndFiltersSelectionTitleElem(){
        return machine.waitAndFind(COLUMNS_AND_FILTERS_SELECTION_TITLE_ELEM);
    }

    public ImageComparisonElem getColumnsAndFiltersSelectionTitleImageBasedElem(){
        return new ImageComparisonElem(new String[]{COLUMNS_AND_FILTERS_SELECTION_TITLE_IMAGE_1, COLUMNS_AND_FILTERS_SELECTION_TITLE_IMAGE_2},
                200, 500, 200, 270, 20_000);
    }

    public List<WebElement> getGridElems(){
        return machine.driver.findElements(ATTRIBUTE_METRIC_GRIDS);
    }

    public RemoteWebElement getFiltersTreeElem(){
        return machine.waitAndFind(FILTER_TREE_ELEM);
    }

    public RemoteWebElement getFilterValueGridElem() {
        return (RemoteWebElement) getGridElems().get(2);
    }

    public RemoteWebElement getAttrGridElem(){
        return (RemoteWebElement) getGridElems().get(0);
    }

    public RemoteWebElement getMetricGridElem(){
        return (RemoteWebElement) getGridElems().get(1);
    }

    @Override
    public WebDriverElemWrapper[] getAttributes(int[] indexes){
        List<WebDriverElemWrapper> paneChildren = getPaneChildren();
        WebDriverElemWrapper allAttributeElemFromChildren = getAllAttributeElemFromChildren(paneChildren);
        List<WebDriverElemWrapper> attributes = getAttributesFromChildren(paneChildren);

        WebDriverElemWrapper[] res = new WebDriverElemWrapper[indexes.length];
        for (int i = 0; i < indexes.length; i++) {
            int index = indexes[i];
            if (index == -1)
                res[i] = allAttributeElemFromChildren;
            else
                res[i] = attributes.get(index);
        }

        return res;
    }

    public WebDriverElemWrapper[] getMetrics(int[] indexes){
        List<WebDriverElemWrapper> paneChildren = getPaneChildren();
        WebDriverElemWrapper allMetricElemFromChildren = getAllMetricElemFromChildren(paneChildren);
        List<WebDriverElemWrapper> metrics = getMetricsFromChildren(paneChildren);

        WebDriverElemWrapper[] res = new WebDriverElemWrapper[indexes.length];
        for (int i = 0; i < indexes.length; i++) {
            int index = indexes[i];
            if (index == -1)
                res[i] = allMetricElemFromChildren;
            else
                res[i] = metrics.get(index);
        }

        return res;
    }

    public void clickFilter(WebElement filterElem) {
        try {
            filterElem.findElement(By.xpath("//*[@LocalizedControlType='image']")).click();
        } catch (Exception e) {
            System.out.println("failed 1st selector, parent elem runtime id: " + filterElem.getAttribute("RuntimeId"));
            filterElem.findElement(By.xpath("//*[2]")).click();
        }
    }

    public WebDriverElemWrapper[] getFilters(int[] indexes){
        List<WebDriverElemWrapper> paneChildren = getPaneChildren();
        List<WebDriverElemWrapper> filtersFromChildren = getFiltersFromChildren(paneChildren);

        WebDriverElemWrapper[] res = new WebDriverElemWrapper[indexes.length];
        for (int i = 0; i < indexes.length; i++) {
            int index = indexes[i];
            res[i] = filtersFromChildren.get(index);
        }

        return res;
    }

    public WebDriverElemWrapper[] getFilters(int[] indexes, String[] names){
        //1
//        return getGridElems(null, getFiltersTreeElem(), indexes, names, 1, 7);
        //2
        return getFilters(indexes);
    }

    public WebDriverElemWrapper[] getFilterValues(int[] indexes){
        List<WebDriverElemWrapper> paneChildren = getPaneChildren();
        List<WebDriverElemWrapper> filterValuesFromChildren = getFilterValuesFromChildren(paneChildren);

        WebDriverElemWrapper[] res = new WebDriverElemWrapper[indexes.length];
        for (int i = 0; i < indexes.length; i++) {
            int index = indexes[i];
            res[i] = filterValuesFromChildren.get(index + 1);
        }

        return res;
    }

    public WebDriverElemWrapper[] getFilterValues(String[] filterValueNames){
        return getGridElems(getFilterValueAllElem(), getFilterValueGridElem(), null, filterValueNames, 2, 3);
    }

    public WebDriverElemWrapper[] getAndClickFilterValues(int[] indexes) {
        WebDriverElemWrapper[] res = getFilterValues(indexes);
        return getAndClickGridElems(res);
    }

    public WebDriverElemWrapper[] getAndClickFilters(int[] indexes){
        WebDriverElemWrapper[] res = getFilters(indexes);

        WebDriverElemWrapper[] images = new WebDriverElemWrapper[res.length];
        for (int i = 0; i < res.length; i++) {
            WebDriverElemWrapper filter = res[i];
            images[i] = new WebDriverElemWrapper(filter.getDriverElement().findElement(By.tagName("Image")));
        }

        getAndClickGridElems(images);

        return res;
    }

    public WebDriverElemWrapper[] getAndClickMetrics(int[] indexes){
        WebDriverElemWrapper[] res = getMetrics(indexes);
        return getAndClickGridElems(res);
    }

    public WebDriverElemWrapper[] getAndClickAttributes(int[] indexes){
        WebDriverElemWrapper[] res = getAttributes(indexes);

        for (int i = 0; i < res.length; i++) {
            WebDriverElemWrapper attributeColElem = res[i];

            int xOffset = indexes[i] != -1 && isDataset ? 15 : 25;
            int yOffset = indexes[i] == -1 ? 15 : isDataset ? 10 : 25;

            machine.clickObjectWithOffset(attributeColElem.getDriverElement(), xOffset, yOffset);
        }

        return res;
    }

    public WebDriverElemWrapper[] getAndClickGridElems(WebDriverElemWrapper[] elems){
        // when mouse is hovering over an attribute a popup appears and can hide the element underneath it from being clickable,
        // therefor a helper elem is used to not allow the mouse to hover
        RemoteWebElement helper = getPromptPaneElem();

        for (WebDriverElemWrapper target : elems) {
            target.click();
            helper.click();
        }

        return elems;
    }

    private WebDriverElemWrapper[] getGridElems(WebDriverElemWrapper allElem, RemoteWebElement grid, int[] indexes, int start, int diff){
        return getGridElems(allElem, grid, indexes, null, start, diff);
    }

    private WebDriverElemWrapper[] getGridElems(WebDriverElemWrapper allElem, RemoteWebElement grid, int[] indexes, String[] names, int start, int diff){
        //method implementation in progress to use indexes and names properly. For now can use with only indexes or only names
        int length = indexes != null ? indexes.length : 0;
        length += names != null ? names.length : 0;

        WebDriverElemWrapper[] res = new WebDriverElemWrapper[length];

        List<WebElement> gridElems = grid.findElements(By.xpath(".//*"));
        //1 index based values
        if (indexes != null) {
            for (int i = 0; i < indexes.length; i++) {
                if (indexes[i] == -1) {
                    res[i] = allElem;
                } else {
                    int actIndex = indexes[i] * diff + start;

                    res[i] = new WebDriverElemWrapper(gridElems.get(actIndex));
                }
            }
        }

        //2 name based values
        if (names != null) {
            for (int i = 0; i < names.length; i++) {
                String name = names[i];

                int nameStart = indexes != null ? indexes.length : 0;
                if (name.matches("(All)"))
                    res[nameStart + i] = allElem;
                else {
                    for (int j = 0; j < 100; j++) {
                        int actIndex = j * diff + start;

                        WebElement currElem = gridElems.get(actIndex);
                        String currElemText = parseGridElemText(currElem);

                        if (currElemText.matches(name)) {
                            res[nameStart + i] = new WebDriverElemWrapper(currElem);
                            break;
                        }
                    }
                }
            }
        }

        return res;
    }

    private String parseGridElemText(WebElement currElem) {
        //Can encounter issues for elements that contain '(', ')' chars in the name
        String currElemText = currElem.getText();

        if (currElemText.endsWith("()"))
            currElemText = currElemText.substring(0, currElemText.length() - 2);
        else {
            // adding the \r and \n might make the selector unstable in that case just replace this if, else block with simply getting last '(' char, getting substring to that index and then trimming the whitespace chars
            int index = currElemText.lastIndexOf("\r\n(");
            if (index != -1)
                currElemText = currElemText.substring(0, index).trim();
        }

        return currElemText;
    }

    public boolean isElementChecked(WebElement element){
        element = element.findElement(COLUMN_ELEM_CHECKBOX);
        String state = element.getAttribute("Toggle.ToggleState").trim();

        return state.equals("1");
    }

    public boolean allElementsChecked(WebElement[] elements){
        for (WebElement element : elements) {
            if (!isElementChecked(element))
                return false;
        }

        return true;
    }

    public RemoteWebElement getAttributeHeader(int selected, int total){
        return getHeader("Attributes", selected, total);
    }

    public RemoteWebElement getMetricHeader(int selected, int total){
        return getHeader("Metrics", selected, total);
    }

    public RemoteWebElement getFilterHeader(int selected, int total){
        return getHeader("Filters", selected, total);
    }

    public int getFilterSelectedValuesDisplayed(WebElement filter){
        String filterText = filter.getText();

        int start = filterText.lastIndexOf('(');
        int end = filterText.lastIndexOf('/');

        if (end == -1 || start == filterText.length() - 2)
            return 0;

        return Integer.parseInt(filterText.substring(start + 1, end));
    }

    private RemoteWebElement getHeader(String headerName, int selected, int total){
        String name = String.format("%s (%d/%d)", headerName, selected, total);
        return machine.waitAndFind(By.name(name));
    }

    public ImageComparisonElem getImportBtnImagedBasedElem(){
        return new ImageComparisonElem(IMPORT_BTN_IMAGE, 1400, 1600, 850, 940);
    }

    public WebElement getViewSelectedBtnElem(){
        return machine.waitAndFind(VIEW_SELECTED_BTN_ELEM);
    }

    public RemoteWebElement getDataPreviewBtnElem(){
        return machine.waitAndFind(DATA_PREVIEW_BTN_ELEM);
    }

    public RemoteWebElement getCancelBtnElem(){
        return machine.waitAndFind(CANCEL_BTN_ELEM);
    }

    public WebElement getBackBtnElem(){
        return machine.waitAndFind(BACK_BTN_ELEM);
    }

    public WebElement getTitleStartElem(boolean isDataset){
        return machine.waitAndFind(By.name(String.format("Import %s >", isDataset ? "Dataset" : "Report")));
    }

    public WebElement getTitleNameElem(boolean isDataset, String objectName){
        By locator = By.xpath(String.format("//*/*[@Name=\"Import %s >\"]/following-sibling::*[@Name=\"%s\"]", isDataset ? "Dataset" : "Report", objectName));

        return machine.waitAndFind(locator);
    }

    @Override
    public AnyInterfaceElement getImportBtn(){
        return machine.getImageComparisonElemFallBackToWebDriver(IMPORT_BTN, IMPORT_BTN_IMAGE, 1400, 1600, 850, 940);
    }

    public WebDriverElemWrapper getPaneElem(){
        By prepDataPaneSelector = By.xpath("//Text[@Name=\"icon: search\"]/..");
        WebElement prepDataPaneElem = machine.waitAndFind(prepDataPaneSelector);
        return new WebDriverElemWrapper(prepDataPaneElem);
    }

    private int attributeColStart = -1;
    private int attributeColEnd = -1;
    private int metricColStart = -1;
    private int metricColEnd = -1;
    private int filterColStart = -1;
    private int filterColEnd = -1;
    private int filterValuesColStart = -1;

    public List<WebDriverElemWrapper> getPaneChildren(){
        List<WebDriverElemWrapper> res = machine.getChildrenElemWrapper((RemoteWebElement) getPaneElem().getDriverElement());
        ListIterator<WebDriverElemWrapper> iterator = res.listIterator();

        //find start of col attributes
        WebElement attributeHeader = null;
        while (iterator.hasNext()){
            WebElement nextChild = iterator.next().getDriverElement();
            if (nextChild.getText().startsWith("Attributes")) {
                attributeHeader = nextChild;
                attributeColStart = iterator.previousIndex();
                break;
            }
        }

        //find end of   col attributes
        //find start of col metrics
        WebElement metricHeader = null;
        while (iterator.hasNext()){
            WebElement nextChild = iterator.next().getDriverElement();
            if (nextChild.getText().startsWith("Metrics")) {
                metricHeader = nextChild;
                attributeColEnd = iterator.previousIndex();
                metricColStart = attributeColEnd;
                break;
            }
        }

        //find end of   col metrics
        //find start of col filters
        WebElement filterHeader = null;
        while (iterator.hasNext()){
            WebElement nextChild = iterator.next().getDriverElement();
            if (nextChild.getText().startsWith("Filters")) {
                filterHeader = nextChild;
                metricColEnd = iterator.previousIndex();
                filterColStart = metricColEnd;
                break;
            }
        }

        //find end of   col filters
        //find start of col filter values
        WebElement filterValueAllRow = null;
        while (iterator.hasNext()){
            WebElement nextChild = iterator.next().getDriverElement();
            if (nextChild.getText().startsWith("(All)")) {
                filterValueAllRow = nextChild;
                filterColEnd = iterator.previousIndex();
                filterValuesColStart = filterColEnd;
                break;
            }
        }

        return res;
    }

    public WebDriverElemWrapper getAllAttributeElemFromChildren(List<WebDriverElemWrapper> children){
        return children.get(attributeColStart + 1);
    }

    public List<WebDriverElemWrapper> getAttributesFromChildren(List<WebDriverElemWrapper> children){
        List<WebDriverElemWrapper> attributes = new ArrayList<>();
        for (int i = attributeColStart + 3; i < attributeColEnd; i++) {
            WebDriverElemWrapper current = children.get(i);
            addElemIfAttribute(attributes, current);
        }

        return attributes;
    }

    private void addElemIfAttribute(List<WebDriverElemWrapper> attributes, WebDriverElemWrapper current) {
        if (current.getDriverElement().getTagName().equals(isDataset ? "ControlType.CheckBox" : "ControlType.TreeItem"))
            attributes.add(current);
    }


    public WebDriverElemWrapper getAllMetricElemFromChildren(List<WebDriverElemWrapper> children){
        return children.get(metricColStart + 2);
    }

    public List<WebDriverElemWrapper> getMetricsFromChildren(List<WebDriverElemWrapper> children){
        List<WebDriverElemWrapper> metrics = new ArrayList<>();
        for (int i = metricColStart + 3; i < metricColEnd; i++) {
            WebDriverElemWrapper current = children.get(i);
            if (current.getDriverElement().getTagName().equals("ControlType.CheckBox"))
                metrics.add(current);
        }

        return metrics;
    }

    public List<WebDriverElemWrapper> getFiltersFromChildren(List<WebDriverElemWrapper> children) {
        List<WebDriverElemWrapper> filters = new ArrayList<>();
        int limit = filterColEnd == -1 ? children.size() : filterColEnd;
        for (int i = filterColStart + 1; i < limit; i++) {
            WebDriverElemWrapper current = children.get(i);
            if (current.getDriverElement().getTagName().equals("ControlType.TreeItem"))
                filters.add(current);
        }

        return filters;
    }

    public WebDriverElemWrapper getAllFilterValueElemFromChildren(List<WebDriverElemWrapper> children) {
        return children.get(filterValuesColStart);
    }

    public List<WebDriverElemWrapper> getFilterValuesFromChildren(List<WebDriverElemWrapper> children){
        List<WebDriverElemWrapper> filterValues = new ArrayList<>();
        for (int i = filterValuesColStart + 1; i < children.size(); i++) {
            WebDriverElemWrapper current = children.get(i);
            if (current.getDriverElement().getTagName().equals("ControlType.CheckBox"))
                filterValues.add(current);
        }

        return filterValues;
    }
}
