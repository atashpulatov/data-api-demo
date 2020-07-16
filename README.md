# python_test
(python_test - name to be changed ;) )

Tests are written in [Gherkin](https://cucumber.io/docs/gherkin/reference/) (natural-like language used by
[Cucumber](https://cucumber.io/) framework). In Python Gherkin tests are executed using
[behave](https://behave.readthedocs.io/en/latest/).

### Content of this README:

- Prerequisites and installation
- Running tests
- Developer environment
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
- attach to open Chrome (Mac, Windows) or Excel (Windows Desktop)
- running in different environments, e.g. executing Python code on Mac, driving Windows Desktop using VirtualBox  
- how to check which test cases are tagged with a given tag (grep -ri '@mac_chrome' *) 

### Prerequisites and installation

##### General

- Python3 installed and available in path.

##### General Windows

- Python venv environment created and activated:

```
cd PROJECT_DIR
python3 -m venv venv_win
venv_win\Scripts\Activate
```

- Python modules installed:

```
pip install selenium
pip install Appium-Python-Client
pip install behave
pip install Pillow
pip install opencv-python-headless
```

##### Windows Desktop

- Excel Add-In installed ([see details](https://www2.microstrategy.com/producthelp/Current/Office/en-us/Content/install_manually.htm))
- [WinAppDriver](https://github.com/Microsoft/WinAppDriver/releases) installed. TODO Enable developer mode

##### General Mac

- Python venv environment created and activated:

```
cd PROJECT_DIR
python3 -m venv venv_mac
source venv_mac/bin/activate
```

- Python modules installed:

```
pip install selenium
pip install Appium-Python-Client
pip install behave
pip install Pillow
pip install opencv-python-headless
```

##### Mac Desktop

- Excel Add-In installed ([see details](https://microstrategy.atlassian.net/wiki/spaces/TECCLIENTS/pages/818920406/Guideline+-+How+to+create+a+new+environment+for+automation+and+manual+testing
))
- [AppiumForMac](https://github.com/appium/appium-for-mac/releases) (not Appium, e.g.
[see issue](https://github.com/appium/appium-for-mac/issues/82)) installed.

##### Mac Chrome browser

Ensure version of **resources/chromedriverNN** is the same as Chrome browser installed (NN) and this file has proper
permissions (-rwxr-xr-x):

```
-rwxr-xr-x  1 user  group  15093428 Jun 22 17:38 resources/chromedriverNN
```

To change permission execute from shell:

```
chmod a+rx resources/chromedriverNN
```

### Running tests

#### Activate Python venv environment:

##### Windows

```
cd PROJECT_DIR
venv_win\Scripts\Activate
```

##### Mac

```
cd PROJECT_DIR
source venv_mac/bin/activate
```

#### Run driver software (for Desktop environments)

##### Windows Desktop

Run `WinAppDriver` from command line as Administrator, e.g.:

```
"C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe" 127.0.0.1 4723/wd/hub
"C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe" EXTERNAL_IP 4723/wd/hub
```

##### Mac Desktop

Run `AppiumForMac`.

#### Executing tests

Examples of running tests:

```
# test single feature, Windows Desktop, default logging:
behave -D driver_type=windows_desktop tests/F25931_duplicate_object/TC64607_duplicate_object.feature

# test single feature, Windows Desktop, verbose logging:
behave -D driver_type=windows_desktop --no-color --logging-level=DEBUG --no-capture-stderr --no-logcapture  tests/F25931_duplicate_object/TC64607_duplicate_object.feature 2> log.err.txt |tee log.out.txt

# test single feature, Mac Chrome, no colors, verbose logging, all logs printed to console: 
behave -D driver_type=mac_chrome --tags=@mac_chrome --no-color --logging-level=DEBUG --no-capture-stderr --no-logcapture tests/F25931_duplicate_object/TC64607_duplicate_object.feature

# test all features in F25931_duplicate_object directory, Mac Chrome, no colors, less verbose logging, all logs printed to console:
behave -D driver_type=mac_chrome --tags=@mac_chrome --no-color --logging-level=WARNING --no-capture-stderr --no-logcapture tests/F25931_duplicate_object/

# test all features, Mac Chrome, no colors, only steps related information and errors logged, all logs printed to console:
behave -D driver_type=mac_chrome --tags=@mac_chrome --no-color --logging-level=ERROR --no-capture-stderr --no-logcapture tests/
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
or session. Speeds up tests development allowing to e.g. skip first part of the test (TODO see attaching
to existing Excel or browser session).

`-D browser_existing_session_executor_url=url` specifies `url` address used when attaching to an existing browser
session (TODO see attaching to existing Excel or browser session).

`-D browser_existing_session_id=session_id` specifies `session_id` address used when attaching to an existing browser
session (TODO see attaching to existing Excel or browser session).

`-D windows_desktop_excel_root_element_name=root_element_name` specifies Windows Desktop root Excel element name
(e.g. `Book1 - Excel`) (TODO see attaching to existing Excel or browser session).

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

### Developer environment

#### Navigating from feature file to step definition in `Visual Studio Code`

- install `Cucumber (Gherkin) Full Support` extension
- go to `Settings` (Command/Control + ,)
- search for `Cucumberautocomplete`
- click on the `Edit` in `settings.json`
- add following lines:
```
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
