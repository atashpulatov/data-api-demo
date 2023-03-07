require 'shell-helper'
require 'common/version'
require 'json'
require 'nokogiri'
require 'github'
require 'json'
require 'active_support/all'
require 'localization-helper'
require 'docker-registry'

include ShellHelper::Shell

def docker_image_name
    DockerRegistry.image_from_nexus("node:#{ENV['nodejs_image_tag']}")
end


def run_script_in_docker(script, path = "")
    case script
        when "production/build.sh"
            folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
            path = "production"
        when "office-loader/build.sh"
            folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}"
            path = ""
        end
    docker_run!(
      "docker run -v #{folder}:/mnt/#{path} -e APPLICATION_VERSION=#{Common::Version.application_version} --entrypoint '/bin/sh' #{docker_image_name} /mnt/#{script}",
        cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home]
      )
  end

desc "update localization strings from ProductStrings"
task :update_strings do
  # checkout and clean
  LocalizationHelper.check_out_to_branch

  # get the latest artifact version
  artifact_version = Nexus.latest_artifact_version(
    artifact_id: "MSTR_OFFICE",
    group_id: "com.microstrategy.next.ProductStrings",
    repository: $WORKSPACE_SETTINGS[:nexus][:repos][:release],
    extra_coordinates: {e: 'zip'}
  )

  # download the string bundle file zip
  Nexus.download_large_artifact(
    file_path: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/string_bundle.zip",
    version: artifact_version,
    artifact_id: "MSTR_OFFICE",
    group_id: "com.microstrategy.next.ProductStrings",
    repository: $WORKSPACE_SETTINGS[:nexus][:repos][:release],
    extra_coordinates: {e: 'zip'}
  )

  # unzip and replace original files
  string_files_path = "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/src/locales"
  shell_command! "unzip -o string_bundle.zip", cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home]
  shell_command! "cp -vr strings/* #{string_files_path}", cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home]

  # download the string metadata json file
  Nexus.download_large_artifact(
    file_path: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/string_metadata.json",
    version: artifact_version,
    artifact_id: "MSTR_OFFICE",
    group_id: "com.microstrategy.next.ProductStrings.metadata",
    repository: $WORKSPACE_SETTINGS[:nexus][:repos][:release],
    extra_coordinates: {e: 'json'}
  )
  metadata = JSON.parse(File.read("#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/string_metadata.json"))

  # remove the metadata json file
  FileUtils.rm "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/string_metadata.json" if File.exist? "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/string_metadata.json"

  # remove the string bundle files
  FileUtils.rm "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/string_bundle.zip" if File.exist? "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/string_bundle.zip"
  FileUtils.rm_rf "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/strings" if Dir.exist? "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/strings"

  # commit string changes
  LocalizationHelper.commit_string_changes_if_needed(string_files_path, "#{artifact_version}; #{metadata["rally_items"].join(';')}")
end


desc "build project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/build"
task :build do

    # build the office.zip
    update_package_json("#{$WORKSPACE_SETTINGS[:paths][:project][:home]}")
    run_script_in_docker("production/build.sh")
    shell_command! "zip -r office-#{Common::Version.application_version}.zip .", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/build"

    # build the office_loader.zip
    run_script_in_docker("office-loader/build.sh")
    shell_command! "zip -r office-loader-#{Common::Version.application_version}.zip .", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/office-loader/build"
end

def update_package_json(working_dir)
  package_json_path ="#{working_dir}/production/package.json"
  data = JSON.parse(File.read(package_json_path))
  #US192297 modify package.json file to add the version information
  if data.key?("build")
    data["build"] = Common::Version.application_version
  end
  File.open(package_json_path,"w") do |f|
    f.write(JSON.pretty_generate(data)) #generate beautified json
  end
end
