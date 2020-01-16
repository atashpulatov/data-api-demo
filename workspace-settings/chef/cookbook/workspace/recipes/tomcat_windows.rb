#
# Cookbook Name:: workspace
# Recipe:: tomcat_windows
#


case node['platform']

when 'windows'
  unless  File.exists? "C:\\apache\\apache-tomcat-8.5.50\\bin\\catalina.bat"

    directory 'C:\\apache' do
      recursive true
      action :create
    end
    remote_file "C:\\apache\\tomcat.zip" do
      source "https://nexus.internal.microstrategy.com/repository/filerepo/org/apache/tomcat-windows-x64/8.5.50/tomcat-windows-x64-8.5.50.zip"
      action :create_if_missing
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
