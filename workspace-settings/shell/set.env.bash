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

export BRANCH_OFF_COMMIT=69b3755857b64efce7aa9b3a404df432e4f887db

export BASE_VERSION=100
