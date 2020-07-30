### Prerequisites and installation

#### General

- Python3 installed and available in path.

#### General Windows

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

#### Windows Desktop

- Excel Add-In installed
([see details](https://www2.microstrategy.com/producthelp/Current/Office/en-us/Content/install_manually.htm))
- [WinAppDriver](https://github.com/Microsoft/WinAppDriver/releases) installed and `Developer mode` in Windows enabled
(see `Settings / Update & Security / For developers / Use developer features`)

#### Windows Chrome browser

Ensure the version of `resources\chromedriverNN.exe` is the same as the version (NN) of Chrome browser installed.

#### General Mac

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

#### Mac Desktop

- Excel Add-In installed ([see details](https://microstrategy.atlassian.net/wiki/spaces/TECCLIENTS/pages/818920406/Guideline+-+How+to+create+a+new+environment+for+automation+and+manual+testing
))
- [AppiumForMac](https://github.com/appium/appium-for-mac/releases) (not Appium, e.g.
[see issue](https://github.com/appium/appium-for-mac/issues/82)) installed.

#### Mac Chrome browser

Ensure the version of `resources\chromedriverNN.exe` is the same as the version (NN) of Chrome browser installed
and this file has proper permissions (-rwxr-xr-x):

```console
-rwxr-xr-x  1 user  group  15093428 Jun 22 17:38 resources/chromedriverNN
```

To change permission execute from shell:

```console
chmod a+rx resources/chromedriverNN
```
