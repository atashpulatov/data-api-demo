package desktop.automation.helpers;

import desktop.automation.elementWrappers.MyLibrarySwitch;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;

class ImportPrepareDataHelperMacMachine {

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
        throw new NotImplementedForDriverWrapperException();
    }

    public static void selectObjectToImportSimple(ImportPrepareDataHelperArgumments argumments) {
        argumments.getMachine().getPreSUTPage().getSheetTabElemByIndex(argumments.getSheetIndex()).click();

        argumments.getMachine().getMainPage().goToCell(argumments.getCell());

        argumments.getMachine().getMainPage().getImportOrAddDataBtnElem(argumments.getFirstImport()).click();

        MyLibrarySwitch myLibSwitch = argumments.getMachine().getImportPromptPage().getMyLibrarySwitch();
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
