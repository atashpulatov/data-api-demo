package desktop.automation.helpers;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.elementWrappers.MyLibrarySwitch;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.exceptions.ImageBasedElemNotFound;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import org.openqa.selenium.By;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebElement;

import java.io.IOException;
import java.util.List;

import static desktop.automation.ConfigVars.SKIP_STANDARD_INITIALIZATION_AND_TEAR_DOWN;
import static desktop.automation.ConfigVars.UTILIZE_INDEX_IMAGE_BASED_PREPARE_DATA_HELPER;
import static desktop.automation.helpers.DebugHelper.here;
import static junit.framework.TestCase.*;

class ImportPrepareDataHelperWindowsMachine {

    public static void importObjectSimple(ImportPrepareDataHelperArgumments argumments){
        selectObjectToImportSimple(argumments);
        argumments.getMachine().getImportPromptPage().getImportBtnElem().click();
    }

    public static void importWithPrepareDataSimple(ImportPrepareDataHelperArgumments argumments) {
        selectObjectToImportSimple(argumments);

        argumments.getMachine().getImportPromptPage().getPrepareDataBtnElem().click();

        prepareDataSimple(argumments);
    }

    public static void prepareDataWithoutImportingSimple(ImportPrepareDataHelperArgumments argumments){
        argumments.getMachine().getPrepareDataPromptPageWindowsMachine().assertPrepareDataPromptTitlePresent(argumments.isDataset(), argumments.getObjectName());

        if (UTILIZE_INDEX_IMAGE_BASED_PREPARE_DATA_HELPER && !SKIP_STANDARD_INITIALIZATION_AND_TEAR_DOWN) {
            prepareDataSimpleIndexAndImageBased(argumments);
        } else{
            clickAttributesSimple(argumments);
            clickMetricsSimple(argumments);
            clickFiltersAndFilterValuesSimple(argumments);
        }
    }

    private static void clickFiltersAndFilterValuesSimple(ImportPrepareDataHelperArgumments argumments) {
        if (argumments.getFiltersAndValuesToChoose() != null && argumments.getFiltersAndValuesToChoose().length != 0) {
            WebDriverElemWrapper[] filters = argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getFilters(
                    argumments.getIndexBasedFilterIndexes(), argumments.getNameBasedFilterNames());
            for (int i = 0; i < argumments.getFiltersAndValuesToChoose().length; i++) {
                FilterAndValues currFilter = argumments.getFiltersAndValuesToChoose()[i];
                if (currFilter instanceof FilterAndValuesIndexBased) {
                    int[] filterValues = ((FilterAndValuesIndexBased) argumments.getFiltersAndValuesToChoose()[i]).getValues();

                    argumments.getMachine().getPrepareDataPromptPageWindowsMachine().clickFilter(filters[i].getDriverElement());

                    WebDriverElemWrapper[] values = argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getFilterValues(filterValues);
                    argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getAndClickGridElems(values);
//                    for (WebElement value : values)
//                        value.click();
                }
                else if (currFilter instanceof FilterAndValuesNameBased) {
                    String[] filterValues = ((FilterAndValuesNameBased) argumments.getFiltersAndValuesToChoose()[i]).getValues();

                    argumments.getMachine().getPrepareDataPromptPageWindowsMachine().clickFilter(filters[i].getDriverElement());

                    WebDriverElemWrapper[] values = argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getFilterValues(filterValues);
                    argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getAndClickGridElems(values);
//                    for (WebElement value : values)
//                        value.click();
                }
                else throw new RuntimeException("Unrecognized FilterAndValues subclass");
            }
        }
    }

    private static void clickMetricsSimple(ImportPrepareDataHelperArgumments argumments) {
        if (argumments.getMetricsToChoose() != null && argumments.getMetricsToChoose().length > 0)
            argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getAndClickMetrics(argumments.getMetricsToChoose());
    }

    private static void clickAttributesSimple(ImportPrepareDataHelperArgumments argumments) {
        if (argumments.getAttributesToChoose() != null && argumments.getAttributesToChoose().length > 0)
            argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getAndClickAttributes(argumments.getAttributesToChoose());
    }

