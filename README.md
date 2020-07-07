# python_test
(python_test - name to be changed ;) )

Tests are written in [Gherkin](https://cucumber.io/docs/gherkin/reference/) (natural-like language used by
[Cucumber](https://cucumber.io/) framework). In Python Gherkin tests are executed using
[behave](https://behave.readthedocs.io/en/latest/).

### Content of this README:

1. Prerequisites and installation
1. Running tests
1. TODO

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
- preparing selectors
- image recognition, limitations
- configuration, chromedriver
- reuse in different projects
- attach to open Chrome (Mac, Windows) or Excel (Windows Desktop)
- running in different environments, e.g. executing Python code on Mac, driving Windows Desktop using VirtualBox  
- how to check which test cases are tagged with a given tag (grep -ri '@mac_chrome' *) 

### 1. Prerequisites and installation

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
- [WinAppDriver](https://github.com/Microsoft/WinAppDriver/releases) installed and running, e.g.:

```
"C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe"
```
or
```
"C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe" 192.168.1.248 4723/wd/hub
```

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
[see issue](https://github.com/appium/appium-for-mac/issues/82)) installed and running.

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

### 2. Running tests

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

#### Executing tests

```
# test single feature, Windows Desktop:
behave -D driver_type=windows_desktop tests/F25931_duplicate_object/TC64607_duplicate_object.feature

# test single feature, Mac Chrome, no colors, verbose logging, all logs printed to console: 
behave -D driver_type=mac_chrome --tags=mac_chrome --no-color --logging-level=DEBUG --no-capture-stderr --no-logcapture tests/F25931_duplicate_object/TC64607_duplicate_object.feature

# test all features in F25931_duplicate_object directory, Mac Chrome, no colors, less verbose logging, all logs printed to console:
behave -D driver_type=mac_chrome --tags=mac_chrome --no-color --logging-level=WARNING --no-capture-stderr --no-logcapture tests/F25931_duplicate_object/

# test all features, Mac Chrome, no colors, only steps related information and errors logged, all logs printed to console:
behave -D driver_type=mac_chrome --tags=mac_chrome --no-color --logging-level=ERROR --no-capture-stderr --no-logcapture tests/
```

##### Important parameters

**-D driver_type=driver_name** specifies the target platform to execute test on (the driver to be used),
where **driver_name** is one of available driver types (see [driver_type.py](driver/driver_type.py)):

- windows_desktop
- windows_chrome
- mac_desktop
- mac_chrome

**--tags=tag_name**, specifies which tests to execute (only those tagged **@tag_name**), for simplicity use the same 
values as for **driver_name** (windows_desktop, windows_chrome, mac_desktop, mac_chrome) 

**--logging_level=level** specifies logging level, where level is:

- DEBUG
- WARNING
- ERROR

For complete list of available custom parameters (specified using -D) see [config.json](config/config.json). 

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

### 3. TODO

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
