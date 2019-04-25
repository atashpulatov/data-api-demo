require 'shell-helper'
require 'common/version'
require 'json'

include ShellHelper::Shell

desc "build project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/build"
task :build do
  install_dependencies()
  # build the office.zip
  shell_command! "yarn build", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
  shell_command! "zip -r office-#{Common::Version.application_version}.zip .", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/build"

  # build the office_loader.zip
  shell_command! "yarn build", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/office-loader/build"
  shell_command! "zip -r office-loader-#{Common::Version.application_version}.zip .", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/office-loader/build"
end

task :clean do
  build_dir = "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/build"
  Dir.mkdir(build_dir) unless Dir.exist?(build_dir)
  FileUtils.rm_rf Dir.glob("#{build_dir}/*")

  build_dir = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/office-loader/build"
  Dir.mkdir(build_dir) unless Dir.exist?(build_dir)
  FileUtils.rm_rf Dir.glob("#{build_dir}/*")
end

desc "build project and run test, excluding packaging the build"
task :test do
  install_dependencies()
  shell_command! "yarn jest", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
  shell_command! "yarn jest --coverage", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
end


def install_dependencies()
  shell_command! "rm -rf node_modules", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
  shell_command! "rm -rf node_modules", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/office-loader"
  shell_command! "yarn install --network-concurrency 1", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
  shell_command! "yarn install --network-concurrency 1", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/office-loader"
end
