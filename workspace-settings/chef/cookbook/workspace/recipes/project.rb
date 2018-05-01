#
# Cookbook Name:: workspace
# Recipe:: project
#

include_recipe 'chef_commons'

toolset = {}

toolset.each do |name, version|
  include_recipe "workspace::#{name}_attributes_overrides"
  include_recipe name
end
