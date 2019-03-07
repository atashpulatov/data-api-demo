# Mstr Office Client

Connector between Microsoft Office applications and MicroStrategy products.

## Getting Started

Currently only development version of the plugin is available. You will need to follow below steps to prepare your system and aquire the plugin.

### Prerequisites

#### MacOS

What things you need to install the software and how to install them
* [NVM](https://github.com/creationix/nvm)

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
or
```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
* Node installed from NVM
```
nvm install node
```
* yarn
```
npm install --global yarn
```
* ssh-key added to your github account (our project depends on 2nd repository, that we contribute, that contains reusable MicroStrategy React components)
To add key follow instructions on our [github](https://help.github.com/enterprise/2.15/user/articles/connecting-to-github-with-ssh/)

#### Windows

In order to keep development environment as close to our origin environment(macOS - unix based) you will need to install Windows subsystem for Linux and install all additional tools as well.

1. Follow [this](https://docs.microsoft.com/en-us/windows/wsl/install-win10) instruction to enable Linux subsytem for Linux and install distribution of your choice. We recommend **Debian**.
2. Next initialize distro following [this](https://docs.microsoft.com/en-us/windows/wsl/initialize-distro) instructions
3. Install [NVM](https://github.com/creationix/nvm)

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
or
```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
4. Install Node from NVM
```
nvm install node
```
5. Install yarn using npm
```
npm install --global yarn
```
6. Add ssh-key to your github account (our project depends on 2nd repository, that we contribute, that contains reusable MicroStrategy React components) To add key follow instructions on our [github](https://help.github.com/enterprise/2.15/user/articles/connecting-to-github-with-ssh/)

### Installing

After meeting all requirements the installation should look the same on both macOS and Windows.
Start by cloning our repository:

```
git clone https://github.microstrategy.com/Kiai/mstr-office.git
```

Navigate to project folder and install dependencies

```
yarn install
```

To start project just simply type

```
yarn start
```

### Sideloading

#### Manifest file

To sideload our plugin on any of the platforms you will need manifest file. 
The file is being stored in mstr-react/production/office-react-manifest.xml
Below you can find information and links describe process of sideloading the add-in.

#### Office for Mac

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

#### You received below error
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
#### You received below error
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

## Running the tests

We currently support only tests using [Jest](https://jestjs.io/) and [Enzyme](https://airbnb.io/enzyme/docs/api/)
You can run them using
```
yarn test
```

### Break down into end to end tests

#### Not yet implemented

## Deployment

Currently we do not support production builds.

## Built With

* [React](https://reactjs.org/)
* [Redux](https://redux.js.org/) - state container
* [Ant Design](https://ant.design/docs/react/introduce) - React UI library
* [superagent](https://visionmedia.github.io/superagent/) - AJAX API
* [React Router](https://github.com/ReactTraining/react-router) - Router for navigation
* [yarn](https://yarnpkg.com/en/) - Dependency Management
* [webpack](https://webpack.js.org/) - module bundler
* [Babel](https://babeljs.io/) - JavaScript transpiler
* [Mstr React Library](https://github.microstrategy.com/pfilipp/mstr-react-library) - MicroStrategy React Components

## Contributing

ToDo

## Versioning

ToDo

## Authors

* Dominik Otręba
* Piotr Filipp
* Hryhorii Havryliuk

## License

ToDo