    public static void prepareDataSimple(ImportPrepareDataHelperArgumments argumments){
        prepareDataWithoutImportingSimple(argumments);
        argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getImportBtn().click();
    }

    public static void importWithPrepareDataElaborate(ImportPrepareDataHelperArgumments argumments) {
        selectObjectToImportSimple(argumments);
        argumments.getMachine().getImportPromptPage().getPrepareDataBtnElem().click();
    }

    public static void prepareDataElaborate(ImportPrepareDataHelperArgumments argumments) {
        //TODO assert that after selecting metrics, attributes, filters, the selected count is correct
        argumments.getMachine().getPrepareDataPromptPageWindowsMachine().assertPrepareDataPromptTitlePresent(argumments.isDataset(), argumments.getObjectName());
        argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getAttributeHeader(0, argumments.getImportObject().getAttributeCount());
        argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getMetricHeader(0, argumments.getImportObject().getMetricCount());
        argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getFilterHeader(0, argumments.getImportObject().getAttributeCount());

        //assert that the filter value column is empty
        assertEquals(2, argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getGridElems().size());

        assertFalse(argumments.getMachine().isButtonEnabled(argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getDataPreviewBtnElem()));
//        assertFalse(argumments.getMachine().isButtonEnabled(argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getImportBtn().getDriverElement()));
        assertTrue(argumments.getMachine().isButtonEnabled(argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getCancelBtnElem()));

        WebDriverElemWrapper[] attributesCheckedElems = argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getAndClickAttributes(argumments.getAttributesToChoose());
//        argumments.getMachine().getPrepareDataPromptPageWindowsMachine().allElementsChecked(attributesCheckedElems);

        WebDriverElemWrapper[] metricsCheckedElems = argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getAndClickMetrics(argumments.getMetricsToChoose());
        argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getPromptPaneElem().click();

//        argumments.getMachine().getPrepareDataPromptPageWindowsMachine().allElementsChecked(metricsCheckedElems);
        argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getPromptPaneElem().click();

        WebDriverElemWrapper[] filters = argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getFilters(argumments.getIndexBasedFilterIndexes());
        argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getPromptPaneElem().click();

        for (int i = 0; i < argumments.getFiltersAndValuesToChoose().length; i++) {
            filters[i].click();

            int[] filterValues = ((FilterAndValuesIndexBased)argumments.getFiltersAndValuesToChoose()[i]).getValues();
            WebDriverElemWrapper[] valueElems = argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getAndClickFilterValues(filterValues);
//            argumments.getMachine().getPrepareDataPromptPageWindowsMachine().allElementsChecked(valueElems);
        }

        assertTrue(argumments.getMachine().isButtonEnabled(argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getDataPreviewBtnElem()));
//        assertTrue(argumments.getMachine().isButtonEnabled(argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getImportBtn().getDriverElement()));
        assertTrue(argumments.getMachine().isButtonEnabled(argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getCancelBtnElem()));

        argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getImportBtn().click();
    }

    public static void selectObjectToImportSimple(ImportPrepareDataHelperArgumments argumments) {
        //go to sheet
        argumments.getMachine().getPreSUTPage().getSheetTabElemByIndex(argumments.getSheetIndex()).click();

        //go to cell
        argumments.getMachine().getMainPage().goToCell(argumments.getCell());

        //import object
        argumments.getMachine().getMainPage().getImportOrAddDataBtnElem(argumments.getFirstImport()).click();

        MyLibrarySwitch myLibSwitch = argumments.getMachine().getImportPromptPage().getMyLibrarySwitch();
        if (argumments.isMyLibrarySwitchOn() != myLibSwitch.isOn()) {
            myLibSwitch.clickExplicitlyByActionClass();
        }

        argumments.getMachine().getImportPromptPage().getSearchBarElem().sendKeys(argumments.getObjectName());
//        argumments.getMachine().getImportPromptPage().getObjectToImportNameCellElem(argumments.getObjectName()).click();
        argumments.getMachine().getImportPromptPage().clickFirstObjectToImport();
    }

    public static void selectObjectToImportElaborate(ImportPrepareDataHelperArgumments argumments) {
        throw new NotImplementedForDriverWrapperException();
    }

