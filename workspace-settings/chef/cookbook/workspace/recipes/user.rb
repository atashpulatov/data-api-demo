#
# Cookbook Name:: workspace
# Recipe:: user
#

include_recipe 'workspace::project'

node.override[:extras][:project][:name] = "mstr-office"

case node['platform']
when 'windows'

when "mac_os_x"
  node.override[:extras][:iterm][:dynamic_profiles][:profiles][:project] = {
    file_name: "#{node[:extras][:project][:name]}.json",
    content: {
      Profiles: [
        {
          Name: "mstr-#{node[:extras][:project][:name]}",
          Guid: "mstr-#{node[:extras][:project][:name]}",
          'Dynamic Profile Parent Name' => 'ecosystem-base',
          'Working Directory' => node[:extras][:project][:home],
          'Custom Directory' => 'Yes',
          'Initial Text' => "bash --init-file #{node[:extras][:project][:home]}/.ecosystem",
          'Semantic History' => {
            'editor' => 'com.sublimetext.3',
            'action' => 'command',
            'text' => "#{$WORKSPACE_SETTINGS[:ecosystem][:root][:paths][:shell][:lib][:home]}/goodies/bin/iterm-semantic-history-shim \"\\1:\\2\""
          }
        }
      ]
    }
  }

  # include_recipe 'extras'
else
  #probably not
end

# include_recipe 'virtualbox'
