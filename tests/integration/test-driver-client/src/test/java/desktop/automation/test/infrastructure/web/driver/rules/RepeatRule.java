package desktop.automation.test.infrastructure.web.driver.rules;

import desktop.automation.driver.wrappers.DriverType;
import desktop.automation.test.infrastructure.BaseCommonTests;
import org.junit.rules.TestRule;
import org.junit.runner.Description;
import org.junit.runners.model.Statement;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class RepeatRule implements TestRule {

    @Override
    public Statement apply(Statement statement, Description description) {
        return new Statement() {
            @Override
            public void evaluate() throws Throwable {
                try {
                    statement.evaluate();
                } catch (org.openqa.selenium.WebDriverException e){
                    if (DESIRED_DRIVER_TYPE.equals(DriverType.BROWSER)) {
                        System.out.println("caught org.openqa.selenium.WebDriverException exception for browser");
                        System.out.println(e.getMessage());
                        String connectionExceptionMessageStart = "java.net.ConnectException";
                        if (e.getMessage().startsWith(connectionExceptionMessageStart)) {
                            BaseCommonTests.resetBrowser();
                            statement.evaluate();
                        }
                        else
                            throw e;
                    }
                    else
                        throw e;
                }
            }
        };
    }
}
