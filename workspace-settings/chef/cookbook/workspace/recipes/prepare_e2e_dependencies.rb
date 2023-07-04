
# Cookbook Name:: workspace
# Recipe:: prepare_e2e_dependencies
#


pip_file = '/usr/bin/pip3'
case node['platform']
when 'windows'
  unless Dir.exists? "C:\\Program Files (x86)\\Windows Application Driver"
    windows_package "Windows Application Driver" do
      source "https://nexus.internal.microstrategy.com/repository/filerepo/com/microsoft/windows-application-driver/1.1/windows-application-driver-1.1.msi"
      action :install
    end
  end

when 'mac_os_x'
  unless Dir.exists? "/Applications/AppiumForMac.app"
    remote_file "/opt/appium_for_mac_0.3.0" do
      source "https://nexus.internal.microstrategy.com/repository/filerepo/io/appium/appium-for-mac/0.3.0/appium-for-mac-0.3.0.zip"
      action :create_if_missing
    end
    execute 'unzip files' do
      command <<-EOH
      unzip appium_for_mac_0.3.0
      cp -r AppiumForMac.app /Applications
      EOH
      cwd "/opt"
    end
  end

end
