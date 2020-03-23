package desktop.automation.helpers;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class ImportPrepareDataHelper {
    public static void importObject(ImportPrepareDataHelperArgumments argumments) {
        switch (DESIRED_DRIVER_TYPE) {
            case BROWSER:
                ImportPrepareDataHelperBrowser.importObjectSimple(argumments);
                break;
            case MAC_DESKTOP:
                ImportPrepareDataHelperMacMachine.importObjectSimple(argumments);
                break;
            case WINDOWS_DESKTOP:
                ImportPrepareDataHelperWindowsMachine.importObjectSimple(argumments);
                break;
            default:
                throw new NotImplementedForDriverWrapperException();
        }
        handleImportRefreshProcess(argumments);
    }

    public static void importWithPrepareDataSimple(ImportPrepareDataHelperArgumments argumments) {
        argumments.getMachine().getPrepareDataPromptPage().setDataset(argumments.isDataset());
        switch (DESIRED_DRIVER_TYPE) {
            case BROWSER:
                ImportPrepareDataHelperBrowser.importWithPrepareDataSimple(argumments);
                break;
            case MAC_DESKTOP:
                ImportPrepareDataHelperMacMachine.importWithPrepareDataSimple(argumments);
                break;
            case WINDOWS_DESKTOP:
                ImportPrepareDataHelperWindowsMachine.importWithPrepareDataSimple(argumments);
                break;
            default:
                throw new NotImplementedForDriverWrapperException();
        }
        handleImportRefreshProcess(argumments);
    }

    public static void prepareDataWithoutImportingSimple(ImportPrepareDataHelperArgumments argumments) {
        argumments.getMachine().getPrepareDataPromptPage().setDataset(argumments.isDataset());
        switch (DESIRED_DRIVER_TYPE) {
            case BROWSER:
                ImportPrepareDataHelperBrowser.prepareDataWithoutImportingSimple(argumments);
                break;
            case MAC_DESKTOP:
                ImportPrepareDataHelperMacMachine.prepareDataWithoutImportingSimple(argumments);
                break;
            case WINDOWS_DESKTOP:
                ImportPrepareDataHelperWindowsMachine.prepareDataWithoutImportingSimple(argumments);
                break;
            default:
                throw new NotImplementedForDriverWrapperException();
        }
    }

    public static void prepareDataSimple(ImportPrepareDataHelperArgumments argumments) {
        argumments.getMachine().getPrepareDataPromptPage().setDataset(argumments.isDataset());
        switch (DESIRED_DRIVER_TYPE) {
            case BROWSER:
                ImportPrepareDataHelperBrowser.prepareDataSimple(argumments);
                break;
            case MAC_DESKTOP:
                ImportPrepareDataHelperMacMachine.prepareDataSimple(argumments);
                break;
            case WINDOWS_DESKTOP:
                ImportPrepareDataHelperWindowsMachine.prepareDataSimple(argumments);
                break;
            default:
                throw new NotImplementedForDriverWrapperException();
        }
        handleImportRefreshProcess(argumments);
    }

    public static void importWithPrepareDataElaborate(ImportPrepareDataHelperArgumments argumments) {
        switch (DESIRED_DRIVER_TYPE) {
            case BROWSER:
                ImportPrepareDataHelperBrowser.importWithPrepareDataElaborate(argumments);
                break;
            case MAC_DESKTOP:
                ImportPrepareDataHelperMacMachine.importWithPrepareDataElaborate(argumments);
                break;
            case WINDOWS_DESKTOP:
                ImportPrepareDataHelperWindowsMachine.importWithPrepareDataElaborate(argumments);
                break;
            default:
                throw new NotImplementedForDriverWrapperException();
        }
        handleImportRefreshProcess(argumments);
    }

    public static void prepareDataElaborate(ImportPrepareDataHelperArgumments argumments) {
        switch (DESIRED_DRIVER_TYPE) {
            case BROWSER:
                ImportPrepareDataHelperBrowser.prepareDataElaborate(argumments);
                break;
            case MAC_DESKTOP:
                ImportPrepareDataHelperMacMachine.prepareDataElaborate(argumments, true);
                break;
            case WINDOWS_DESKTOP:
                ImportPrepareDataHelperWindowsMachine.prepareDataElaborate(argumments);
                break;
            default:
                throw new NotImplementedForDriverWrapperException();
        }
        handleImportRefreshProcess(argumments);
    }

    public static void selectObjectToImportSimple(ImportPrepareDataHelperArgumments argumments) {
        switch (DESIRED_DRIVER_TYPE) {
            case BROWSER:
                ImportPrepareDataHelperBrowser.selectObjectToImportSimple(argumments);
                break;
            case MAC_DESKTOP:
                ImportPrepareDataHelperMacMachine.selectObjectToImportSimple(argumments);
                break;
            case WINDOWS_DESKTOP:
                ImportPrepareDataHelperWindowsMachine.selectObjectToImportSimple(argumments);
                break;
            default:
                throw new NotImplementedForDriverWrapperException();
        }
    }

    public static void selectObjectToImportElaborate(ImportPrepareDataHelperArgumments argumments) {
        switch (DESIRED_DRIVER_TYPE) {
            case BROWSER:
                ImportPrepareDataHelperBrowser.selectObjectToImportElaborate(argumments);
                break;
            case MAC_DESKTOP:
                ImportPrepareDataHelperMacMachine.selectObjectToImportElaborate(argumments);
                break;
            case WINDOWS_DESKTOP:
                ImportPrepareDataHelperWindowsMachine.selectObjectToImportElaborate(argumments);
                break;
            default:
                throw new NotImplementedForDriverWrapperException();
        }
    }

    public static void initPrepareDataSimpleIndexAndImageBased(Machine machine) {
        ImportPrepareDataHelperWindowsMachine.initPrepareDataSimpleIndexAndImageBased(machine);
    }

    private static void handleImportRefreshProcess(ImportPrepareDataHelperArgumments argumments) {
        if (argumments.isEditFlow())
            argumments.getMachine().getImportingDataSingleRefreshPopUpPage().assertRefreshSingleFlow(argumments.isDataset(), argumments.getImportRefreshFlowTimeOut());
        else
            argumments.getMachine().getImportingDataSingleRefreshPopUpPage().assertImportSingleFlow(argumments.getImportRefreshFlowTimeOut());
    }
}
