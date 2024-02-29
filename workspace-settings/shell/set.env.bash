#!/usr/bin/env bash

export GROUP_ID_BASE='com.microstrategy'
export BASE_BRANCH='m2021'
export ARTIFACT_ID_BASE='mstr-office'


function become_data_bag_manager(){
  export HATS=$HATS:data_bag
}

function resign_as_data_bag_manager(){
  export HATS=${HATS/:data_bag/}
}

function become_jenkins_manager(){
  export HATS=$HATS:jenkins
}

export BRANCH_OFF_COMMIT=0d521788b4e0d2a51de0617fd9166255e5811425

export BASE_VERSION=0
