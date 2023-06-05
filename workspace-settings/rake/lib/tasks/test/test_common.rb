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

desc "run test in python on Windows"
task :py_e2e_test_win,[:tag_name, :build_no] do | t, args|
  args.with_defaults(:build_no => Nexus.latest_artifact_version(artifact_id: "office", group_id: Common::Version.dependency_group_id))
  test_dir = get_python_test_dir()
  tag_name = args['tag_name']
  build_no = args['build_no']
  allure_folder = 'allureFolder'
  allure_folder_path = "#{test_dir}/#{allure_folder}"
  test_os = "win19"

  FileUtils.rm_rf allure_folder_path if Dir.exist? allure_folder_path

  shell_command! "python -m venv venv_win", cwd: test_dir
  shell_command! "venv_win\\Scripts\\Activate.bat", cwd: test_dir
  begin
    shell_command! "python -m pip install -r requirements.txt", cwd: test_dir
    shell_command! "python -m behave --tags=@#{tag_name} --no-skipped -D config_file=config_ci_#{PY_WIN_TEST_PARAM[tag_name]}.json --logging-level=DEBUG --format allure_behave.formatter:AllureFormatter -o #{allure_folder} tests/", cwd: test_dir
  ensure
    shell_command! "npm install -g allure-commandline --save-dev",  cwd: "#{test_dir}"
    shell_command! "allure generate #{allure_folder} --clean ", cwd: "#{test_dir}"
    shell_command! "npm install", cwd: get_browser_test_dir()
    info "publish e2e test result to Rally"

    shell_command! "npm run rally verdict=all build=#{build_no} os=#{test_os} target=#{PY_WIN_TEST_PARAM[tag_name]}", cwd: get_browser_test_dir()
  end

  if PY_MAC_TEST_PARAM[tag_name] == "windows_desktop"
    target_dir = "#{$WORKSPACE_SETTINGS[:paths][:organization][:home]}/mstr-office/#{tag_name}"
    FileUtils.rm_rf target_dir
    FileUtils.mkdir_p target_dir
    FileUtils.cp_r("#{test_dir}/allure-report", target_dir)
  end
end

desc "publish test result for browser e2e"
task :copy_results,[:type] do | t, args|
    type = args['type']
    report_path = "#{$WORKSPACE_SETTINGS[:paths][:organization][:home]}/mstr-office/#{type}/allure-report"
    local_report_dir = "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/#{type}"

  FileUtils.rm_rf local_report_dir
  FileUtils.mkdir_p local_report_dir unless Dir.exists? local_report_dir
  FileUtils.cp_r(report_path, local_report_dir)
end

desc "run test in python on Mac"
task :py_e2e_test_mac,[:tag_name, :build_no] do | t, args|
  args.with_defaults(:build_no => Nexus.latest_artifact_version(artifact_id: "office", group_id: Common::Version.dependency_group_id))
  test_dir = get_python_test_dir()
  tag_name = args['tag_name']
  build_no = args['build_no']
  allure_folder = 'allureFolder'
  allure_folder_path = "#{test_dir}/#{allure_folder}"
  test_os = "mac14"

  FileUtils.rm_rf allure_folder_path if Dir.exist? allure_folder_path

  begin
    shell_command! "behave --tags=@#{tag_name} --no-skipped -D config_file=config_ci_#{PY_MAC_TEST_PARAM[tag_name]}.json --logging-level=DEBUG --format allure_behave.formatter:AllureFormatter -o #{allure_folder} tests/", cwd: test_dir
  ensure
    shell_command! "allure generate #{allure_folder} --clean ", cwd: "#{test_dir}"
    info "publish e2e test result to Rally"
    shell_command! "npm install", cwd: get_browser_test_dir()
    shell_command! "npm run rally verdict=all build=#{build_no} os=#{test_os} target=#{PY_MAC_TEST_PARAM[tag_name]}", cwd: get_browser_test_dir()
  end
end

def is_jenkins_env?
  return ENV['USER'] == "jenkins"
end

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

def get_python_test_dir()
  "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:home]}/integration/python"
end

PY_WIN_TEST_PARAM = {
  "ci_pipeline_rv_windows_desktop" => "windows_desktop_rv",
  "ci_pipeline_rv_windows_chrome" => "windows_chrome_rv",
  "ci_pipeline_postmerge_windows_desktop" => "windows_desktop_local",
  "ci_pipeline_postmerge_windows_chrome" => "windows_chrome_local",
  "ci_pipeline_daily_windows_desktop" => "windows_desktop_local",
  "ci_pipeline_daily_windows_chrome" => "windows_chrome_local",
  "ci_pipeline_all_windows_desktop" => "windows_desktop_local",
  "ci_pipeline_all_windows_chrome" => "windows_chrome_local"
}

PY_MAC_TEST_PARAM = {
  "ci_pipeline_rv_mac_chrome" => "mac_chrome_rv",
  "ci_pipeline_rv_mac_desktop" => "mac_desktop_rv",
  "ci_pipeline_postmerge_mac_chrome" => "mac_chrome_local",
  "ci_pipeline_postmerge_mac_desktop" => "mac_desktop_local",
  "ci_pipeline_daily_mac_chrome" => "mac_chrome_local",
  "ci_pipeline_daily_mac_desktop" => "mac_desktop_local",
  "ci_pipeline_all_mac_chrome" => "mac_chrome_local",
  "ci_pipeline_all_mac_desktop" => "mac_desktop_local"
}

def group_id
  return Common::Version.dependency_group_id
end

######################################common ci metrics code######################################


