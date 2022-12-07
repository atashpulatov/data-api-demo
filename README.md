<!--
    The purpose of this file is to allow readers who find this repository in git to know about the purpose of the repository.  Please:
    - Duplicate this file into the root of your repository (as README.md)
    - The seconds marked in HTML comments should be filled in with actual text
    - The purpose of Begin/End markers are to allow scripts to scan this file.

    Add any other information that you think will be helpful for readers of this repository.
    If the documentation requested here is already written elsewhere (say in Confluence)
    then please just place a link here to allow people to discover the documentation.

    This file should be in the root of the repository.
    If the project already contains a readme repo that is not at the root,
    For example: https://github.microstrategy.com/Kiai/ExportService/tree/m2021/production
    Then we should just provide a readme.md at the root that points to the location of
    the existing readme file to allow it to be found.

    An example of a good readme is here:
    https://github.microstrategy.com/Modules/DBMigrator/blob/master/README.md

-->

# <!-- Begin: Full Name -->MicroStrategy for Office<!-- End: Full Name -->

## Summary

### Purpose

<!-- Begin: Purpose -->

Add-in for Microsoft Office applications and MicroStrategy.

<!-- End: Purpose -->

### How, if at all, do we ship the code in this repository

<!-- Begin: Output
    Please fill in the [x] if a statement is true, remove it if it is false.
    List all of the separately shipping products that include it.
    If (for low-level code) it is included in many projects then categorize them
-->

- [x] This project is shipped (included in some kind of install program)
  - Microstrategy Library (web-dossier)
  <!-- Alternatively:
      - [ ] This project is shipped (included in some kind of install program)
  -->
- [ ] This project is containerized (it is included in some MicroStrategy generated container)
  <!-- Alternatively:
      - [ ] This project is containerized (it is included in some MicroStrategy generated container)
  -->
- [ ] This project is actively used in-house. (For example it is a build tool, or it is used for testing.)
<!-- Alternatively:
    - [ ] This project is actively used in-house.  (For example it is a build tool, or it is used for testing.)
-->
- [ ] This is a throw away project (created for research)
<!-- Alternatively:
    - [ ] This is a throw away project (created for research)
-->
- [x] This code belong to MicroStrategy (as against being open source)
  <!-- Alternatively:
      - [ ] This is a throw away project (created for research)
  -->
  <!-- End: Output -->

### Ownership

<!-- Begin: Owner
    If a repo belongs to several teams write down the team that owns the largest proportion.
    This information can be found here:
    https://microstrategy.atlassian.net/wiki/spaces/DevOps/pages/1070727930/CI+pipelines+Point+of+Contacts
    Example:
        Team: TEC-CT-Web-Library-CTC
        Team: TEC-SR-Gateways-Framework
        Contact: Fred Bloggs (fbloggs)
-->

Team: TL-Application-Excel

Contact: Alejandro Sedano (asedano)  

DevOps POC: Yurii Zhuk (yzhuk)

stage-2-e2e-browser-test-python-mac POC: Michał Duong (miduong)

stage-2-e2e-browser-test-python-win POC: Michał Duong (miduong)

stage-2-e2e-client-test-win-pre POC: Michał Duong (miduong)

stage-2-e2e-desktop-test-python-mac POC: Michał Duong (miduong)

stage-2-e2e-desktop-test-python-win POC: Michał Duong (miduong)

stage-2-e2e-general-windows-desktop-job POC: Michał Duong (miduong)
<!-- End: Owner -->

## Documentation

<!-- Begin: Documentation -->

[Design Documents](https://microstrategy.atlassian.net/wiki/spaces/TECCLIENTS/pages/357894789/Modern+MSTR+Office+Plugin+-+JS+Solution)

This repository is based on Excel task pane add-in Template. Code can be split into 2 parts:
- mstr-office: Implementation of plugin UI and functionalities 
- office-loader: Initilisation and Authentication

More information can be found [here](./production/README.md)

<!-- End: Documentation -->

## How to use this repository

<!-- Begin: Use -->

### Requirements

- Install Node.JS 16.15
- Install a Code Editor tool, Visual Studio Code recommended.
- Office Online, Office 365, Office 2016 or later
- ssh-key added to your github account (our project depends on 2nd repository, that we contribute, that contains reusable MicroStrategy React components)
To add key follow instructions on our [github](https://help.github.com/enterprise/2.16/user/articles/generating-an-ssh-key/)

### Installing

Start by cloning the repository:

```
git clone https://github.microstrategy.com/Kiai/mstr-office.git
```

Navigate to project folder and install dependencies

```
cd production
npm install
```

To start project type
```
npm run start
```

To run unit tests
```
npm test
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

#### Dossier or prompts are not working
Make sure embeddinglib.js is present in your environment. [More information](production/public/javascript/README.md).

## Deployment

Currently we do not support production builds.

## Manually uploading addin to AWS instance and uploading the test data

### Get Office addin and Office addin loader from Nexus at link:
1. go to https://nexus.internal.microstrategy.com/#browse/browse:releases:com%2Fmicrostrategy
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

In case where deploying code to library is required, both Office-Loader and Mstr-Office-Plugin parts of the code can be uploaded to library by using following scripts:
 - [Office-Loader](./office-loader/aws-deploy.sh)
 - [Mstr-Office-Plugin](./production//aws-deploy.sh)

<!-- End: Use -->

## Build Pipeline

<!-- Begin: Build -->
mstr-office-.-m2021-.-stage-1-dev

[![Build Status](https://jenkins.internal.microstrategy.com/buildStatus/icon?job=mstr-office-.-m2021-.-stage-1-dev)](https://jenkins.internal.microstrategy.com/view/mstr-office/view/m2021/job/mstr-office-.-m2021-.-stage-1-dev/)

<!-- End: Build -->

## Automated tests for this repository

<!-- Begin: Test -->

Information about automated tests can be found [here](./tests/integration/python/README.md)

<!-- End: Test -->

## Security scanning integration

The scanning tools in use for this project:

<!-- Begin: Scanning -->

<!--
    If the repo is scanned by SonarQube then fill in a link on where to see outcome
    If the repo is not scanned then uncheck the box and erase the link.
-->

- [x] This project is scanned by SonarQube. See [dashboard link](https://sonarqube.internal.microstrategy.com/dashboard?id=Kiai%3Amstr-office)

<!--
    If the repo is scanned by Veracode then fill in a link on where to see outcome
    If the repo is not scanned then uncheck the box and erase the link.
-->

- [x] This project is scanned by Veracode. See [dashboard link](https://sca.analysiscenter.veracode.com/workspaces/wddUZnp/projects/393513/issues)

<!-- End: Scanning -->

<!--
    Please make sure that this repo's information is up to date in this spreadsheet.
-->

[Link to spreadsheet containing information about automated security scanning](https://microstrategy-my.sharepoint.com/:x:/p/xchang/EZ1JApOcDZpGnwbkKLVnZ70BJfrnBSQbF26bXYLS5OntHw?e=ZMVpVe)
