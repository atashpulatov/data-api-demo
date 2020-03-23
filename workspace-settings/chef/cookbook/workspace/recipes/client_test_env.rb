#
# Cookbook Name:: workspace
# Recipe:: tomcat_windows
#


case node['platform']
  
when 'windows'
  unless  Dir.exists? "C:\\apache\\apache-maven-3.6.3"
    
    directory 'C:\\apache' do
      recursive true
      action :create
    end
    remote_file "C:\\apache\\maven.zip" do
      source "https://nexus.internal.microstrategy.com/repository/filerepo/org/apache/maven/3.6.3/maven-3.6.3-bin.zip"
      action :create_if_missing
    end
    execute 'unzip files' do
      command <<-EOH
      unzip maven.zip
      EOH
      cwd "C:\\apache"
    end
  end
  
  unless Dir.exists? "C:\\Program Files (x86)\\Windows Application Driver"
    windows_package "MySQL ODBC Driver" do
      source "https://nexus.internal.microstrategy.com/repository/filerepo/com/microsoft/windows-application-driver/1.1/windows-application-driver-1.1.msi"
      action :install
    end
  end

when 'mac_os_x'
  brew_file = "/usr/local/Homebrew/Library/Taps/homebrew/homebrew-core/Formula/opencv-mstr-office.rb"
  manifest_dir = "#{ENV["HOME"]}/Library/Containers/com.microsoft.Excel/Data/Documents/wef"
  manifest_file = "#{manifest_dir}/yi_localhost_ip.xml"

  unless File.exists? brew_file
    cookbook_file brew_file do
      source "opencv-mstr-office.rb"
        end 
    execute "install open-CV" do 
      command "brew install opencv-mstr-office"
      user ENV["USER"]
    end
  end
  
  unless Dir.exists? manifest_dir 
    directory manifest_dir do 
      action :create
    end
  end
  unless File.exists? manifest_file
      cookbook_file manifest_file do 
        source "yi_localhost_ip.xml"
    end
  end
  
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
    remote_file "C:\\apache\\maven.zip" do
      source "https://nexus.internal.microstrategy.com/repository/filerepo/org/apache/maven/3.6.3/maven-3.6.3-bin.zip"
      action :create_if_missing
    end
  end 
end
