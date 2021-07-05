#!/usr/bin/env bash

register_workspace_setting 'mac_test'

function set_workspace_settings_to_mac_test() {

  export TEST_TYPES=integration_mac
  export HATS=
}
