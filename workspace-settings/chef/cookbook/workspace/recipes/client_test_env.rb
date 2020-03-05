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
else


end
