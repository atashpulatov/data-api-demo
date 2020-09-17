
# Cookbook Name:: workspace
# Recipe:: prepare_e2e_dependencies
#


pip_file = '/usr/bin/pip3'
case node['platform']
when 'mac_os_x'
  # TODO prepare AllureForMac for Mac Desktop tests

  mac_os_x_package 'python 3.8.5' do
    source "https://nexus.internal.microstrategy.com/repository/filerepo/org/python/python/3.8.5/python-3.8.5.pom"
      installer_type :custom
      options '/quiet /log /var/lib/jenkins/tmp/python_install_log.txt'
      remote_file_attributes ({
        :path => "#{ENV['TMP']}/python-3.8.5.pom",
        :checksum => '0bd1716cd0cc6233405ab18d2a1027c021843621'
      })
      # not_if {::File.exist?('C:\\Users\\jenkins\\AppData\\Local\\Programs\\Python\\Python38\\python.exe')}
  end

  execute "install dependencies" do
    command "python -m pip install selenium Appium-Python-Client behave Pillow opencv-python-headless pyperclip allure-behave requests"
  end

end
