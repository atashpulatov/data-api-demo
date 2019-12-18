desc "package test docker"
task :deploy_tester_server,[:build_no] do | t, args|
  
  group_id = Common::Version.dependency_group_id
  artifact_id = "office-loader"
  version = args['build_no'] || Nexus.latest_artifact_version(artifact_id: artifact_id, group_id: group_id)
  download_mstr_office(group_id, version)
  download_latest_web_dossier
  
  do_stop_local_web_dossier
  do_package_test_docker
  do_start_local_web_dossier

  # cmd = "docker build -t mstr-dossier ."
  # shell_command! cmd, cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/e2e-webserver"
  
end

desc "package test docker"
task :e2e_test_browser do
 
  shell_command! "npm install", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/test-driver-browser"
  shell_command! "npm run test", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/test-driver-browser"
  shell_command! "npm run report", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/test-driver-browser"


end

desc "package test docker"
task :p do
  stop_test_web_service
  download_latest_web_dossier
  download_mstr_office
  do_package_test_docker
  # cmd = "docker build -t mstr-dossier ."
  # shell_command! cmd, cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/e2e-webserver"
  
end

def do_package_test_docker()
  cmd = "docker build -t mstr-dossier ."
  shell_command! cmd, cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/e2e-webserver"
end

def stop_test_web_service()
  cmd = "docker stop office-tester"
  shell_command cmd
  cmd = "docker container rm office-tester"
  shell_command cmd
end
def download_latest_web_dossier()
  dossior_war_path = "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/e2e-webserver/web-dossier.war"
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
    mstr_office_path = "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/e2e-webserver/#{artifact_id}.zip"
    FileUtils.rm_rf mstr_office_path if File.exist? mstr_office_path
    Nexus.download_artifact(file_path:mstr_office_path,
      artifact_id:artifact_id,
      version: version,
      group_id:group_id,
      repository:'releases',
      extra_coordinates:{e: 'zip'})
  end
  
end


desc "run docker locally"
task :r do
  # cmd = "docker run -it -p 8888:8080 --name office-tester mstr-dossier /bin/bash"
  do_start_local_web_dossier
end

def do_start_local_web_dossier
  cmd = "docker run --rm -p 8080:8080 -p 8443:8443 --name office-tester -d mstr-dossier"
  shell_command! cmd
  wait_web_dossier_online
  good "web server online"
  puts "please open https://127.0.0.1:8443/web-dossier/auth/ui/loginPage"
end


desc "termiate docker container"
task :k do
  do_stop_local_web_dossier
end

def do_stop_local_web_dossier()
  cmd = "docker stop office-tester"
  shell_command cmd
  cmd = "docker container rm office-tester"
  shell_command cmd
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
  cmd = shell_command("curl --connect-timeout 10 'http://localhost:8080/web-dossier/auth/ui/loginPage' -k --retry 1")
  !cmd.error?
end
