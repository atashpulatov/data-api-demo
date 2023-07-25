#!/usr/bin/env bash

register_workspace_setting 'windows_test'

function set_workspace_settings_to_windows_test() {
  export VAGRANT_DEFAULT_PROVIDER=aws
  export VAGRANT_CONTEXT="${VAGRANT_DEFAULT_PROVIDER}/test"

  export TEST_TYPES=integration_win
  export HATS=pipeline
}