    private static boolean prepareDataSimpleImageBasedIsInitialized = false;
    private static Point attributeAll = new Point(-1, -1);
    private static Point metricAll = new Point(-1, -1);
    private static Point filterValuesAll = new Point(-1, -1);

    private static Point attributeFirst = new Point(-1, -1);
    private static Point metricFirst = new Point(-1, -1);
    private static Point filterFirst = new Point(-1, -1);
    private static Point filterValueFirst = new Point(-1, -1);

    private static int attributeElemYDiff = -1;
    private static int metricElemYDiff = -1;
    private static int filterElemYDiff = -1;
    private static int filterValuesElemYDiff = -1;

    //images for NOT highlighted checkbox
    private static ImageComparisonElem checkBoxSelected;
    private static ImageComparisonElem checkBoxUnselected;
    private static ImageComparisonElem checkBoxPartiallySelected;

    public static void initPrepareDataSimpleIndexAndImageBased(Machine machine) {
        if (prepareDataSimpleImageBasedIsInitialized)
            return;

        machine.getPrepareDataPromptPage().setDataset(true);
        machine.getMainPage().getImportDataBtnElem().click();

        MyLibrarySwitch myLibSwitch = machine.getImportPromptPage().getMyLibrarySwitch();
        System.out.println("myLibSwitch = " + myLibSwitch.isOn());
        if (myLibSwitch.isOn()) {
            try {
                Thread.sleep(1_000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            here();
            myLibSwitch.clickExplicitlyByActionClass();
        }
        here();

        machine.getImportPromptPage().getSearchBarElemAndSendKeys(ImportPrepareDataHelperArgumments.DEFAULT_DATASET);
//        machine.getImportPromptPage().getObjectToImportNameCellElem(ImportPrepareDataHelperArgumments.DEFAULT_REPORT).click();
        machine.getImportPromptPage().clickFirstObjectToImport();
        machine.getImportPromptPage().getPrepareDataBtnElem().click();

        //initialize prepareDataWithoutImportingSimple
        initPrepareDataPromptElemLocations(machine);

        //cancel
        machine.getPrepareDataPromptPageWindowsMachine().getCancelBtnElem().click();
    }

    private static void initPrepareDataPromptElemLocations(Machine machine){
        String selectedCheckBoxStr = "prepareData/selectedCheckBox";
        String unselectedCheckBoxStr = "prepareData/unselectedCheckBox";
        String partiallySelectedCheckBoxStr = "prepareData/partiallySelectedCheckBox";

        //must be called on an object with at least 2 metrics, 2 attributes, 2 filters, the first filter having at least 2 filter values
        //filters
        WebDriverElemWrapper[] filters = machine.getPrepareDataPromptPageWindowsMachine().getFilters(new int[]{0, 1});
        machine.getPrepareDataPromptPageWindowsMachine().clickFilter(filters[0].getDriverElement());
        filterFirst = filters[0].getDriverElement().getLocation();
        filterElemYDiff = filters[1].getDriverElement().getLocation().getY() - filterFirst.getY();

        //attributes
        WebDriverElemWrapper[] attributes = machine.getPrepareDataPromptPageWindowsMachine().getAttributes(new int[]{0, 1});
        attributes[0] = new WebDriverElemWrapper(attributes[0].getDriverElement().findElement(By.xpath(".//*[@LocalizedControlType=\"check box\"]")));
        attributes[1] = new WebDriverElemWrapper(attributes[1].getDriverElement().findElement(By.xpath(".//*[@LocalizedControlType=\"check box\"]")));

        attributeFirst = attributes[0].getDriverElement().getLocation();
        attributeElemYDiff = attributes[1].getDriverElement().getLocation().getY() - attributeFirst.getY();

        //metrics
        WebDriverElemWrapper[] metrics = machine.getPrepareDataPromptPageWindowsMachine().getMetrics(new int[]{0, 1});
        metrics[0] = new WebDriverElemWrapper(metrics[0].getDriverElement().findElement(By.xpath(".//*[@LocalizedControlType=\"check box\"]")));
        metrics[1] = new WebDriverElemWrapper(metrics[1].getDriverElement().findElement(By.xpath(".//*[@LocalizedControlType=\"check box\"]")));

        metricFirst = metrics[0].getDriverElement().getLocation();
        metricElemYDiff = metrics[1].getDriverElement().getLocation().getY() - metricFirst.getY();

        //filter values
        WebDriverElemWrapper[] filterValues = machine.getPrepareDataPromptPageWindowsMachine().getFilterValues(new int[]{0, 1});
        filterValues[0] = new WebDriverElemWrapper(filterValues[0].getDriverElement().findElement(By.xpath(".//*[@LocalizedControlType=\"check box\"]")));
        filterValues[1] = new WebDriverElemWrapper(filterValues[1].getDriverElement().findElement(By.xpath(".//*[@LocalizedControlType=\"check box\"]")));

        filterValueFirst = filterValues[0].getDriverElement().getLocation();
        filterValuesElemYDiff = filterValues[1].getDriverElement().getLocation().getY() - filterValueFirst.getY();

        //all checkboxs
        List<WebDriverElemWrapper> paneChildren = machine.getPrepareDataPromptPageWindowsMachine().getPaneChildren();
        attributeAll =      machine.getPrepareDataPromptPageWindowsMachine().getAllAttributeElemFromChildren(paneChildren).getDriverElement().findElement(By.xpath(".//*[@LocalizedControlType=\"check box\"]")).getLocation();
        metricAll =         machine.getPrepareDataPromptPageWindowsMachine().getAllMetricElemFromChildren(paneChildren).getDriverElement().findElement(By.xpath(".//*[@LocalizedControlType=\"check box\"]")).getLocation();
        filterValuesAll =   machine.getPrepareDataPromptPageWindowsMachine().getAllFilterValueElemFromChildren(paneChildren).getDriverElement().findElement(By.xpath(".//*[@LocalizedControlType=\"check box\"]")).getLocation();

        //checkbox selected/unselected images
        try {
            WebElement checkboxElem = machine.getPrepareDataPromptPageWindowsMachine().getAllFilterValueElemFromChildren(paneChildren).getDriverElement().findElement(By.xpath(".//*[@LocalizedControlType=\"check box\"]"));
            //unselected checkbox
            machine.takeScreenshot(unselectedCheckBoxStr, checkboxElem, -5, -5, -5, -5);

            checkBoxUnselected = new ImageComparisonElem(unselectedCheckBoxStr,
                    checkboxElem.getLocation().getX() -10,
                    checkboxElem.getLocation().getX() + 40,
                    checkboxElem.getLocation().getY() - 10,
                    checkboxElem.getLocation().getY() + 40);

            machine.actions
                    .moveToElement(checkboxElem)
                    .pause(1_000)
                    .click()
                    .moveByOffset(50, 50)
                    .perform();

            //selected checkbox
            machine.takeScreenshot(selectedCheckBoxStr, checkboxElem, -5, -5, -5, -5);
            checkBoxSelected = new ImageComparisonElem(selectedCheckBoxStr,
                    checkboxElem.getLocation().getX() -10,
                    checkboxElem.getLocation().getX() + 40,
                    checkboxElem.getLocation().getY() - 10,
                    checkboxElem.getLocation().getY() + 40);

            machine.actions
                    .moveToElement(checkboxElem)
                    .pause(1_000)
                    .click(filterValues[1].getDriverElement())
                    .moveByOffset(50, 50)
                    .perform();

            machine.takeScreenshot(partiallySelectedCheckBoxStr, checkboxElem, -5, -5, -5, -5);
            checkBoxPartiallySelected = new ImageComparisonElem(partiallySelectedCheckBoxStr,
                    checkboxElem.getLocation().getX() -10,
                    checkboxElem.getLocation().getX() + 40,
                    checkboxElem.getLocation().getY() - 10,
                    checkboxElem.getLocation().getY() + 40);

            prepareDataSimpleImageBasedIsInitialized = true;
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void prepareDataSimpleIndexAndImageBased(ImportPrepareDataHelperArgumments argumments){
        argumments.getMachine().getPrepareDataPromptPageWindowsMachine().getColumnsAndFiltersSelectionTitleImageBasedElem();

        if (!prepareDataSimpleImageBasedIsInitialized)
            initPrepareDataPromptElemLocations(argumments.getMachine());

        boolean isCrosstab = !argumments.isDataset() && argumments.getMachine().getPrepareDataPromptPage().isCrosstabReport();
        // 5) clicks all the passed values by x,y coordinates.
        // 6) For Filter pane load attempt to look for image of checked and unchecked (All) element checkbox for predefined time out, if failed WinAppDriver find element method
        clickByCoordinates(argumments.getMachine(), attributeAll, attributeFirst, attributeElemYDiff, argumments.getAttributesToChoose(), isCrosstab);
        clickByCoordinates(argumments.getMachine(), metricAll, metricFirst, metricElemYDiff, argumments.getMetricsToChoose(), isCrosstab);
        for (FilterAndValues filterAndValuesRaw : argumments.getFiltersAndValuesToChoose()) {
            FilterAndValuesIndexBased filterAndValues = (FilterAndValuesIndexBased)filterAndValuesRaw;
            clickByCoordinates(argumments.getMachine(), null, filterFirst, filterElemYDiff, new int[]{filterAndValues.getFilter()}, isCrosstab);

            //check for filter value all checkbox presence
            //TODO checkbox image comparison flaky
            try {
                Thread.sleep(10_000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
//            waitForCheckboxToAppear(checkBoxSelected, checkBoxUnselected, checkBoxPartiallySelected,
//                    filterValuesAll.getX() - 10,
//                    filterValuesAll.getX() + 40,
//                    filterValuesAll.getY() - 10,
//                    filterValuesAll.getY() + 40,
//                    20_000);
            clickByCoordinates(argumments.getMachine(), filterValuesAll, filterValueFirst, filterValuesElemYDiff, filterAndValues.getValues(), isCrosstab);
        }
    }

    private static void waitForCheckboxToAppear(ImageComparisonElem checkBoxSelected, ImageComparisonElem checkBoxUnselected, ImageComparisonElem checkBoxPartiallySelected, int startX, int endX, int startY, int endY, int waitInMilliseconds) {
        long start = System.currentTimeMillis();
        ImageComparisonElem[] allCheckBoxImageElems = {checkBoxSelected, checkBoxUnselected, checkBoxPartiallySelected};
        do {
            if (waitForFilterValueAllCheckBox(startX, endX, startY, endY, allCheckBoxImageElems))
                return;
            if (waitInMilliseconds > 0){
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        } while (System.currentTimeMillis() - start < waitInMilliseconds);

        if (!waitForFilterValueAllCheckBox(startX, endX, startY, endY, allCheckBoxImageElems))
            throw new RuntimeException("Failed to find checkbox for (All) filter value");
    }

    private static boolean waitForFilterValueAllCheckBox(int startX, int endX, int startY, int endY, ImageComparisonElem[] allCheckBoxImageElems) {
        for (ImageComparisonElem allChekcBoxImageElem : allCheckBoxImageElems) {
            try {
                allChekcBoxImageElem.find(startX, endX, startY, endY);
                return true;
            } catch (ImageBasedElemNotFound ignored) {
            }
        }

        return false;
    }

    private static void clickByCoordinates(Machine machine, Point allElem, Point firstElem, int elemDiff, int[] elems, boolean isCrosstab) {
        WebElement desktopElem = ImageComparisonElem.getDesktopElem();

        int yOffsetForCrosstab = isCrosstab ? 20 : 0;
        for (int elem : elems) {
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            if (elem == -1){
                machine.actions
                        .moveToElement(desktopElem)
                        .moveByOffset(allElem.getX() - desktopElem.getSize().getWidth() / 2
                                , allElem.getY() - desktopElem.getSize().getHeight() / 2)
                        .moveByOffset(5, 5 + yOffsetForCrosstab)
                        .click()
                        .perform();
            }
            else {
                int targetX = firstElem.getX();
                int targetY = firstElem.getY() + elemDiff * elem;
                machine.actions
                        .moveToElement(desktopElem)
                        .moveByOffset(targetX - desktopElem.getSize().getWidth() / 2,
                                targetY - desktopElem.getSize().getHeight() / 2)
                        .moveByOffset(5, 5 + yOffsetForCrosstab)
                        .click()
                        .perform();
            }
        }
    }
}
