# Mstr Office Client

Connector between Microsoft Office applications and MicroStrategy products.

## Getting Started

Currently only development version of the plugin is available. You will need to follow below steps to prepare your system and aquire the plugin.

### MacOS

#### Prerequisites

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
* ssh-key added to repository (our project depends on 2nd repository, that we contribute, that contains reusable MicroStrategy React components)
To add key follow instructions on our [github](https://help.github.com/enterprise/2.15/user/articles/connecting-to-github-with-ssh/)

#### Installing

Start by cloning out repository

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

### Windows

#### Under construction

### Sideloading

#### Office for Mac

You need to copy manifest file to Office location in Library like so
```
cp mstr-office/production/office-react-manifest.xml /Users/<username>/Library/Containers/com.microsoft.<product>/documents/wef
```
<product> being one of: Excel, Word, Powerpoint. Note that we currently support only **Excel**

Now you can run add-in using Insert -> My Add-ins. 
Microstrategy Office Client should appear under Developer Add-ins.
You may be required to accept self-signed certificate in order to start add-in.

#### Office for Windows

##### Under construction

#### Office Online

##### Under construction

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
* [yarn](https://yarnpkg.com/en/) - Dependency Management
* [webpack](https://webpack.js.org/) - module bundler
* [Babel](https://babeljs.io/) - JavaScript transpiler
* [Mstr React Library](https://github.microstrategy.com/pfilipp/mstr-react-library) - MicroStrategy React Components

## Contributing

ToDo

## Versioning

ToDo

## Authors

* **Dominik Otręba**
* **Piotr Filipp**
* **Hryhorii Havryliuk**

## License

ToDo

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
