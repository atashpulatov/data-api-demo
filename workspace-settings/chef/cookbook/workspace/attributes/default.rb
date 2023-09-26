#
# Cookbook Name:: workspace
# Attributes:: default
#

default[:workspace][:nodejs][:package] = value_for_platform_family(
  ['rhel', 'fedora'] => 'nodejs',
  'mac_os_x' => 'node',
  'default' => 'nodejs'
)
