package desktop.automation.pages.driver.implementation.mac.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.SUT.LoginPage;

import java.util.Scanner;

import static junit.framework.TestCase.assertEquals;

public class LoginPageMacMachine extends LoginPage {
    public LoginPageMacMachine(Machine machine) {
        super(machine);
    }

    @Override
    public AnyInterfaceElement getStartLoginBtnElem() {
        return machine.waitAndFindElemWrapper(OPEN_LOGIN_PROMPT_BTN_ELEM, machine.TWO_UNITS);
    }

    @Override
    public boolean isLoginBtnEnabled() {
        String raw = ((WebDriverElemWrapper)getLoginBtnElem()).getDriverElement().getAttribute("AXFocusableAncestor");

        try (Scanner scanner = new Scanner(raw)) {
            String actualValue = null;
            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                String[] tmp = line.split("=");
                if (tmp[0].trim().matches("AXDescription")) {
                    actualValue = tmp[1].trim();
                }
            }

            return !"\"login disabled\";".equals(actualValue);
        }
    }

    @Override
    public void assertUserNameValueAsExpected(String expected) {
        assertEquals(expected, getUserNameInputElemWebElement().getText());
    }
}
