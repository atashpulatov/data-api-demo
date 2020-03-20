package desktop.automation.helpers;

import desktop.automation.elementWrappers.MyLibrarySwitch;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;

public class ImportPrepareDataHelperBrowser {

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
        prepareDataElaborate(argumments);
        argumments.getMachine().getPrepareDataPromptPage().getImportBtn().click();
    }

    public static void prepareDataSimple(ImportPrepareDataHelperArgumments argumments){
        prepareDataWithoutImportingSimple(argumments);
        argumments.getMachine().getPrepareDataPromptPage().getImportBtn().click();

    }

    public static void prepareDataWithoutImportingSimple(ImportPrepareDataHelperArgumments argumments){
        argumments.getMachine().focusOnImportDataPopUpFrameForBrowser();

        argumments.getMachine().getPrepareDataPromptPage().assertPrepareDataPromptTitlePresent(argumments.isDataset(), argumments.getObjectName());

        argumments.getMachine().getPrepareDataPromptPage().clickAttributes(argumments.getAttributesToChoose());

        argumments.getMachine().getPrepareDataPromptPage().clickMetrics(argumments.getMetricsToChoose());

        argumments.getMachine().getPrepareDataPromptPage().clickFiltersAndFilterValues(argumments.getFiltersAndValuesToChooseIndexBased());
    }


    public static void prepareDataElaborate(ImportPrepareDataHelperArgumments argumments) {
        throw new NotImplementedForDriverWrapperException();
    }

    public static void selectObjectToImportSimple(ImportPrepareDataHelperArgumments argumments) {
        argumments.getMachine().getPreSUTPage().getSheetTabElemByIndex(argumments.getSheetIndex()).clickExplicitlyByActionClass();

        argumments.getMachine().getMainPage().goToCell(argumments.getCell());

        argumments.getMachine().getMainPage().getImportOrAddDataBtnElem(argumments.getFirstImport()).click();

        MyLibrarySwitch myLibSwitch = argumments.getMachine().getImportPromptPage().getMyLibrarySwitch();
        if (argumments.isMyLibrarySwitchOn() != myLibSwitch.isOn())
            myLibSwitch.clickExplicitlyByActionClass();

        argumments.getMachine().getImportPromptPage().getSearchBarElem().sendKeys(argumments.getObjectName());
        argumments.getMachine().getImportPromptPage().clickFirstObjectToImport();
    }

    public static void selectObjectToImportElaborate(ImportPrepareDataHelperArgumments argumments) {
        throw new NotImplementedForDriverWrapperException();
    }

    public static void handleImportProcess(ImportPrepareDataHelperArgumments argumments){
    }
}
