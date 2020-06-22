# python_test
(python_test - name to be changed ;) )

Tests are written in [Gherkin](https://cucumber.io/docs/gherkin/reference/) (natural-like language used by
[Cucumber](https://cucumber.io/) framework). In Python Gherkin tests are executed using
[behave](https://behave.readthedocs.io/en/latest/).

### Content of this README:

1. Prerequisites and installation
1. Running tests
1. TODO developer's docs, limitations, examples etc. 

### 1. Prerequisites and installation

##### General

1. Python3 installed and available in path.

##### General Windows

1. Python venv environment created and activated:

```
cd PROJECT_DIR
python3 -m venv venv_win
venv_win\Scripts\Activate
```

2. Python modules installed:

```
pip install selenium
pip install Appium-Python-Client
pip install behave
pip install Pillow
pip install opencv-python-headless
```

##### Windows Desktop

1. [WinAppDriver](https://github.com/Microsoft/WinAppDriver/releases) installed and running, e.g.:

```
"C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe"
```
or
```
"C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe" 192.168.1.248 4723/wd/hub
```

##### General Mac

1. Python venv environment created and activated:

```
cd PROJECT_DIR
python3 -m venv venv_mac
source venv_mac/bin/activate
```

2. Python modules installed:

```
pip install selenium
pip install Appium-Python-Client
pip install behave
pip install Pillow
pip install opencv-python-headless
```

##### Mac Desktop

1. [AppiumForMac](https://github.com/appium/appium-for-mac/releases) (not Appium) installed and running.

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
behave -D DRIVER_TYPE=windows_desktop tests/behave/F25931_duplicate_object/TC64607_duplicate_object.feature

# test single feature, Mac Chrome, no colors, verbose logging, all logs printed to console: 
behave -D DRIVER_TYPE=mac_chrome --no-color --logging-level=DEBUG --no-capture-stderr --no-logcapture tests/behave/F25931_duplicate_object/TC64607_duplicate_object.feature

# test all features in F25931_duplicate_object directory, Mac Chrome, no colors, less verbose logging, all logs printed to console:
behave -D DRIVER_TYPE=mac_chrome --no-color --logging-level=WARNING --no-capture-stderr --no-logcapture tests/behave/F25931_duplicate_object/

# test all features, Mac Chrome, no colors, only steps related information and errors logged, all logs printed to console:
behave -D DRIVER_TYPE=mac_chrome --no-color --logging-level=ERROR --no-capture-stderr --no-logcapture tests/behave/
```

##### Important parameters

**-D DRIVER_TYPE=driver_name**, where **driver_name** is one of available driver types (see [driver_type.py](driver/driver_type.py)):

- windows_desktop
- windows_chrome
- mac_desktop
- mac_chrome

**--logging_level=level**, where level is:

- DEBUG
- WARNING
- ERROR
