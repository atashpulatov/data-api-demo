#this file contains rake tasks for e2e test on mac
#on mac, docker is used to deploy web-dosser + office.zip as the test envrionment
require_relative 'test_common'
desc "package test docker"
task :deploy_tester_server,[:build_no] do | t, args|
  
  group_id = "#{$WORKSPACE_SETTINGS[:nexus][:base_coordinates][:group_id]}.#{Common::Version.application_branch}"
  group_id = "com.microstrategy.m2020" #hard code the group id for test binary on m2020, don't merge this change back 
  artifact_id = "office-loader"
  version = args['build_no'] || Nexus.latest_artifact_version(artifact_id: artifact_id, group_id: group_id)
  download_mstr_office(group_id, version,mac_env_dir)
  download_latest_web_dossier(mac_env_dir)
  
  do_stop_local_web_dossier
  do_package_test_docker
  do_start_local_web_dossier
end

desc "package test docker"
task :p do
  do_package_test_docker
end

def mac_env_dir
  "e2e-webserver-mac"
end

def do_package_test_docker()
  cmd = "docker build -t mstr-dossier ."
  shell_command! cmd, cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/#{mac_env_dir}"
end

def stop_test_web_service()
  cmd = "docker stop office-tester"
  shell_command cmd
  cmd = "docker container rm office-tester"
  shell_command cmd
end

def do_stop_local_web_dossier()
  cmd = "docker stop office-tester"
  shell_command cmd
  cmd = "docker container rm office-tester"
  shell_command cmd
end

def do_start_local_web_dossier
  cmd = "docker run --rm -p 8080:8080 -p 8443:8443 --name office-tester -d mstr-dossier"
  shell_command! cmd
  wait_web_dossier_online
  good "web server online"
  puts "please open https://127.0.0.1:8443/web-dossier/auth/ui/loginPage"
end

desc "run docker based test env locally"
task :r do
  # cmd = "docker run -it -p 8888:8080 --name office-tester mstr-dossier /bin/bash"
  do_start_local_web_dossier
end

desc "debug task"
task :debug do
  # cmd = "docker run -it -p 8888:8080 --name office-tester mstr-dossier /bin/bash"
  # ci_metrics_system_test
end



desc "termiate docker container"
task :k do
  do_stop_local_web_dossier
end


