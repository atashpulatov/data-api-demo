#!/usr/bin/env bash

export APPLICATION_SHORT_VERSION_PREFIX="11.3."
export APPLICATION_LONG_VERSION_PREFIX="${APPLICATION_SHORT_VERSION_PREFIX}0400."

export GROUP_ID_BASE='com.microstrategy'
export BASE_BRANCH='m2021'
export ARTIFACT_ID_BASE='mstr-office'

export VAGRANT_BOXES_CENTOS_NAME='centos-6-7-x86_64'
export VAGRANT_BOXES_CENTOS_VERSION='1.0.14.next'

export VAGRANT_BOXES_WINDOWS_NAME='windows-2008-r2'
export VAGRANT_BOXES_WINDOWS_VERSION='1.0.4.next'

export VAGRANT_BOXES_OSX_NAME='osx-10.11.3'
export VAGRANT_BOXES_OSX_VERSION='1.0.0.next'

jdk_version="jdk-11.0.8"

export NODE_HOME=/usr/local/nodejs-binary-10.16.3

export PATH=$NODE_HOME/bin:$PATH

if uname -a | grep -q "Darwin"; then
  export JAVA_HOME=/Library/Java/JavaVirtualMachines/$jdk_version.jdk/Contents/Home
  export MAVEN_HOME=/usr/local/maven-3.3.9
  export PATH=/usr/local/git/bin:$JAVA_HOME/bin:$PATH
  export PATH=$MAVEN_HOME/bin:$PATH
elif uname -a | grep -q "MSYS"; then
  export JAVA_HOME=/c/java/$jdk_version
  export PATH=$JAVA_HOME/bin:$PATH
  export PYTHON_HOME=/c/Users/jenkins/AppData/Local/Programs/Python/Python38
  export PATH=$PYTHON_HOME:$PIP_HOME:$PATH
  export DOCKER_HOME=/C/Program\ Files/Docker/Docker/Resources/
  export MAVEN_HOME=/c/apache/apache-maven-3.6.3
  export PATH=/c/node/node-v10.16.3-win-x64:$JAVA_HOME/bin:$DOCKER_HOME/bin:$MAVEN_HOME/bin:$PATH
else
  export JAVA_HOME=/usr/java/$jdk_version
  export PATH=$JAVA_HOME/bin:$PATH
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

export BRANCH_OFF_COMMIT=a91dff3f379709c2566506f9b4fc6da13d391dbe
