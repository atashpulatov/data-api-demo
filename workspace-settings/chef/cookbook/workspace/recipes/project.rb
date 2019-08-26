#
# Cookbook Name:: workspace
# Recipe:: project
#

include_recipe 'chef_commons'
include_recipe 'workspace::attributes_overrides'
include_recipe 'nodejs'

case node['platform']
when 'redhat', 'centos', 'fedora', 'amazon'
  include_recipe 'java'
  bash 'Remove jenkins .config file if it is a regular file(not directory). To fix a previous mistake' do
    user 'root'
    code <<-EOH
    if [ -f "/var/lib/jenkins/.config" ];
      then
        rm -f  /var/lib/jenkins/.config;
    fi
    EOH
    only_if "echo $USER | grep jenkins"
  end

  bash 'update jenkins folder permissions' do
    user 'root'
    code <<-EOH
      chown -R jenkins:jenkins /var/lib/jenkins/.config || mkdir -p /var/lib/jenkins/.config && chown -R jenkins:jenkins /var/lib/jenkins/.config
    EOH
    only_if "echo $USER | grep jenkins"
  end

  bash 'install linux dependencies' do
    user 'root'
    code <<-EOH
      sudo yum install -y avahi-compat-libdns_sd-devel make gcc gcc-c++ kernel-devel
    EOH
    only_if "echo $USER | grep jenkins"
end

when 'mac_os_x'
  include_recipe 'java-osx'
else


end
