package desktop.automation.helpers;

import desktop.automation.elementWrappers.MyLibrarySwitch;

class ImportPrepareDataHelperMacMachine {
    //TODO encapsulate various assertions

    public static void importObjectSimple(ImportPrepareDataHelperArgumments argumments){
        selectObjectToImportSimple(argumments);
        argumments.getMachine().getImportPromptPage().getImportBtnElem().click();
    }

    public static void importObjectElaborate(ImportPrepareDataHelperArgumments argumments){
        selectObjectToImportElaborate(argumments);
        argumments.getMachine().getImportPromptPage().getImportBtnElem().click();
    }

    public static void importWithPrepareDataSimple(ImportPrepareDataHelperArgumments argumments) {
        selectObjectToImportSimple(argumments);
        argumments.getMachine().getImportPromptPage().getPrepareDataBtnElem().click();
        prepareDataSimple(argumments);
    }

    public static void importWithPrepareDataElaborate(ImportPrepareDataHelperArgumments argumments) {
        selectObjectToImportElaborate(argumments);
        argumments.getMachine().getImportPromptPage().getPrepareDataBtnElem().click();
        prepareDataElaborate(argumments, false);
        argumments.getMachine().getPrepareDataPromptPageMacMachine().getImportBtn().click();
    }

    public static void prepareDataSimple(ImportPrepareDataHelperArgumments argumments){
        prepareDataWithoutImportingSimple(argumments);
        argumments.getMachine().getPrepareDataPromptPageMacMachine().getImportBtn().click();
    }

    public static void prepareDataWithoutImportingSimple(ImportPrepareDataHelperArgumments argumments){
        argumments.getMachine().getPrepareDataPromptPageMacMachine().getTitleStartElem(argumments.isDataset());
        argumments.getMachine().getPrepareDataPromptPageMacMachine().getTitleNameElem(argumments.getObjectName());

        argumments.getMachine().getPrepareDataPromptPageMacMachine().clickAttributes(argumments.getAttributesToChoose());

        argumments.getMachine().getPrepareDataPromptPageMacMachine().clickMetrics(argumments.getMetricsToChoose());

        for (FilterAndValues filterAndValues : argumments.getFiltersAndValuesToChoose()) {
            FilterAndValuesIndexBased filterAndValuesIndexBased = (FilterAndValuesIndexBased)filterAndValues;
            argumments.getMachine().getPrepareDataPromptPageMacMachine().getFilterElemByIndex(filterAndValuesIndexBased.getFilter()).click();

            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            for (int filterValueIndex : filterAndValuesIndexBased.getValues()) {
                argumments.getMachine().getPrepareDataPromptPageMacMachine().getFilterValueByIndex(filterValueIndex).click();
            }
        }
    }


