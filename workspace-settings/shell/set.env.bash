#!/usr/bin/env bash

export APPLICATION_SHORT_VERSION_PREFIX="11.3."
export APPLICATION_LONG_VERSION_PREFIX="${APPLICATION_SHORT_VERSION_PREFIX}1130."

export GROUP_ID_BASE='com.microstrategy'
export BASE_BRANCH='m2021'
export ARTIFACT_ID_BASE='mstr-office'

export VAGRANT_BOXES_CENTOS_NAME='centos-6-7-x86_64'
export VAGRANT_BOXES_CENTOS_VERSION='1.0.14.next'

export VAGRANT_BOXES_WINDOWS_NAME='windows-2008-r2'
export VAGRANT_BOXES_WINDOWS_VERSION='1.0.4.next'

export VAGRANT_BOXES_OSX_NAME='osx-10.11.3'
export VAGRANT_BOXES_OSX_VERSION='1.0.0.next'

jdk_version="jdk-11.0.19"

nodejs_version="18.16.0"
export nodejs_image_tag=$nodejs_version

export python_version="3.10.10"

if uname -a | grep -q "Darwin"; then
  export JAVA_HOME=/Library/Java/JavaVirtualMachines/$jdk_version.jdk/Contents/Home
  export MAVEN_HOME=/usr/local/maven-3.3.9
  export PYTHON_HOME=/var/lib/jenkins/.pyenv/shims
  export PYENV=/var/lib/jenkins/.pyenv/bin
  export PATH=/usr/local/git/bin:$JAVA_HOME/bin:$PATH
  export PATH=$PYENV:$PYTHON_HOME:$MAVEN_HOME/bin:$PATH
elif uname -a | grep -q "MSYS"; then
  export JAVA_HOME=/c/java/$jdk_version
  export PYTHON_HOME=/c/Users/jenkins/.pyenv/pyenv-win/shims
  export PYENV=/c/Users/jenkins/.pyenv/pyenv-win/bin
  export DOCKER_HOME=/C/Program\ Files/Docker/Docker/Resources/
  export MAVEN_HOME=/c/apache/apache-maven-3.6.3
  export NODE_HOME=/c/node/node-v$nodejs_version-win-x64/
  export PATH=$JAVA_HOME/bin:$DOCKER_HOME/bin:$MAVEN_HOME/bin:$NODE_HOME:$PYENV:$PYTHON_HOME:$PATH
else
  export JAVA_HOME=/usr/java/$jdk_version
  export PATH=$JAVA_HOME/bin:$PATH
  export NODE_HOME=/usr/local/nodejs-binary-$nodejs_version
  export PATH=$NODE_HOME/bin:$PATH
  export PATH=~/.npm-global/bin:$PATH
fi

function become_data_bag_manager(){
  export HATS=$HATS:data_bag
}

function resign_as_data_bag_manager(){
  export HATS=${HATS/:data_bag/}
}

function become_jenkins_manager(){
  export HATS=$HATS:jenkins
}

export BRANCH_OFF_COMMIT=e76908f4597c8919958b534e09b590979c229bfe

export BASE_VERSION=100
