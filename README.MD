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

#### Sideloading



#### Troubleshooting



End with an example of getting some data out of the system or using it for a little demo

### Windows

#### Under construction

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
