#
# Cookbook Name:: workspace
# Recipe:: tomcat_windows
#


case node['platform']

when 'windows'
  unless  File.exists? "C:\\apache\\apache-tomcat-9.0.30\\bin\\catalina.bat"

    directory 'C:\\apache' do
      recursive true
      action :create
    end
    remote_file "C:\\apache\\tomcat.zip" do
      source "https://nexus.internal.microstrategy.com/repository/filerepo/org/apache/tomcat-windows-x64/9.0.30/tomcat-windows-x64-9.0.30.zip"
      action :create
    end
    execute 'unzip files' do
      command <<-EOH
       unzip tomcat.zip
      EOH
      cwd "C:\\apache"
    end
  end
else


end