    public static void prepareDataElaborate(ImportPrepareDataHelperArgumments argumments, boolean allCheckedAtStart) {
//        //TODO assert that total count remains the same throughout changes
//        argumments.getMachine().getPrepareDataPromptPageMacMachine().getTitleStartElem(argumments.isDataset());
//        argumments.getMachine().getPrepareDataPromptPageMacMachine().getTitleNameElem(argumments.getObjectName());
//
//        try {
//            Thread.sleep(5_000);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }
//        //assert attribute header shows correct values
//        int actualAttrTotalCnt = Integer.parseInt(argumments.getMachine().getPrepareDataPromptPageMacMachine().getAttributeTotalCountElem().getText());
//        assertEquals(argumments.getImportObject().getAttributeCount(), actualAttrTotalCnt);
//        int actualAttrSelectedCnt = Integer.parseInt(argumments.getMachine().getPrepareDataPromptPageMacMachine().getAttributeSelectedCountElem().getText());
//        assertInitialAttributeSelectedCount(argumments, actualAttrSelectedCnt, allCheckedAtStart);
//
//        //assert metric header shows correct values
//        int actualMetricTotalCnt = Integer.parseInt(argumments.getMachine().getPrepareDataPromptPageMacMachine().getMetricTitleTotalCountElem().getText());
//        assertEquals(argumments.getImportObject().getMetricCount(), actualMetricTotalCnt);
//        int actualMetricSelectedCnt = Integer.parseInt(argumments.getMachine().getPrepareDataPromptPageMacMachine().getMetricTitleSelectedCountElem().getText());
//        assertInitialMetricSelectedCount(argumments, actualMetricSelectedCnt, allCheckedAtStart);
//
//        //assert filter header shows correct values
//        int actualFilterTotalCnt = Integer.parseInt(argumments.getMachine().getPrepareDataPromptPageMacMachine().getFiltersTitleTotalCountElem().getText());
//        assertEquals(argumments.getImportObject().getAttributeCount(), actualFilterTotalCnt);
//        int actualFilterSelectedCnt = Integer.parseInt(argumments.getMachine().getPrepareDataPromptPageMacMachine().getFiltersTitleSelectedCountElem().getText());
//        assertInitialSelectorFilterCnt(argumments, actualFilterSelectedCnt);
//
//        //assert filter value column is empty
//        argumments.getMachine().getPrepareDataPromptPageMacMachine().assertFilterValuePaneNotPresent();
//
//        //TODO assert all buttons enabled (can't since disabled button appears as different node, requires image recognition)
//
//        //Attributes
//        //choose attributes
//        for (int attributeIndex : argumments.getAttributesToChoose()) {
//            argumments.getMachine().getPrepareDataPromptPageMacMachine().getAttributeElemByIndex(attributeIndex).click();
//        }
//
//        //assert checkboxes of attributes are marked correctly
//        List<WebElementWithBooleanAXValue> attrCheckboxes = argumments.getMachine().getPrepareDataPromptPageMacMachine().getAllAttributeCheckboxes();
//        boolean[] finalAttrChecked = getFinalAttributeTickedCheckboxArray(argumments, allCheckedAtStart);
//        for (int i = 0; i < attrCheckboxes.size(); i++){
//            assertEquals(finalAttrChecked[i], attrCheckboxes.get(i).isSelected());
//        }
//
//        //assert correct attribute count is marked as selected
//        int expectedSelectedAttrCount = getExpectedSelectedCount(finalAttrChecked);
//        argumments.getMachine().getPrepareDataPromptPageMacMachine().assertAttributeSelectedCountIsAsExpected(expectedSelectedAttrCount);
//
//        //Metrics
//        //choose metrics
//        for (int metricIndex : argumments.getMetricsToChoose()) {
//            argumments.getMachine().getPrepareDataPromptPageMacMachine().getMetricElemByIndex(metricIndex).click();
//        }
//        List<WebElementWithBooleanAXValue> metricCheckboxes = argumments.getMachine().getPrepareDataPromptPageMacMachine().getAllMetricCheckboxes();
//
//        //assert checkboxes of metrics are marked correctly
//        boolean[] finalMetricsChecked = getFinalMetricsTickedCheckboxArray(argumments, allCheckedAtStart);
//        for (int i = 0; i < metricCheckboxes.size(); i++){
//            assertEquals(finalMetricsChecked[i], metricCheckboxes.get(i).isSelected());
//        }
//
//        //assert correct attribute count is marked as selected
//        int expectedSelectedMetricCount = getExpectedSelectedCount(finalMetricsChecked);
//        argumments.getMachine().getPrepareDataPromptPageMacMachine().assertMetricSelectedCountIsAsExpected(expectedSelectedMetricCount);
//
//        //Filters and their values
//        int selectedFilterCount = argumments.getInitiallySelectedFiltersAndValues() == null ? 0 : argumments.getInitiallySelectedFiltersAndValues().length;
//        for (FilterAndValues filterAndValues : argumments.getFiltersAndValuesToChoose()) {
//            argumments.getMachine().getPrepareDataPromptPageMacMachine().getFilterElemByIndex(filterAndValues.getFilter()).click();
//
//            //if more than one filter, need to wait for the filter value pane to be replaced
//            try {
//                Thread.sleep(500);
//            } catch (InterruptedException e) {
//                e.printStackTrace();
//            }
//
//            for (int filterValueIndex : filterAndValues.getValues()) {
//                argumments.getMachine().getPrepareDataPromptPageMacMachine().getFilterValueByIndex(filterValueIndex).click();
//            }
//
//            List<WebElementWithBooleanAXValue> filterValueCheckboxes = argumments.getMachine().getPrepareDataPromptPageMacMachine().getAllFilterValeCheckboxes();
//            //TODO static size, refactor filter values from int array to an object with size field
//            boolean[] finalFilterValuesChecked = getFinalFilterAndValuesTickedCheckboxArray(argumments, false, filterAndValues, 100);
//            for (int i = 0; i < filterValueCheckboxes.size(); i++){
//                assertEquals(finalFilterValuesChecked[i], filterValueCheckboxes.get(i).isSelected());
//            }
//
//            //assert correct filter value count is marked as selected
//            //TODO cover scenario where 0 filter values are selected ultimately
//            int expectedSelectedFilterValueCount = getExpectedSelectedCount(finalFilterValuesChecked);
//            argumments.getMachine().getPrepareDataPromptPageMacMachine().assertFilterValueSelectedCountIsAsExpected(filterAndValues.getFilter(), expectedSelectedFilterValueCount);
//
//            //TODO check if works
//            //assert total filter value is as expected
//            int expectedTotalFilterValueCount = argumments.getImportObject().getAttributeAndValues()[filterAndValues.getFilter()].getValueCount();
//            argumments.getMachine().getPrepareDataPromptPageMacMachine().assertFilterValueTotalCountIsAsExpected(filterAndValues.getFilter(), expectedTotalFilterValueCount);
//
//            //assert selected filter count is updated
//            argumments.getMachine().getPrepareDataPromptPageMacMachine().assertFilterSelectedCountIsAsExpected(++selectedFilterCount);
//        }
//
//        //TODO assert all buttons enabled (can't since disabled button appears as different node, requires image recognition)
    }

