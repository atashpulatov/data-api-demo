package desktop.automation.pages.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.elementWrappers.MyLibrarySwitch;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.elementWrappers.windows.RadioButton;
import desktop.automation.selectors.SUT.ImportPromptPageSelectors;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.text.SimpleDateFormat;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertFalse;

public abstract class ImportPromptPage extends ImportPromptPageSelectors {
    protected Machine machine;
    private static final SimpleDateFormat modifiedColFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");

    protected static final String SEARCH_BAR_IMAGE_1 = "importPromptPage/searchBar1";
    protected static final String SEARCH_BAR_IMAGE_2 = "importPromptPage/searchBar2";
    protected static final By MY_LIBRARY_SWITCH_ELEM_1 = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXGroup[0]/AXCheckBox[@AXSubrole='AXSwitch']");
    public ImportPromptPage(Machine machine) {
        this.machine = machine;
    }

    public AnyInterfaceElement getTitleElem(){
        WebDriverElemWrapper res = machine.waitAndFindElemWrapper(TITLE, machine.TWO_UNITS);
        if (machine.isBrowser())
            assertEquals("Import Data", res.getDriverElement().getText());

        return res;
    }

    public void assertPromptNotOpen(){
        if (machine.isBrowser()){
            machine.focusOnExcelFrameForBrowser();
            assertEquals(1, machine.driver.findElements(By.cssSelector(".AddinIframe")).size());
        }
        else
            machine.assertNotPresent(TITLE);
    }

    public WebElement getMyLibraryLblElem(){
        return machine.waitAndFind(MY_LIBRARY_LBL_ELEM);
    }

    public MyLibrarySwitch getMyLibrarySwitchElem(){
        machine.focusOnImportDataPopUpFrameForBrowser();
        WebElement element;
        if (machine.isMacMachine())
            element = machine.waitAndFind(new By[]{MY_LIBRARY_SWITCH_ELEM, MY_LIBRARY_SWITCH_ELEM_1});
        else
            element = machine.waitAndFind(MY_LIBRARY_SWITCH_ELEM);

        return MyLibrarySwitch.getSwitch(element, machine.getDriverType());
    }

    public WebElement getRefreshBtnElem(){
        return machine.waitAndFind(REFRESH_BTN_ELEM);
    }

    public WebElement getFiltersBtnElem(){
        return machine.waitAndFind(FILTERS_BTN_ELEM);
    }

    public abstract AnyInterfaceElement getSearchBarElem();

