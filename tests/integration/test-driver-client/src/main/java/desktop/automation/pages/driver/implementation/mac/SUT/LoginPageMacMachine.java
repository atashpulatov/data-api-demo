package desktop.automation.pages.driver.implementation.mac.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.pages.SUT.LoginPage;

import java.io.IOException;
import java.util.Scanner;

import static junit.framework.TestCase.assertEquals;

public class LoginPageMacMachine extends LoginPage {
    public LoginPageMacMachine(Machine machine) {
        super(machine);
    }

    @Override
    public AnyInterfaceElement getLoginBtnElem() throws IOException {
        return getLoginBtnElemWebdriverElem();
    }

    @Override
    public AnyInterfaceElement getStartLoginBtnElem() {
        return getStartLoginBtnWebDriverElem();
    }

    @Override
    public boolean isLoginBtnEnabled() {
        String raw = getLoginBtnElemWebdriverElem().getDriverElement().getAttribute("AXFocusableAncestor");
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
        assertEquals("wrong", getUserNameInputElem().getText());
    }
}