    public static void selectObjectToImportSimple(ImportPrepareDataHelperArgumments argumments) {
        argumments.getMachine().getPreSUTPage().getSheetTabElemByIndex(argumments.getSheetIndex()).click();

        argumments.getMachine().getMainPage().goToCell(argumments.getCell());

        argumments.getMachine().getMainPage().getImportOrAddDataBtnElem(argumments.getFirstImport()).click();

        MyLibrarySwitch myLibSwitch = argumments.getMachine().getImportPromptPage().getMyLibrarySwitchElem();
        if (argumments.isMyLibrarySwitchOn() != myLibSwitch.isOn())
            myLibSwitch.getDriverElement().click();

        argumments.getMachine().getImportPromptPage().getSearchBarElem().sendKeys(argumments.getObjectName());
        argumments.getMachine().getImportPromptPage().clickFirstObjectToImport();
    }

    public static void selectObjectToImportElaborate(ImportPrepareDataHelperArgumments argumments) {
        argumments.getMachine().getPreSUTPage().getSheetTabElemByIndex(argumments.getSheetIndex());

        argumments.getMachine().getMainPage().goToCell(argumments.getCell());

        argumments.getMachine().getMainPage().getImportOrAddDataBtnElem(argumments.getFirstImport()).click();

        argumments.getMachine().getImportPromptPage().getImportBtnElem();
        argumments.getMachine().getImportPromptPage().getImportBtnElem();
        //TODO assert cancel button enabled (can't find a disabled elem, requires image comparison)

        argumments.getMachine().getImportPromptPage().getSearchBarElem().sendKeys(argumments.getObjectName());
        argumments.getMachine().getImportPromptPage().clickFirstObjectToImport();
    }
}
