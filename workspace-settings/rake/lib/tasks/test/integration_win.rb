desc "package test docker"
task :deploy_tester_server,[:build_no] do | t, args|
  
  group_id = "#{$WORKSPACE_SETTINGS[:nexus][:base_coordinates][:group_id]}.#{Common::Version.application_branch}"
  group_id = Common::Version.dependency_group_id
  artifact_id = "office-loader"
  version = args['build_no'] || Nexus.latest_artifact_version(artifact_id: artifact_id, group_id: group_id)
  download_mstr_office(group_id, version)
  download_latest_web_dossier
  # is_tomcat_running
  stop_tomcat
  web_dossier_dir = "#{tomcat_dir}\\webapps\\web-dossier"
  web_dossier_war = "#{tomcat_dir}\\webapps\\web-dossier.war"
  FileUtils.rm_rf web_dossier_dir if Dir.exists? web_dossier_dir
  FileUtils.rm web_dossier_war if File.exists? web_dossier_war
  tomcat_config_dir = "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}\\integration\\e2e-webserver"
  tomcat_config_win_dir = "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}\\integration\\e2e-webserver-windows"
  FileUtils.cp("#{tomcat_config_win_dir}\\server.xml","#{tomcat_dir}\\conf\\server.xml")
  FileUtils.cp("#{tomcat_config_dir}\\mstr-office.jks","#{tomcat_dir}\\conf\\mstr-office.jks")
  FileUtils.cp("#{tomcat_config_dir}\\tomcat-users.xml","#{tomcat_dir}\\conf\\tomcat-users.xml")
  FileUtils.mkdir_p "#{tomcat_dir}\\conf\\Catalina\\localhost" unless Dir.exists? "#{tomcat_dir}\\conf\\Catalina\\localhost"
  FileUtils.cp("#{tomcat_config_dir}\\manager.xml","#{tomcat_dir}\\conf\\Catalina\\localhost\\manager.xml")
  FileUtils.cp("#{tomcat_config_dir}\\web-dossier.xml","#{tomcat_dir}\\conf\\Catalina\\localhost\\web-dossier.xml")
  FileUtils.cp("#{tomcat_config_win_dir}\\web-dossier.war","#{tomcat_dir}\\webapps\\web-dossier.war")
  start_tomcat
  sleep(1)
  stop_tomcat
  FileUtils.cp("#{tomcat_config_dir}\\configOverride.properties","#{tomcat_dir}\\webapps\\web-dossier\\WEB-INF\\classes\\config\\configOverride.properties")
  FileUtils.rm_rf "#{tomcat_dir}\\webapps\\web-dossier\\apps\\addin-mstr-office"
  FileUtils.rm_rf "#{tomcat_dir}\\webapps\\web-dossier\\static\\loader-mstr-office"
  cmd = "unzip #{tomcat_config_win_dir}\\office.zip  -d #{tomcat_dir}\\webapps\\web-dossier\\apps\\addin-mstr-office"
  shell_command! cmd
  cmd = "unzip #{tomcat_config_win_dir}\\office-loader.zip  -d #{tomcat_dir}\\webapps\\web-dossier\\static\\loader-mstr-office"
  shell_command! cmd
  start_tomcat
  
  puts "please open https://127.0.0.1:8443/web-dossier/auth/ui/loginPage"
  # shell_command! cmd, cwd: "#{tomcat_dir}\\bin"
  # do_stop_local_web_dossier
  # do_package_test_docker
  # do_start_local_web_dossier

  # cmd = "docker build -t mstr-dossier ."
  # shell_command! cmd, cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/e2e-webserver"
  
end
def tomcat_dir()
  "C:\\apache\\apache-tomcat-8.5.50"
end
def start_tomcat()
  cmd = "cmd /c catalina.bat start"
  shell_command! cmd, cwd: "#{tomcat_dir}\\bin"
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

desc "package test docker"
task :e2e_test_browser do
 
  shell_command! "npm install", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/test-driver-browser"
  test_fail = false
  begin
    shell_command! "npm run test", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/test-driver-browser"
  rescue
    test_fail = true
  end
  shell_command! "npm run report", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/test-driver-browser"
  ci_metrics_system_test
  raise "test failed" if test_fail

end

desc "package test docker"
task :p do
  # stop_test_web_service
  # download_latest_web_dossier
  # download_mstr_office
  do_package_test_docker
  # cmd = "docker build -t mstr-dossier ."
  # shell_command! cmd, cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/e2e-webserver"
  
end


def download_latest_web_dossier()
  dossior_war_path = "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/e2e-webserver-windows/web-dossier.war"
  FileUtils.rm_rf dossior_war_path if File.exist? dossior_war_path
  Nexus.download_latest_artifact(file_path:dossior_war_path,
    artifact_id:'web-dossier',
    group_id:Common::Version.dependency_group_id,
    repository:'releases',
    extra_coordinates:{e: 'war'})

end

def download_mstr_office(group_id, version)
  artifacts = ["office-loader", "office"]
  artifacts.each do |artifact_id|
    mstr_office_path = "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/e2e-webserver-windows/#{artifact_id}.zip"
    FileUtils.rm_rf mstr_office_path if File.exist? mstr_office_path
    Nexus.download_large_artifact(file_path:mstr_office_path,
      artifact_id:artifact_id,
      version: version,
      group_id:group_id,
      repository:'releases',
      extra_coordinates:{e: 'zip'})
  end
  
end


desc "run docker locally"
task :r do
  start_tomcat
end

desc "debug task"
task :debug do
  # cmd = "docker run -it -p 8888:8080 --name office-tester mstr-dossier /bin/bash"
  # ci_metrics_system_test
  stop_tomcat_force
end




desc "termiate docker container"
task :k do
  do_stop_local_web_dossier
end


def wait_web_dossier_online()
  cnt = 0
  while true
    if is_web_dossier_started?()
      puts "web dossier successfully"
      break
    end
    cnt = cnt+1
    sleep(5)
    if cnt > 1000
      raise "web dossier not started in limited time, please have a check"
    end
  end
  
end

def is_web_dossier_started?()
  cmd = shell_command("curl --connect-timeout 10 http://localhost:8080/web-dossier/auth/ui/loginPage -k --retry 1")
  !cmd.error?
end


def ci_metrics_system_test()
  json_path = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/integration/test-driver-browser/allure-report/data/suites.json"
  if ! File.exist?(json_path)
    puts "Warning! No file #{json_path}"
  else
    test_result = JSON.parse(File.read(json_path))
    scenarios_num = 0
    pass_num = 0
    fail_num = 0
    duration = 0
    test_result["children"].each do |ts|
      ts["children"].each do |tc|
        scenarios_num += 1;
        duration += (tc["time"]["duration"]/1000).to_i
        if tc["status"] == "passed"
          pass_num +=1
        else
          fail_num +=1
        end
      end
    end

    metrics_system_test = {}
    metrics_system_test['TOTAL_CASES'] = scenarios_num
    metrics_system_test['PASSED'] = pass_num
    metrics_system_test['FAILED'] = fail_num
    metrics_system_test['DURATION'] = duration
    puts "\nMETRICS_SYSTEM_TEST=#{metrics_system_test.to_json}\n"
  end
end