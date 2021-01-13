# MicroStrategy for Office

Add-in for Microsoft Office applications and MicroStrategy.

[![Build Status](https://jenkins.internal.microstrategy.com/buildStatus/icon?job=mstr-office-.-m2020-.-stage-1-dev)](https://jenkins.internal.microstrategy.com/view/mstr-office/view/m2020/job/mstr-office-.-m2020-.-stage-1-dev/)

## Getting Started

### Prerequisites

* Office Online, Office 365, Office 2016 or later
* Node.js LTS
* ssh-key added to your github account (our project depends on 2nd repository, that we contribute, that contains reusable MicroStrategy React components)
To add key follow instructions on our [github](https://help.github.com/enterprise/2.16/user/articles/generating-an-ssh-key/)


### Installing

Start by cloning the repository:

```
git clone git@github.microstrategy.com:Kiai/mstr-office.git
```

Navigate to project folder and install dependencies

```
cd production
npm install
```

To start project just simply type

```
npm start
```

### Sideloading

#### Manifest file

To sideload our plugin on any of the platforms you will need manifest file. 
The file is being stored in mstr-react/production/office-react-manifest.xml
Below you can find information and links describe process of sideloading the add-in.

#### Office for Mac

##### Automated

Run the following command in production.
```
npm run sideload
```

##### Manually

You need to copy manifest file to Office location in Library like so
```
cp mstr-office/production/office-react-manifest.xml ~/Library/Containers/com.microsoft.Excel/documents/wef
```

Now you can run add-in using Insert -> My Add-ins. 
MicroStrategy for Office should appear under Developer Add-ins.
You may be required to accept self-signed certificate in order to start add-in.

Additional information can be found on [Microsoft page](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-an-office-add-in-on-ipad-and-mac)

#### Office for Windows

Simply follow instruction from official [Microsoft page](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/create-a-network-shared-folder-catalog-for-task-pane-and-content-add-ins) 

#### Office Online

Simply follow instruction from official [Microsoft page](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-office-add-ins-for-testing)

### Troubleshooting

#### Permission denied
```
git@github.microstrategy.com: Permission denied (publickey).
fatal: Could not read from remote repository.
```
This means that you don't have ssh key added to ssh-agent. To fix this simply execute
```
ssh-add
```
Of you have key in some custom path you should provide the path as below
```
ssh-add /custom/path/to/ssh/key
```
#### Host verification failed
```
Host key verification failed.
fatal: Could not read from remote repository.
```
This means that you don't have microstrategy.github.com added to known hosts. 
To fix it simply run
```
ssh github.microstrategy.com
The authenticity of host 'github.microstrategy.com (X.X.X.X)' can't be established.
ECDSA key fingerprint is SHA256:--------------------------------------------.
Are you sure you want to continue connecting (yes/no)? yes
``` 
Type **yes** when prompted.

#### Dossier or prompts are not working
Make sure embeddinglib.js is present in your environment. [More information](production/public/javascript/README.md).

## Running the tests

We currently support only tests using [Jest](https://jestjs.io/) and [Enzyme](https://airbnb.io/enzyme/docs/api/)
You can run them using
```
npm test
```

## Deployment

Currently we do not support production builds.

## Manually uploading addin to AWS instance and uploading the test data

### Get Office addin and Office addin loader from Nexus at link:
1. go to http://nexus.internal.microstrategy.com/#browse/browse:releases:com%2Fmicrostrategy
2. choose a branch folder (e.g. “m2020”)
3. get addin:
    1. find folder “office”
    2. choose a version folder (e.g. “11.1.3.1050”)
    3. click file ending in “.zip”
    4. download link for plugin is on the pane to the right under “Path”
4. get addin loader:
    1. find folder “office-loader”
    2. choose a version folder (e.g. “11.1.3.1050”)
    3. click file ending in “.zip”
    4. download link for plugin is on the pane to the right under “Path”

### Upload office addin and addin loader to the env
1. connect to the remote desktop of the env
2. copy the addin and addin loader downloaded from Nexus to the remote desktop of the env and extract them
3. open WinSCP (if not present on the remote desktop, download it from https://winscp.net/eng/download.php)
4. connect to Intelligence Server Instance: 
    1. in “Host Name” field input IP found at the main MSTR AWS Console under “Essential Connections”: “Intelligence Server Address”
    2. port number: 22
    3. user name and password fields input credentials from the “Welcome to MicroStrategy on AWS” email
    4. click “Save”button
    5. click “Login” button
5. upload the addin:
    1. on the right panel go to path:”/opt/apache/tomcat/latest/webapps/MicroStrategyLibrary/apps/addin-mstr-office“
    2. on the left panel open up the unzipped addin folder
    3. select all files and folders on the left and copy them to the right
    4. on the replace prompt Shift + click “Yes” button
6. upload the addin loader:
    1. on the right panel go to path:”/opt/apache/tomcat/latest/webapps/MicroStrategyLibrary/static/loader-mstr-office“
    2. on the left panel open up the unzipped addin loader folder
    3. select all files and folders on the left and copy them to the right
    4. on the replace prompt Shift + click “Yes” button
7. restart the “Web/Mobile/Library” Server (you must be the owner of the env and if you will also be uploading the test data to the env, then wait until you’ve completed that as well and just restart then):
    1. in the MicroStrategy Cloud Console find the instance you’re working on and click the “+” symbol
    2. click “Server”
    3. click “Server Instance”
    4. next to “Web/Mobile/Library” under “Actions” click the 3 dots
    5. click “Restart”

## For testing only
### Upload test data to env
1. download test data zip from: https://share.microstrategy.com/link/p9edxlAMnk0pjd06ekRmOa
2. copy over the zip to the env 
3. Import the test data Object manager package:
    1. open Object Manager
    2. open Project Source select “MicroStrategy on AWS I-Server”
    3. click “Open”
    4. login with the credentials from:”Welcome to MicroStrategy on AWS” email
    5. click on “MicroStrategy Tutorial” project
    6. under “Tools” press “Import Package…”
    7. in the new prompt click the “…” button
    8. find the test objects unzipped folder and select “ProjectPackage with all test objects.mmp”
    9. click “Proceed” button
4. Copy caches and cubes to the env:
    1. open WinSCP
    2. click login (if first time login see “Upload office addin and addin loader to the Env”)
    3. on the right open up “opt/mstr/MicroStrategy/IntelligenceServer“
    4. for Cubes:
        1. continue on the right panel to “/Cube/cloud_10s”
        2. in the left panel open up the “Cube” folder in the unzipped “test objects” folder
        3. find the folder on the right panel with the same name as on the left and open it
        4. copy all files and folders from the folder on the left to the one on the right
        5. click Shift + Yes to replace all when prompted
    5. for Caches:
        1. continue on the right panel to “/Caches/cloud_10s”
        2. in the left panel open up the “Caches” folder in the unzipped “test objects” folder
        3. find the folder on the right panel with the same name as on the left and open it
        4. copy all files and folders from the folder on the left to the one on the right
        5. click Shift + Yes to replace all when prompted
5. restart the Intelligence Server:
    1. in the MicroStrategy Cloud Console find the instance you working on and click “+” symbol
    2. click “Server”
    3. in the “Server Instance” GUI node click “Reboot” button

## Built With

* [React](https://reactjs.org/)
* [Redux](https://redux.js.org/) - state container
* [Ant Design](https://ant.design/docs/react/introduce) - React UI library
* [superagent](https://visionmedia.github.io/superagent/) - AJAX API
* [React Router](https://github.com/ReactTraining/react-router) - Router for navigation
* [webpack](https://webpack.js.org/) - module bundler
* [Babel](https://babeljs.io/) - JavaScript transpiler
* [Mstr React Library](https://github.microstrategy.com/Tech/mstr-react-library) - MicroStrategy React Components

## Authors

* Dominik Otręba
* Piotr Filipp
* Hryhorii Havryliuk
* CT-Application-Excel team

## License
[Apache 2.0](https://apache.org/licenses/LICENSE-2.0)


