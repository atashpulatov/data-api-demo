# python_test
(python_test - name to be changed ;) )

**python_test** is a test automation framework and implementation of automated tests for **MicroStrategy
Excel add-in**.

It supports [behavior-driven development (BDD)](https://en.wikipedia.org/wiki/Behavior-driven_development) and tests 
execution on different platforms. Thanks to modular architecture and use of Page Object Model pattern, tests
definitions are common for all platforms and it's easy to write and maintain tests and add support for new platforms. 

Tests are written in [Gherkin](https://cucumber.io/docs/gherkin/reference/), a natural-like language developed
as part of [Cucumber](https://cucumber.io/) framework. Example:

```gherkin
Feature: FMMMM - Import object

  Scenario: [TCNNNNN] - Simple import object
    Given I logged in as default user
      And I clicked Import Data button
      And I found and selected object "report to be imported"
      
     When I clicked Import button
     
     Then number of worksheets should be 1
      And cell "A42" should have value "42"
```

Currently tests can be executed on: Windows Desktop, Windows Chrome, Mac Desktop, Mac Chrome.

### Content of this README:

- [Prerequisites and installation](docs/prerequisites_and_installation.md)
- [Running tests](#running_tests)
- [Running tests remotely on Windows Desktop](#running_tests_remotely_on_windows_desktop)
- [Running tests using existing application session](#running_tests_using_existing_application_session)
- [Adding a new test](#adding_a_new_test)
- [Adding a new Page](#adding_a_new_page)
- [Adding support for a new platform](#adding_support_for_a_new_platform)
- [Developer's notes](#developers_notes)
- [Developer's environment](#developers_environment)
- TODO

README TODO:

- BDD https://en.wikipedia.org/wiki/Behavior-driven_development
- tests, Gherkin
- steps (use @step; not @given, @when, @then)
- pages, page object model
- driver factory, selecting driver
- sets of pages
- base pages, page utils
- base elements
- pages factory, selecting set of pages
- utils
- stability issues, pause()
- performance
- preparing selectors https://accessibilityinsights.io/en/downloads
- image recognition, limitations
- configuration, chromedriver
- reuse in different projects
- running in different environments, e.g. executing Python code on Mac, driving Windows Desktop using VirtualBox  
- how to check which test cases are tagged with a given tag (grep -ri '@mac_chrome' *) 
- attach to open session, Chrome (Mac, Windows) and Excel (Windows Desktop, Mac Desktop) already described

<a name="prerequisites_and_installation"></a>
### Prerequisites and installation

##### General

- Python3 installed and available in path.

##### General Windows

- Python venv environment created and activated:

```console
cd PROJECT_DIR/tests/integration/python
python3 -m venv venv_win
venv_win\Scripts\Activate
```

- Python modules installed:

```console
pip install selenium
pip install Appium-Python-Client
pip install behave
pip install Pillow
pip install opencv-python-headless
pip install pyperclip
```

##### Windows Desktop

- Excel Add-In installed
([see details](https://www2.microstrategy.com/producthelp/Current/Office/en-us/Content/install_manually.htm))
- [WinAppDriver](https://github.com/Microsoft/WinAppDriver/releases) installed and `Developer mode` in Windows enabled
(see `Settings / Update & Security / For developers / Use developer features`)

##### General Mac

- Python venv environment created and activated:

```console
cd PROJECT_DIR/tests/integration/python
python3 -m venv venv_mac
source venv_mac/bin/activate
```

- Python modules installed:

```console
pip install selenium
pip install Appium-Python-Client
pip install behave
pip install Pillow
pip install opencv-python-headless
pip install pyperclip
```

##### Mac Desktop

- Excel Add-In installed ([see details](https://microstrategy.atlassian.net/wiki/spaces/TECCLIENTS/pages/818920406/Guideline+-+How+to+create+a+new+environment+for+automation+and+manual+testing
))
- [AppiumForMac](https://github.com/appium/appium-for-mac/releases) (not Appium, e.g.
[see issue](https://github.com/appium/appium-for-mac/issues/82)) installed.

##### Mac Chrome browser

Ensure version of **resources/chromedriverNN** is the same as Chrome browser installed (NN) and this file has proper
permissions (-rwxr-xr-x):

```console
-rwxr-xr-x  1 user  group  15093428 Jun 22 17:38 resources/chromedriverNN
```

To change permission execute from shell:

```console
chmod a+rx resources/chromedriverNN
```

<a name="running_tests"></a>
### Running tests

#### Activate Python venv environment:

##### Windows

```console
cd PROJECT_DIR/tests/integration/python
venv_win\Scripts\Activate
```

##### Mac

```console
cd PROJECT_DIR/tests/integration/python
source venv_mac/bin/activate
```

#### Preparation for test execution for Chrome

No additional preparation steps are necessary for `Mac Chrome` and `Windows Chrome`.

#### Preparation for test execution for Desktop environments

##### Windows Desktop

Run `WinAppDriver` from command line as Administrator, e.g.:

```console
"C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe" 127.0.0.1 4723/wd/hub
"C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe" EXTERNAL_IP 4723/wd/hub
```

##### Mac Desktop

Run `AppiumForMac`.

#### Executing tests

Examples of running tests:

```bash
# test single feature, default logging:
behave tests/F25931_duplicate_object/TC64607_duplicate_object.feature

# test single feature, verbose logging:
behave --no-color --logging-level=DEBUG --no-capture-stderr --no-logcapture tests/F25931_duplicate_object/TC64607_duplicate_object.feature

# test single feature, verbose logging, redircting logs to files:
behave --no-color --logging-level=DEBUG --no-capture-stderr --no-logcapture tests/F25931_duplicate_object/TC64607_duplicate_object.feature 2>> log.err.txt | tee log.out.txt

# test single feature, no colors, verbose logging, all logs printed to console: 
behave --tags=@mac_chrome --no-color --logging-level=DEBUG --no-capture-stderr --no-logcapture tests/F25931_duplicate_object/TC64607_duplicate_object.feature

# test all features in F25931_duplicate_object directory, Mac Chrome, no colors, less verbose logging, all logs printed to console:
behave --tags=@mac_chrome --no-color --logging-level=WARNING --no-capture-stderr --no-logcapture tests/F25931_duplicate_object/

# test all features, no colors, only steps related information and errors logged, all logs printed to console:
behave --tags=@mac_chrome --no-color --logging-level=ERROR --no-capture-stderr --no-logcapture tests/
```

##### Test execution parameters

All custom parameters values can be defined in [config.json](config/config.json) file or as `behave` command options
(specified using `-D`, takes precedence over configuration file). For complete list of available custom parameters see
[config.json](config/config.json).

For `behave` options (no `-D` flag) see [behave documentation](https://behave.readthedocs.io/en/latest/).

`-D driver_type=driver_name` specifies the target platform to execute test on (the driver to be used),
where `driver_name` is one of available driver types (see [driver_type.py](driver/driver_type.py)):

- windows_desktop
- windows_chrome
- mac_desktop
- mac_chrome

`--tags=@tag_name`, specifies which tests to execute (only those tagged `@tag_name`), for simplicity use the same 
values as for `driver_name` (`@windows_desktop`, `@windows_chrome`, `@mac_desktop`, `@mac_chrome`).

Tags related to selecting tests for different tasks (e.g. release or GA validation, CI execution) are going to be
added, e.g. @release_validation. To execute only tests tagged @windows_desktop AND @release_validation use `--tags`
multiple times:

`--tags=@windows --tags=@release_validation`.

`-D image_recognition_enabled=True` enables (`True`) or disables (`False`) usage of image recognition to speed up
tests execution. Works only when implemented for selected driver (see `-D driver_type`), currently only
`windows_desktop`. 

`-D connect_to_existing_session_enabled=True` enables (`True`) or disables (`False`) attaching to an existing Excel
or session. Speeds up tests development allowing to e.g. skip first part of the test (see: Running tests using existing
application session).

`-D browser_existing_session_executor_url=url` specifies `url` address used when attaching to an existing browser
session (see: Running tests using existing application session).

`-D browser_existing_session_id=session_id` specifies `session_id` address used when attaching to an existing browser
session (see: Running tests using existing application session).

`-D windows_desktop_excel_root_element_name=root_element_name` specifies Windows Desktop root Excel element name
(e.g. `Book1 - Excel`) (see: Running tests using existing application session).

`-D cleanup_after_test_enabled=True` enables (`True`) or disables (`False`) cleaning up after test execution (closing
Excel or browser). Useful for debug purposes when developing tests.

`-D driver_path_windows_desktop=path` specifies `path` to Excel for Windows Desktop.

`-D driver_path_windows_chrome=path` specifies `path` to `chromiumdriver.exe` for Windows Desktop.

`-D driver_path_mac_chrome=path` specifies `path` to `chromiumdriver` for Mac Desktop.

`-D host_url_mac_desktop=url` specifies `url` to running `AppiumForMac`, used when executing tests on Mac Desktop.

`-D host_url_windows_desktop=url` specifies `url` to running `WinAppDriver`, used when executing tests
on Windows Desktop.

`-D excel_add_in_environment=environemnt` specifies `environemnt` name used to select which Excel Add In should be
started. Used on Windows Desktop and Mac Desktop.

`-D excel_desktop_add_in_import_data_name=import_name` specifies `import_name` string used when choosing which
Excel Add In should be started. Used in browsers.

`-D excel_user_name=user_name` specifies `user_name` used when logging in to Excel in browser.
 
`-D excel_user_password=user_password` specifies `user_password` used when logging in to Excel in browser. 

`--logging_level=level` specifies logging level, where `level` is:

- DEBUG _(the most verbose)_
- WARNING _(somehow verbose)_
- ERROR _(almost quiet, only errors)_

`--no-skipped` disables printing skipped steps (due to tags).

`--no-color` disables the use of ANSI color escapes.

`--no-logcapture` disables logging capture.

`--no-capture-stderr` disables capturing stderr (any stderr output will be printed immediately).

`--format allure_behave.formatter:AllureFormatter` configures formatting tests results for reporting with Allure.

`-o folder/` specifies tests results output folder when formatting is configured for using Allure.  

<a name="running_tests_remotely_on_windows_desktop"></a>
#### Running tests remotely on Windows Desktop

To start test on one machine (e.g. Mac) and execute it on remote Windows Desktop, it's necessary to enable communication
between those machines by ensuring port 4723 is open for incoming network traffic in Windows Desktop firewall 
or by configuring reversed tunnel, using e.g. PuTTy.

##### Configure Windows Desktop using firewall

1. Go to Windows machine.

1. Ensure port `4723` is open for incoming network communication on Windows machine (TODO describe).

1. Check IP address of your Windows machine in your local network, using e.g. `ipconfig`.

1. Run `WinAppDriver` from command line (`cmd`) as Administrator with: 

    ```
    "C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe" IP_ADDRESS_IN_LOCAL_NETWORK 4723/wd/hub
    ```

##### Configure Windows Desktop using PuTTy

1. Go to Windows machine.

1. Install [PuTTy](https://www.putty.org/).

1. Using PuTTY, configure connection to your Mac:
    ```
    In Session:
        Host Name (or IP address): address of your Mac, e.g. 192.168.1.19
        Port: 22
        Connection type: SSH
        Saved Session: meaningful name
    In Connection -> SSH -> Tunnels
        Source port: 4723
        Destination: 127.0.0.1:4723
        Select 'Remote' radio button (important!)
        Click 'Add' (important!)
    In Session:
        Click 'Save'
    ```
1. Double click on the saved connection name to open the PuTTY console.

1. Enter username and password for your Mac computer.

1. Run `WinAppDriver` from command line as Administrator with: 

    ```console
    "C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe" 127.0.0.1 4723/wd/hub
    ```
Tip: 

```
If you can't connect, please check your file path to the WinAppDriver.exe.
```

##### Configure and run test on Mac machine

1. In your IDE in `config.json` change:
   - `driver_path_windows_desktop` to path to Excel on your Windows machine
   - `host_url_windows_desktop` to `http://IP_ADDRESS_IN_LOCAL_NETWORK:4723/wd/hub` (firewall configuration), or
   - `host_url_windows_desktop` to `http://127.0.0.1:4723/wd/hub` (PuTTy configuration)
   - `excel_add_in_environment` and `excel_desktop_add_in_import_data_name` to the ones you deployed on Excel Desktop
   for Windows
   
1. Run test as usual on your Mac, but for `driver_type` use `windows_desktop`: 
   - `"driver_type": "windows_desktop"` (in `config.json`), or
   - `-D driver_type=windows_desktop` (in command line)

<a name="running_tests_using_existing_application_session"></a>
#### Running tests using existing application session

To speed-up writing tests, it's possible to run tests using already open Excel session. 

##### Configuration for Mac Chrome

###### I. Acquire execution url and session id

1. In `config.json` set:

    ```json
    "connect_to_existing_session_enabled": false,
    "cleanup_after_test_enabled": false,
    ```
    
1. Run first test with `--logging-level=WARNING` and no log capturing, e.g.:

    ```console
    behave --no-color --logging-level=WARNING --no-capture-stderr --no-logcapture tests/debug_features/empty.feature
    ```
 
1. Copy `session_id` and `execution_url` (should look like this):

    ```console
    WARNING:root:Starting WebDriver, execution_url: [http://127.0.0.1:59498], session_id: [d26e0c8f59db329bb2a75f9a85fbb93c]
    ```
    
1. Paste `session_id` and `execution_url` to `config.json`:

    ```json
    "browser_existing_session_executor_url": "http://127.0.0.1:59498",
    "browser_existing_session_id": "d26e0c8f59db329bb2a75f9a85fbb93c",
    ```

1. New browser session should stay open. 

###### II. Execute test

1. In `config.json` set:

    ```json
    "connect_to_existing_session_enabled": true,
    "cleanup_after_test_enabled": false,
    ```

1. Using open browser session, go to the application state you would like to continue work on. 

1. Run the test you're working on starting from the step you need (comment out steps not needed now). Ensure test
starts from (perhaps artificial)`Given`, e.g. `Given I pass`.

##### Configuration for Windows Desktop

1. In `config.json` set:

    ```json
    "connect_to_existing_session_enabled": true,
    "cleanup_after_test_enabled": false,
    ```
    
1. Open Excel Desktop application.

1. Make sure your Workbook is named as in `config.json`:
    ```json
    "windows_desktop_excel_root_element_name": "Book1 - Excel",
    ```

1. Go to the application state you would like to continue work on. 

1. Run the test you're working on starting from the step you need (comment out steps not needed now). Ensure test
starts from (perhaps artificial)`Given`, e.g. `Given I pass`.

##### Configuration for Mac Desktop

1. In `config.json` set:

    ```json
    "connect_to_existing_session_enabled": true,
    "cleanup_after_test_enabled": false,
    ```
    
1. Open Excel Desktop application.

1. Go to the application state you would like to continue work on. 

1. Run the test you're working on starting from the step you need (comment out steps not needed now). Ensure test
starts from (perhaps artificial)`Given`, e.g. `Given I pass`.

Tip 1:
```
In our automation, all test cases start from the login step, make sure you prepared the Excel app to have 
the AddIn opened. If you'd like to start from further step in the test, comment out steps you don't want to execute.
```

Tip 2:
```
Test Scenario must start with a 'Given' given step. When original first step is commented out
(e.g. Given I logged in as default user), it's necessary to add artifical 'Given' step, e.g.:

Given I pass
```

<a name="adding_a_new_test"></a>
### Adding a new test

To add a new test:

1. Add `.feature` test file written in [Gherkin](https://cucumber.io/docs/gherkin/reference/),
e.g. `tests/F25931_duplicate_object/TC64607_duplicate_object.feature`:

    ```gherkin
    @windows_desktop
    @windows_chrome
    @mac_desktop
    @mac_chrome
    Feature: F25931 - Duplicate object
    
      Scenario: [TC64607] - Duplicate object
        Given I logged in as default user
          And I clicked Import Data button
          And MyLibrary Switch is OFF
    
          And I found and selected object "100_report"
          And I clicked Import button
          And I closed all notifications
          And number of worksheets should be 1
    
         When I clicked Duplicate on object 1
          And I clicked Import button in Duplicate popup
    
         Then object number 1 should be called "100_report Copy"
          And number of worksheets should be 2
    
          And I log out
    ```

1. Add all necessary Steps to steps files in `tests/steps`. Steps should correspond 1-1 to Pages, each set of steps
is related to one Page in tested application. Example of Steps file: `tests/steps/right_side_panel_tile_steps.py`:

    ```python
    from behave import *
    
    
    @step('I closed last notification')
    def step_impl(context):
        context.pages.right_panel_tile_page().close_last_notification_on_hover()

    ``` 

1. Implement all methods in appropriate Pages (e.g. `close_last_notification_on_hover()` in
`RightPanelTileWindowsDesktopPage`, `RightPanelTileBrowserPage` etc.) and ensure Pages are added to all Page Sets,
see `Adding a new Page`.

<a name="adding_a_new_page"></a>
### Adding a new Page

To add a new Page implementing Page Object Model:

1. Implement the Page, e.g. `pages/right_panel/right_panel_tile/right_panel_tile_browser_page.py`:
    ```python
    (...)
    class RightPanelTileBrowserPage(BaseBrowserPage):
        (...)
        def close_last_notification_on_hover(self):
            self.focus_on_add_in_frame()
    
            self._hover_over_tile(0)
        (...)
    ```

1. Add information about the Page to all Page Sets to make it available:

    - `pages_factory/abstract_pages.py` (abstract class implemented by all Page Sets, no implementation here), e.g.:
        ```python
        @abstractmethod
        def right_panel_tile_page(self):
            pass
        ```
    - `pages_factory/pages_*.py` (it's necessary to add appropriate method definition to all Page Sets)
       - when Page is implemented for a given Page Set:
        ```python
        from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage
        (...)
        class PagesSetBrowser(AbstractPagesSet):
            def __init__(self):
                super().__init__()
                (...)
                self.right_panel_tile_browser_page = RightPanelTileBrowserPage()
                (...)
    
            def import_data_popup_page(self):
                return self.import_data_popup_browser_page
        ``` 
       - when Page is not yet implemented for a given Page Set:
        ```python
            def import_data_popup_page(self):
                pass
        ``` 

1. Add Steps file corresponding to newly added Page to `tests/steps`, e.g. `tests/steps/right_side_panel_tile_steps.py`:

    ```python
    from behave import *
    
    
    @step('I closed last notification')
    def step_impl(context):
        context.pages.right_panel_tile_page().close_last_notification_on_hover()

    ``` 

<a name="adding_support_for_a_new_platform"></a>
### Adding support for a new platform

To add support for a new platform it's necessary to configure a new driver and create and configure a new Pages Set.

1. New driver:

    - in `driver/driver_new_platform.py` add `DriverNewPlatform` class implementing `AbstractDriver`  
    - add appropriate constants to `driver/driver_type.py`
    - register new driver class in `DriverFactory` in `driver/driver_factory.py`
   
1. New Pages Set:
    - in `pages_set/pages_set_new_platform.py` add `PagesSetNewPlatform` class implementing `AbstractPagesSet`
    - register new Pages Set in `PagesSetFactory` in `pages_set/pages_set_factory.py` 

<a name="developers_notes"></a>
### Developer's notes

##### Code formatting

1. Python code should be formatted according to
[PEP 8 - Style Guide for Python Code](https://www.python.org/dev/peps/pep-0008/) with maximum line length
of 120 characters.

1. Gherking code should be formatted as follows (please notice steps indentation):

```gherkin
Feature: FMMMM - Import object

  Scenario: [TCNNNNN] - Simple import object
    Given I logged in as default user
      And I clicked Import Data button
      And I found and selected object "report to be imported"
      
     When I clicked Import button
     
     Then number of worksheets should be 1
      And cell "A42" should have value "42"
```

<a name="developers_environment"></a>
### Developer's environment

##### Navigating from feature file to step definition in `Visual Studio Code`

- install `Cucumber (Gherkin) Full Support` extension
- go to `Settings` (Command/Control + ,)
- search for `Cucumberautocomplete`
- click on the `Edit` in `settings.json`
- add following lines:

```json
"cucumberautocomplete.steps": [
    "tests/steps/*.py"
],
"cucumberautocomplete.syncfeatures": "tests/*/*feature",
```

- restart `Visual Studio Code`
- open a feature file and right click a step and select `Go To Definition`

### TODO

- change usage of send_keys as it's not stable on Windows Desktop (potentially in other environments too), 
sometimes some chars are not sent;
entered values can be checked using - Windows Desktop: element.text (text node of element),
Mac Chrome: element.get_attribute('value') (input element)
- Windows Desktop - each time search for "MicroStrategy for Office"?
- reporting
- executing tests by Jenkins
- re-executing failing tests
- parallel test execution 
- use assertions library instead of simple Python's assert?
- test 0 verifying required objects existence
- support for different languages (Excel, app)
- multiple test execution in case of failure
