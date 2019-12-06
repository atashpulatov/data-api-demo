
desc "test project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :test do
  good "Puts your test command here, for example mvn test or grable test: #{__FILE__}:#{__LINE__}"
end


desc "package test docker"
task :deploy_tester_server do
  do_package_test_docker
  # cmd = "docker build -t mstr-dossier ."
  # shell_command! cmd, cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/e2e-webserver"
  
end

desc "package test docker"
task :e2e_test_browser do
 
  shell_command! "npm install", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/test-driver-browser"
  shell_command! "npm run test", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/test-driver-borwser"

end

desc "package test docker"
task :tp do
  stop_test_web_service
  do_package_test_docker
  # cmd = "docker build -t mstr-dossier ."
  # shell_command! cmd, cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/e2e-webserver"
  
end

def do_package_test_docker()
  download_latest_web_dossier
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
  if File.exist? dossior_war_path
    FileUtils.rm_rf dossior_war_path
  end
  Nexus.download_latest_artifact(file_path:dossior_war_path,artifact_id:'web-dossier',group_id:Common::Version.dependency_group_id,repository:'releases',extra_coordinates:{e: 'war'})

end


desc "package test docker"
task :r do
  # cmd = "docker run -it -p 8888:8080 --name office-tester mstr-dossier /bin/bash"
  cmd = "docker run --rm -p 8080:8080 -p 8443:8443 --name office-tester -d mstr-dossier"
  shell_command! cmd
  wait_web_dossier_online
  good "web server online"
  puts "please open http://localhost:8080/web-dossier/auth/ui/loginPage"
end

desc "run docker"
task :k do
  cmd = "docker stop office-tester"
  shell_command cmd
  cmd = "docker container rm office-tester"
  shell_command cmd
end

desc "run docker"
task :id do
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
