require 'shell-helper'
require 'common/version'
require 'json'

include ShellHelper::Shell

desc "build project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/build"
task :build do
  install_dependencies()
  shell_command! "yarn build", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
end

task :clean do
  FileUtils.rm_rf Dir.glob("#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/build/*")
end

desc "build project and run test, excluding packaging the build"
task :test do
  install_dependencies()
  shell_command! "yarn jest", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
  shell_command! "yarn jest –coverage", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
end


def install_dependencies()
  update_package_json()
  shell_command! "yarn install", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
end

def update_package_json()
  data = JSON.parse(File.read("#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/package.json"));
  if data["dependencies"].key?("mstr-react-library")
    repo = data["dependencies"]["mstr-react-library"].split("@github.microstrategy.com:")[1]
    data["dependencies"]["mstr-react-library"] = "https://#{ENV['GITHUB_USER']}:#{ENV['GITHUB_PWD']}@github.microstrategy.com/#{repo}"
  end

  File.open("#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/package.json","w") do |f|
    f.write(data.to_json)
  end
end
