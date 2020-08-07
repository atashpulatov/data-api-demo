
# Cookbook Name:: workspace
# Recipe:: prepare_e2e_dependencies
#


pip_file = '/usr/bin/pip3'
case node['platform']
when 'windows'
  unless Dir.exists? "C:\Program Files (x86)\Windows Application Driver"
    windows_package "Windows Application Driver" do
      source "https://nexus.internal.microstrategy.com/repository/filerepo/com/microsoft/windows-application-driver/1.1/windows-application-driver-1.1.msi"
      action :install
    end
  end

  windows_package 'python 3.8.5' do
    source "https://nexus.internal.microstrategy.com/repository/filerepo/org/python/python/3.8.5/python-3.8.5-x64.exe"
      installer_type :custom
      options '/quiet /log C:\tmp\python_install_log.txt'
      remote_file_attributes ({
        :path => "#{ENV['TMP']}\\python-3.8.5-x64.exe",
        :checksum => '00123c4d6cabb2e07efc5848451dcd556a734cfa'
      })
      not_if {::File.exist?('C:\\Users\\jenkins\\AppData\\Local\\Programs\\Python\\Python38\\python.exe')}
  end

  execute "install dependencies" do
    command "python -m pip install selenium Appium-Python-Client behave Pillow opencv-python-headless pyperclip"
  end

end
