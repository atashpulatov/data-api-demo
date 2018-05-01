#!/usr/bin/env bash

register_workspace_setting 'test'

function set_workspace_settings_to_test() {
  export VAGRANT_DEFAULT_PROVIDER=virtualbox
  export VAGRANT_CONTEXT="${VAGRANT_DEFAULT_PROVIDER}/test"
 
  export TEST_TYPES=acceptance
  export HATS=test
}
