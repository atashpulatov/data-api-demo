#this file contains rake tasks for e2e test on windows
#on windows, a local tomcat is used to deploy web-dosser + office.zip as the test envrionment

require_relative 'test_common'
desc "deploy test envrionment, on windows"
task :deploy_tester_server,[:build_no] do | t, args|
  
  group_id = Common::Version.dependency_group_id #use dependency_group_id as the  group id to download the test binary. 
  artifact_id = "office-loader"
  version = args['build_no'] || Nexus.latest_artifact_version(artifact_id: artifact_id, group_id: group_id)
  download_mstr_office(group_id, version,"e2e-webserver-windows")
  download_latest_web_dossier("e2e-webserver-windows")
  # is_tomcat_running
  stop_tomcat
  web_dossier_dir = "#{tomcat_dir}\\webapps\\web-dossier"
  web_dossier_war = "#{tomcat_dir}\\webapps\\web-dossier.war"
  FileUtils.rm_rf web_dossier_dir if Dir.exists? web_dossier_dir
  FileUtils.rm web_dossier_war if File.exists? web_dossier_war
  tomcat_config_dir = "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home].gsub("/","\\")}\\integration\\e2e-webserver-mac"
  tomcat_config_win_dir = "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home].gsub("/","\\")}\\integration\\e2e-webserver-windows"
  FileUtils.cp("#{tomcat_config_win_dir}\\server.xml","#{tomcat_dir}\\conf\\server.xml")
  FileUtils.cp("#{tomcat_config_dir}\\mstr-office.jks","#{tomcat_dir}\\conf\\mstr-office.jks")
  FileUtils.cp("#{tomcat_config_dir}\\tomcat-users.xml","#{tomcat_dir}\\conf\\tomcat-users.xml")
  FileUtils.cp("#{tomcat_config_dir}\\confcontext.xml","#{tomcat_dir}\\conf\\context.xml")
  FileUtils.mkdir_p "#{tomcat_dir}\\conf\\Catalina\\localhost" unless Dir.exists? "#{tomcat_dir}\\conf\\Catalina\\localhost"
  FileUtils.cp("#{tomcat_config_dir}\\manager.xml","#{tomcat_dir}\\conf\\Catalina\\localhost\\manager.xml")
  FileUtils.cp("#{tomcat_config_dir}\\web-dossier.xml","#{tomcat_dir}\\conf\\Catalina\\localhost\\web-dossier.xml")
  FileUtils.cp("#{tomcat_config_win_dir}\\web-dossier.war","#{tomcat_dir}\\webapps\\web-dossier.war")
  start_tomcat
  sleep(1)
  stop_tomcat
  FileUtils.cp("#{tomcat_config_dir}\\context.xml","#{tomcat_dir}\\webapps\\web-dossier\\META-INF\\context.xml")
  FileUtils.cp("#{tomcat_config_dir}\\configOverride.properties","#{tomcat_dir}\\webapps\\web-dossier\\WEB-INF\\classes\\config\\configOverride.properties")
  FileUtils.rm_rf "#{tomcat_dir}\\webapps\\web-dossier\\apps\\addin-mstr-office"
  FileUtils.rm_rf "#{tomcat_dir}\\webapps\\web-dossier\\static\\loader-mstr-office"
  cmd = "sed -i 's+<param-value>UNSET</param-value>+<param-value>NONE</param-value>+g'#{tomcat_dir}\\webapps\\web-dossier\\WEB-INF\\web.xml"
  cmd = "unzip #{tomcat_config_win_dir}\\office.zip  -d #{tomcat_dir}\\webapps\\web-dossier\\apps\\addin-mstr-office"
  shell_command! cmd
  cmd = "unzip #{tomcat_config_win_dir}\\office-loader.zip  -d #{tomcat_dir}\\webapps\\web-dossier\\static\\loader-mstr-office"
  shell_command! cmd
  start_tomcat
  
  puts "please open https://127.0.0.1:8443/web-dossier/auth/ui/loginPage"
  
end
def tomcat_dir()
  "C:\\apache\\apache-tomcat-9.0.30"
end

desc "start web application driver on widnows"
task :start_web_application_driver do
  # start_web_application_dirver
end

def start_web_application_dirver()
  
  system("taskkill /F /IM WinAppDriver.exe")
  sleep(3)
  Dir.chdir("C:\\Program Files (x86)\\Windows Application Driver"){
    system("start WinAppDriver.exe localhost 4723/wd/hub")
  }
end


def start_tomcat()
  # cmd = "cmd /c catalina.bat start"
  # shell_command! cmd, cwd: "#{tomcat_dir}\\bin"
  #using system function to start tomcat, to fix the process block issue on some windows machine
  Dir.chdir("#{tomcat_dir}\\bin"){
    system("catalina.bat start")
  }
  wait_web_dossier_online
end

def stop_tomcat_force()
  pid = is_tomcat_running()
  unless pid == "no_port"
    cmd = "taskkill /F /PID #{pid}"
    shell_command! cmd
    wait_tomcat_stop
  end
end

def wait_tomcat_stop()
  cnt = 0
  while true
    pid = is_tomcat_running()
    if pid == "no_port"
      return
    end
    cnt += 1
    if cnt > 60
      raise "stop tomcat timeout"
    end
    sleep(2)
  end
end
def stop_tomcat()
  begin
    cmd = "cmd /c catalina.bat stop"
    shell_command! cmd, cwd: "#{tomcat_dir}\\bin"
    wait_tomcat_stop
  rescue
    stop_tomcat_force
  end
end

def is_tomcat_running()
  cmd = shell_command 'netstat -ano | grep LISTENING | grep 8080'
  out = cmd.stdout
  if out.strip == ""
    return "no_port"
  else
    lines = out.strip.split("\n")
    return lines[0].split(" ")[4]
  end
  
end


desc "start locally"
task :r do
  start_tomcat
end

desc "debug task"
task :debug do
  stop_tomcat_force
end

desc "termiate tomcat"
task :k do
  stop_tomcat_force
end



