#!/usr/bin/env bash

register_workspace_setting 'aws_dev'

function set_workspace_settings_to_aws_dev() {
  export VAGRANT_DEFAULT_PROVIDER=aws
  export VAGRANT_CONTEXT="${VAGRANT_DEFAULT_PROVIDER}/dev"

  export TEST_TYPES=:
  export HATS=dev:pipeline
}
