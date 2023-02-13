# Installation

Before running automated tests it's necessary to install Python, Python modules, Excel and tools necessary for
communication with browser or operating system (see below for exact set of requirements for each supported platform).
It's one-time installation.

Tests can be started (`behave` command running `Gherkin` tests) and executed (in a browser or `Excel` application)
on **one machine**: 

- [Windows Desktop](#windows_desktop)
- [Windows Chrome browser](#windows_chrome_browser)
- [Mac Desktop](#mac_desktop)
- [Mac Chrome browser](#mac_chrome_browser)

or can be started (`behave` command) on one machine but executed (in `Excel` application) on the other machine (physical
or virtual, e.g. using VirtualBox) - **remote tests execution**.

- [Starting tests on Mac and executing them on remote Windows Desktop](#start_on_mac_execute_on_windows)

<a name="windows_desktop"></a>
### Windows Desktop

1. Install Python3 and make it available in PATH.

1. Create and activate Python venv environment:

    ```console
    cd PROJECT_DIR/tests/integration/python
    python3 -m venv venv_win
    venv_win\Scripts\Activate
    ```
    
1. Install Python modules:

   ```console
   python -m ensurepip --upgrade
   pip install -r requirements.txt
   ```

1. Copy `framework/config/config.json.DIST` to `framework/config/config.json` and adjust configuration as needed.

1. Ensure `driver_path_windows_desktop` is set to `Excel` location in `config.json` or as a command
line parameter.

1. Install Excel Add-In
([see details](https://www2.microstrategy.com/producthelp/Current/Office/en-us/Content/install_manually.htm)).

1. Install [WinAppDriver](https://github.com/Microsoft/WinAppDriver/releases) and enable `Developer mode` in Windows 
(see `Settings / Update & Security / For developers / Use developer features`). **Note: ensure `Developer mode` is
on, warning message regarding remote deployment or Windows Device Portal can be ignored.**

1. Troubleshooting: If you encounter problems with launching EXCEL desktop try removing venv_win directory. 
And run steps 2 to 6 modifying the **step 3** by running 
   ```console
   python -m ensurepip --upgrade
   pip install -r requirements_stable.txt
   ```


<a name="windows_chrome_browser"></a>
### Windows Chrome browser

1. Install Python3 and make it available in PATH.

1. Create and activate Python venv environment:

    ```console
    cd PROJECT_DIR/tests/integration/python
    python3 -m venv venv_win
    venv_win\Scripts\Activate
    ```
    
1. Install Python modules:

   ```console
   python -m ensurepip --upgrade
   pip install -r requirements.txt
   ```

1. Copy `framework/config/config.json.DIST` to `framework/config/config.json` and adjust configuration as needed.

1. Ensure the version of `framework\resources\chromedriverNN.exe` is the same as the version (NN) of Chrome browser
installed in Windows.

1. Ensure `driver_path_windows_chrome` configuration variable is set correctly (in `config.json` or as a command
line parameter).

<a name="mac_desktop"></a>
### Mac Desktop

1. Install Python3 and make it available in PATH.

1. Create and activate Python venv environment:

    ```console
    cd PROJECT_DIR/tests/integration/python
    python3 -m venv venv_mac
    source venv_mac/bin/activate
    ```

1. Install Python modules:

   ```console
   python -m ensurepip --upgrade
   pip install -r requirements.txt
   ```

1. Copy `framework/config/config.json.DIST` to `framework/config/config.json` and adjust configuration as needed.

1. Install Excel Add-In ([see details](https://microstrategy.atlassian.net/wiki/spaces/TECCLIENTS/pages/818920406/Guideline+-+How+to+create+a+new+environment+for+automation+and+manual+testing
))

1. install [AppiumForMac](https://github.com/appium/appium-for-mac/releases) (not Appium, e.g.
[see this issue](https://github.com/appium/appium-for-mac/issues/82)).

<a name="mac_chrome_browser"></a>
### Mac Chrome browser

1. Install Python3 and make it available in PATH.

1. Create and activate Python venv environment:

    ```console
    cd PROJECT_DIR/tests/integration/python
    python3 -m venv venv_mac
    source venv_mac/bin/activate
    ```

1. Install Python modules:

   ```console
   python -m ensurepip --upgrade
   pip install -r requirements.txt
   ```

1. Copy `framework/config/config.json.DIST` to `framework/config/config.json` and adjust configuration as needed.

1. Ensure the version of `framework/resources/chromedriverNN` is the same as the version (NN) of Chrome browser
installed and this file has proper permissions (-rwxr-xr-x):

    ```console
    -rwxr-xr-x  1 user  group  15093428 Jun 22 17:38 framework/resources/chromedriverNN
    ```
    
    To change permission execute from shell:
    
    ```console
    chmod a+rx framework/resources/chromedriverNN
    ```

1. Ensure `driver_path_mac_chrome` configuration variable is set correctly (in `config.json` or as a command
line parameter).

<a name="start_on_mac_execute_on_windows"></a>
### Starting tests on Mac and executing them on remote Windows Desktop

##### On Windows:

1. Install Excel Add-In
([see details](https://www2.microstrategy.com/producthelp/Current/Office/en-us/Content/install_manually.htm)).

1. Install [WinAppDriver](https://github.com/Microsoft/WinAppDriver/releases) and enable `Developer mode` in Windows 
(see `Settings / Update & Security / For developers / Use developer features`). **Note: ensure `Developer mode` is
on, warning message regarding remote deployment or Windows Device Portal can be ignored.** 

1. Enable communication between Mac and Windows by ensuring port 4723 is open for incoming network traffic in
Windows Desktop firewall or by configuring reversed tunnel, using e.g. PuTTy. Choose on option, preferably
simpler firewall configuration:

    - **Configure Windows Desktop using firewall**

        1. Go to Windows machine.
        
        1. Ensure port `4723` is open for incoming network communication on Windows machine.

    - **Configure Windows Desktop using PuTTy**

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

##### On Mac:

1. Install Python3 and make available in PATH.

1. Create and activate Python venv environment:

    ```console
    cd PROJECT_DIR/tests/integration/python
    python3 -m venv venv_mac
    source venv_mac/bin/activate
    ```

1. Install Python modules:
   
   ```console
   python -m ensurepip --upgrade
   pip install -r requirements.txt
   ```

1. Copy `framework/config/config.json.DIST` to `framework/config/config.json` and adjust configuration as needed.

1. When using **PuTTy** Windows Desktop configuration: enable `Remote Login` in `Preferences / Sharing` (no need to
do it when using firewall configuration).
