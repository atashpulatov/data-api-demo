package desktop.automation.pages.SUT.prompts.bases;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;

public abstract class BasePromptWithSingleSelectionListPage extends BasePromptPage {
    public BasePromptWithSingleSelectionListPage(Machine machine) {
        super(machine);
    }

    public AnyInterfaceElement getAddBtnElem(){
        switch (machine.getDriverType()) {
            case MAC_DESKTOP:
                return new ImageComparisonElem(ADD_BTN_IMAGES, 1490, 1590, 400, 620);
            case BROWSER:
            case WINDOWS_DESKTOP:
                machine.focusOnPromptPopUpFrameForBrowser();
                return machine.waitAndFindElemWrapper(ADD_BTN_ELEM);
            default:
                throw new NotImplementedForDriverWrapperException();
        }
    }

    public AnyInterfaceElement getAddAllBtnElem(){
        switch (machine.getDriverType()){
            case MAC_DESKTOP:
                return new ImageComparisonElem(ADD_ALL_BTN_IMAGES, 1490, 1590, 450, 670, 20_000);
            case BROWSER:
            case WINDOWS_DESKTOP:
                machine.focusOnPromptPopUpFrameForBrowser();
                return machine.waitAndFindElemWrapper(ADD_ALL_BTN_ELEM, machine.SIX_UNITS);
            default:
                throw new NotImplementedForDriverWrapperException();
        }
    }

    public AnyInterfaceElement getRemoveBtnElem(){
        switch (machine.getDriverType()){
            case MAC_DESKTOP:
                return new ImageComparisonElem(REMOVE_BTN_IMAGES, 1490, 1590, 540, 760);
            case BROWSER:
            case WINDOWS_DESKTOP:
                machine.focusOnPromptPopUpFrameForBrowser();
                return machine.waitAndFindElemWrapper(REMOVE_BTN_ELEM);
            default:
                throw new NotImplementedForDriverWrapperException();
        }
    }

    public AnyInterfaceElement getRemoveAllBtnElem(){
        switch (machine.getDriverType()){
            case MAC_DESKTOP:
                return new ImageComparisonElem(REMOVE_ALL_BTN_IMAGES, 1490, 1590, 590, 810);
            case BROWSER:
            case WINDOWS_DESKTOP:
                machine.focusOnPromptPopUpFrameForBrowser();
                return machine.waitAndFindElemWrapper(REMOVE_ALL_BTN_ELEM, machine.SIX_UNITS);
            default:
                throw new NotImplementedForDriverWrapperException();
        }
    }
}
