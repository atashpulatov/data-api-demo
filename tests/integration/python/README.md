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
- [Running tests](docs/running_tests.md)
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