    public AnyInterfaceElement getSearchBarImageComparisonElem(){
        ImageComparisonElem res = new ImageComparisonElem(new String[]{SEARCH_BAR_IMAGE_1, SEARCH_BAR_IMAGE_2}, 1465, 1725, 125, 190,
                10_000, 400);
        try {
            Thread.sleep(1_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return res;
    }

    public AnyInterfaceElement getSearchBarElemAndSendKeys(String message){
        AnyInterfaceElement searchBarElem = getSearchBarElem();
        searchBarElem.sendKeys(message);

        return searchBarElem;
    }

    public abstract String getSearchBarInputText(WebElement searchBarElem);

    public abstract void clickFirstObjectToImport();

    //TODO Mac desktop list of objects not interactble due to Accessibility defects were table and rows of table are identified as unknown,
    // after defect fix check by object name instead of coordinates
//    public abstract void clickObjectToImportNameCell(String nameOfObject);

    public abstract AnyInterfaceElement getImportBtnElem();

    public void clickImportDataBtnAndAssertImportFlow(){
        getImportBtnElem().click();
        machine.getImportingDataSingleRefreshPopUpPage().assertImportSingleFlow(180);
    }

    public void clickImportDataBtnAndAssertRefreshFlowSingle(boolean isDataset){
        getImportBtnElem().click();
        machine.getImportingDataSingleRefreshPopUpPage().assertRefreshSingleFlow(isDataset, 180);
    }

    public abstract WebDriverElemWrapper getPrepareDataBtnElem();

    public WebElement getCancelBtnElem(){
        machine.focusOnImportDataPopUpFrameForBrowser();
        return machine.waitAndFind(CANCEL_BTN_ELEM);
    }

    public abstract AnyInterfaceElement getNameHeaderElem();

    public WebElement getOwnerHeaderElem(){
        return machine.waitAndFind(OWNER_HEADER_ELEM);
    }

    public WebElement getApplicationHeaderElem(){
        return machine.waitAndFind(APPLICATION_HEADER_ELEM);
    }

    public WebElement getModifiedHeaderElem(){
        return machine.waitAndFind(MODIFIED_HEADER_ELEM);
    }

//    private List<WebElement> getObjectRadioBtnElems() {
//        //deprecated
//        //adds overhead, but uses the WebDriverWait
//        machine.waitAndFind(OBJECT_TO_IMPORT_RADIO_BTN_ELEM);
//
//        return machine.driver.findElements(OBJECT_TO_IMPORT_RADIO_BTN_ELEM);
//    }

//    public List<RadioButton> getObjectRadioBtns() {
//        //deprecated
//        List<WebElement> rbElems = getObjectRadioBtnElems();
//
//        List<RadioButton> res = new LinkedList<>();
//        for (WebElement rbElem : rbElems) {
//            res.add(new RadioButton(rbElem));
//        }
//
//        return res;
//    }

    public void assertAllObjectRadioBtnsDisabled(List<RadioButton> rbs){
        for (RadioButton btn : rbs) {
            assertFalse(btn.isSelected());
        }
    }

//    public void assertOnlyTargetObjectSelected(String name){
//        WebElement target = getObjectToImportNameCellElem(name);
//        List<RadioButton> rbs = getObjectRadioBtns();
//
//        int index = ((WindowsMachine)machine).getGridIndex(target);
//        assertTrue(rbs.get(index).isSelected());
//
//        rbs.remove(index);
//        assertAllObjectRadioBtnsDisabled(rbs);
//    }


    //TODO handle elements that failed to be retrieved. Right now asserts that there are more than 10 elems retrieved for each sort assertion
//    public List<IndexedWebElement> getFirstFifteenObjectNameElems(){
//        return machine.iterateOverBase(OBJECT_TO_IMPORT_NAME_BASE, 0, 15);
//    }
//
//    public List<WebElement> getObjectNameElemsUntilExceptionEncountered(){
//        return machine.iterateOverBaseUntilExceptionEncountered(OBJECT_TO_IMPORT_NAME_BASE);
//    }
//
//    public List<IndexedWebElement> getFirstFifteenObjectOwnerNameElems(){
//        return machine.iterateOverBase(OBJECT_TO_IMPORT_OWNER_BASE, 0, 15);
//    }
//
//    public List<IndexedWebElement> getFirstFifteenObjectApplicationNameElems(){
//        return machine.iterateOverBase(OBJECT_TO_IMPORT_APPLICATION_BASE, 0, 15);
//    }
//
//    public List<IndexedWebElement> getFirstFifteenObjectModifiedDateElems(){
//        return machine.iterateOverBase(OBJECT_TO_IMPORT_MODIFIED_BASE, 0, 15);
//    }
//
//    public List<Date> getFirstFifteenObjectModifiedDates() throws ParseException {
//        List<IndexedWebElement> raw = getFirstFifteenObjectModifiedDateElems();
//
//        List<Date> res = new LinkedList<>();
//        for (IndexedWebElement indexedWebElement : raw) {
//            String rawStr = indexedWebElement.getText().trim();
//
////            int start = rawStr.indexOf('-') + 1;
////            String monthStr = rawStr.substring(start, start + 2);
////            int monthInt = Integer.parseInt(monthStr) - 1;
////
////            rawStr = new StringBuilder(rawStr).replace(start, start + 2, monthInt + "").toString();
//
//            res.add(modifiedColFormat.parse(rawStr));
//        }
//
//        return res;
//    }
//
//    public List<IndexedWebElement> assertSortOrderAndGetFirstFifteenObjectNameElems(boolean isSortedAscending){
//        List<IndexedWebElement> res = getFirstFifteenObjectNameElems();
//        assertTextElemsAreSorted(res, isSortedAscending);
//
//        return res;
//    }
//
//    public List<IndexedWebElement> assertSortOrderAndGetFirstFifteenObjectOwnerNameElems(boolean isSortedAscending){
//        List<IndexedWebElement> res = getFirstFifteenObjectOwnerNameElems();
//        assertTextElemsAreSorted(res, isSortedAscending);
//
//        return res;
//    }
//
//    public List<IndexedWebElement> assertSortOrderAndGetFirstFifteenApplicationNameElems(boolean isSortedAscending){
//        List<IndexedWebElement> res = getFirstFifteenObjectApplicationNameElems();
//        assertTextElemsAreSorted(res, isSortedAscending);
//
//        return res;
//    }
//
//    public List<IndexedWebElement> assertSortOrderAndGetFirstFifteenModifiedDateElems(boolean isSortedAscending) throws ParseException {
//        List<IndexedWebElement> res = getFirstFifteenObjectModifiedDateElems();
//        assertDateElemsAreSorted(isSortedAscending);
//
//        return res;
//    }
//
//    private void assertDateElemsAreSorted(boolean isSortedAscending) throws ParseException {
//        List<Date> dates = getFirstFifteenObjectModifiedDates();
//        assertTrue(10 < dates.size());
//
//        ListIterator<Date> iterator = dates.listIterator();
//        Date prev = iterator.next();
//        while (iterator.hasNext()) {
//            Date next = iterator.next();
//            int comparisonResult = next.compareTo(prev);
//            try {
//                assertTrue(isSortedAscending ? comparisonResult >= 0 : comparisonResult <= 0);
//            } catch (junit.framework.AssertionFailedError e){
//                //adding a catch clause to the assertion so that cpu-cycles aren't wasted generating message (hopefully)
//                String message = String.format("expected the given values: %s, %s, to be sorted in %s order.",
//                        modifiedColFormat.format(prev), modifiedColFormat.format(next), isSortedAscending ? "ascending" : "descending");
//                throw new RuntimeException(message, e);
//            }
//        }
//    }
//
//    private void assertTextElemsAreSorted(List<IndexedWebElement> elems, boolean isSortedAscending) {
//        assertTrue(10 < elems.size());
//
//        ListIterator<IndexedWebElement> iterator = elems.listIterator();
//        IndexedWebElement prev = iterator.next();
//        while (iterator.hasNext()) {
//            IndexedWebElement next = iterator.next();
//            int comparisonResult = next.getText().toLowerCase().compareTo(prev.getText().toLowerCase());
//            try {
//                assertTrue(isSortedAscending ? comparisonResult >= 0 : comparisonResult <= 0);
//            } catch (junit.framework.AssertionFailedError e){
//                //adding a catch clause to the assertion so that cpu-cycles aren't wasted generating message (hopefully)
//                String message = String.format("expected the given values: %s, %s, to be sorted in %s order.",
//                        prev, next, isSortedAscending ? "ascending" : "descending");
//                throw new RuntimeException(message, e);
//            }
//            prev = next;
//        }
//    }
}
