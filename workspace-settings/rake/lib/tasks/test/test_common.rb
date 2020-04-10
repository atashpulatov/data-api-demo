#this file contains the shared test code for both windows and mac
#
######################################common downloa code for web-dossier and office.zip######################################
def download_latest_web_dossier(target_dir)
  dossior_war_path = "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/#{target_dir}/web-dossier.war"
  FileUtils.rm_rf dossior_war_path if File.exist? dossior_war_path
  Nexus.download_latest_artifact(file_path:dossior_war_path,
  artifact_id:'web-dossier',
  group_id:Common::Version.dependency_group_id,
  repository:'releases',
  extra_coordinates:{e: 'war'})
end

def download_mstr_office(group_id, version, target_dir)
  artifacts = ["office-loader", "office"]
  artifacts.each do |artifact_id|
    mstr_office_path = "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/#{target_dir}/#{artifact_id}.zip"
    FileUtils.rm_rf mstr_office_path if File.exist? mstr_office_path
    Nexus.download_large_artifact(file_path:mstr_office_path,
    artifact_id:artifact_id,
    version: version,
    group_id:group_id,
    repository:'releases',
    extra_coordinates:{e: 'zip'})
  end
end

######################################common e2e test rake task######################################
desc "publish test result for browser e2e"
task :browser_e2e_push_results,[:build_no] do | t, args|
  test_dir = get_browser_test_dir()
  build_no = args['build_no']
  unless build_no.nil?
    info "publish e2e test result to Rally"
    shell_command! "npm run rally pass #{build_no}", cwd: test_dir
  else
    info "no build number specified, no test result will be published"
  end
end

desc "run browser based test"
task :e2e_test_browser do
  test_dir = get_browser_test_dir()
  npm_install_dir= test_dir
  if is_windows_jenkins_env?# we need to copy the test driver to the root dir of c because of there is a path length limitation of windows
    short_dir = "c:/test-driver-browser" 
    FileUtils.rm_rf short_dir if Dir.exist? short_dir
    shell_command! "cp -r #{test_dir} c:/"
    test_dir = short_dir
  end
  shell_command! "npm install", cwd: test_dir
  test_fail = false
  begin
    shell_command! "npm run test-suite acceptance", cwd: test_dir
  rescue
    test_fail = true
  end
  shell_command! "npm run report", cwd: test_dir
  if is_windows_jenkins_env?# copy the test result back
    report_dir = "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/test-driver-browser/allure-report"
    FileUtils.rm_rf report_dir if Dir.exist? report_dir
    shell_command! "cp -r #{test_dir}/allure-report #{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/test-driver-browser"
  end
  ci_metrics_system_test
  raise "test failed" if test_fail
end

desc "run client based e2e test"
task :e2e_test_client do
  test_dir = "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/test-driver-client"
  shell_command! "mvn clean", cwd: test_dir
  test_fail = false
  begin
    shell_command! "mvn clean -DdriverType=#{DRIVER[ENV['TEST_TYPES']]} -Dtest=LogInLogOutTests test", cwd: test_dir
  rescue
    test_fail = true
  end
  raise "test failed" if test_fail
  
end

def is_windows_jenkins_env?
  return ENV['USER'] == "jenkins" && ENV['TEST_TYPES'] == "integration_win"
end

DRIVER = {
  "integration_win" => "WINDOWS_DESKTOP",
  "integration_mac" => "MAC_DESKTOP"
}
######################################common web dossier check code######################################
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

def get_browser_test_dir()
  "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/test-driver-browser"
end



######################################common ci metrics code######################################
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