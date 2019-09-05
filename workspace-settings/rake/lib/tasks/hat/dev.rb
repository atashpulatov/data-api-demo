require 'shell-helper'
require 'common/version'
require 'json'
require 'nokogiri'
require 'github'
require 'localization/generator'
require 'json'

include ShellHelper::Shell

@string_file_path_base = "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/src/locales"

desc "generate local strings"
task :generate_localization_strings do
  database = 'EXCEL'
  default_lan = 'English'
  languages = {
    English:            'en-US',
    Francais:           'fr-FR',
    Deutsch:            'de-DE',
    Danish:             'da-DK',
    Dutch:              'nl-NL',
    Espanol_Espana:     'es-ES',
    Svenska:            'sv-SE',
    Italiano:           'it-IT',
    Portuguese_Brazil:  'pt-BR',
    Japanese:           'ja-JP',
    Korean:             'ko-KR',
    Chinese:            'zh-CN',
    Trad_Chinese:       'zh-TW'
  }

  Localization::Generator.generate_string(database)
  connect =  Sequel.sqlite("#{$WORKSPACE_SETTINGS[:paths][:organization][:home]}/ProductStrings/#{database}/#{database}.db")

  translated_strings = Hash.new
  languages.each do |lan, short_lan|
    translated_strings[lan] = Hash.new
  end

  strings = connect[:Strings]

  strings.each{|string|
    languages.each do |lan, short_lan|
      key = string["String_#{default_lan}".to_sym]
      value = string["String_#{lan}".to_sym]
      if value.nil?
        translated_strings[lan][key] = key
      else
        translated_strings[lan][key] = value
      end
    end
  }

  translated_strings_default = translated_strings[default_lan.to_sym]


  languages.each do |lan, short_lan|
    string_file_path = File.join(@string_file_path_base, "#{short_lan}.json")

    translated_strings_lan =  translated_strings[lan]
    string_file = File.open(string_file_path, 'w')
    string_file.write(JSON.pretty_generate(translated_strings_lan))
    string_file.close
  end

end

desc "monitor DB change"
task :monitor_DB_change  => [:generate_localization_strings] do
  puts "Monitor DB change"
  diff_file = "strings_diff.txt"

  shell_command! "git config user.email \"jenkins@microstrategy.com\"", cwd: $WORKSPACE_SETTINGS[:paths][:project][:home]
  shell_command! "git config user.name \"Jenkins Vagrant\"", cwd: $WORKSPACE_SETTINGS[:paths][:project][:home]

  shell_command! "git checkout #{Common::Version.application_branch}", cwd: $WORKSPACE_SETTINGS[:paths][:project][:home]
  shell_command! "git pull", cwd: $WORKSPACE_SETTINGS[:paths][:project][:home]

  shell_command!(
    "git diff -c #{@string_file_path_base} > #{diff_file}",
    cwd:"#{$WORKSPACE_SETTINGS[:paths][:project][:home]}"
  )

  diff = File.read("#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/#{diff_file}")
  if not diff.eql?('')
      shell_command!(
        "git commit -m \"update strings\" -- #{@string_file_path_base}",
        cwd:"#{$WORKSPACE_SETTINGS[:paths][:project][:home]}"
      )
      shell_command!(
        "git push origin #{Git.branch_name}",
        cwd:"#{$WORKSPACE_SETTINGS[:paths][:project][:home]}"
      )
  end
end

desc "build project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/build"
task :build do
  install_dependencies("#{$WORKSPACE_SETTINGS[:paths][:project][:home]}")
  # build the office.zip
  shell_command! "npm run build", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
  shell_command! "zip -r office-#{Common::Version.application_version}.zip .", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/build"

  # # build the office_loader.zip
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
  run_test("#{$WORKSPACE_SETTINGS[:paths][:project][:home]}")
end

desc "run the unit test and collect code coverage in stage_0 pre-merge job"
task :stage_0_test do
  info "npm version"
  shell_command! "npm -v", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"

  info "node version"
  shell_command! "node -v", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"

  
  #run test under current workspace
  if ENV["ghprbTargetBranch"].nil?
    raise "ghprbTargetBranch environment should not be nil"
  end
  run_test("#{$WORKSPACE_SETTINGS[:paths][:project][:home]}")

  # pre-merge job shouldn't fail when test fail in base branch.
  # if the build process fail in base branch, publish the error message to pull request page.
  begin
    message = nil
    #checkout the code in base branch
    init_base_branch_repo(ENV["ghprbTargetBranch"])
    #run test with base branch
    run_test(base_repo_path)
    generate_comparison_report_html
    generate_comparison_report_markdown
    generate_eslint_report
  rescue Exception => e
    message = "Waring: Failed to run test with base branch and generate report, caught exception #{e}!"
    warn(message)
  ensure
    publish_to_pull_request_page(message)
  end

end

desc "run the unit test and collect code coverage in stage_1 dev job"
task :stage_1_test do
  run_test("#{$WORKSPACE_SETTINGS[:paths][:project][:home]}")
end

desc "debug rake task"
task :debug do
  # generate_comparison_report_markdown
  generate_eslint_report
  # publish_to_pull_request_page
end

def run_test(working_dir)
  install_dependencies(working_dir)
  shell_command! "npm run test:coverage", cwd: "#{working_dir}/production"
end


def install_dependencies(working_dir)
  shell_command! "rm -rf node_modules", cwd: "#{working_dir}/production"
  shell_command! "rm -rf node_modules", cwd: "#{working_dir}/office-loader"
  update_package_json(working_dir)
  shell_command! "npm install", cwd: "#{working_dir}/production"
  shell_command! "yarn install --network-concurrency 1", cwd: "#{working_dir}/office-loader"
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


def init_base_branch_repo(branch_name)
  unless Dir.exist? base_repo_path
    shell_command! "git clone https://github.microstrategy.com/Kiai/mstr-office.git mstr-office-base" , cwd:$WORKSPACE_SETTINGS[:paths][:organization][:home]
  end
  shell_command! "git fetch", cwd:base_repo_path
  shell_command! "git checkout #{branch_name}", cwd:base_repo_path
  shell_command! 'git reset --hard HEAD', cwd:base_repo_path
  shell_command! 'git clean -dfx', cwd:base_repo_path
  shell_command! "git pull origin #{branch_name}", cwd:base_repo_path
end

def base_repo_path
  "#{$WORKSPACE_SETTINGS[:paths][:organization][:home]}/mstr-office-base"
end

#funcition to generate the comparison report in html format
def generate_comparison_report_html
  comparison_report_path = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/.comparison_report"
  base_report_dir = "#{base_repo_path}/production/coverage"
  current_report_dir = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/production/coverage"
  unless File.exist? "#{base_report_dir}/clover.xml"
    raise "coverage report is not generated properly for base branch"
  end
  unless File.exist? "#{current_report_dir}/clover.xml"
    raise "coverage report is not generated properly for current branch"
  end
  FileUtils.rm_rf "#{comparison_report_path}/base"
  FileUtils.rm_rf "#{comparison_report_path}/current"
  FileUtils.cp_r("#{base_report_dir}/lcov-report","#{comparison_report_path}/base")
  FileUtils.cp_r("#{current_report_dir}/lcov-report","#{comparison_report_path}/current")
end

def generate_eslint_report
  eslint_report_path = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/.eslint/index.html"
  shell_command "npm run eslint \"src/**\" -f html -o #{eslint_report_path}", cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home]
end


#funcition to generate the comparison report in markdown format
def generate_comparison_report_markdown
  base_report_dir = "#{base_repo_path}/production/coverage"
  current_report_dir = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/production/coverage"
  comparison_report_path = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/.comparison_report"
  #read both base and current xml report
  base_doc = File.open("#{base_report_dir}/clover.xml") { |f| Nokogiri::XML(f) }
  base_doc = base_doc.slop!
  current_doc = File.open("#{current_report_dir}/clover.xml") { |f| Nokogiri::XML(f) }
  current_doc = current_doc.slop!
  #build the comparsion model
  compare_obj = {}
  compare_obj["All files"] = {}
  #add metrics data from base report
  add_data_for_doc(compare_obj,base_doc,"base_metric")
  #add metrics data from current report
  add_data_for_doc(compare_obj,current_doc,"current_metric")

  #generate markdown strings and write it to a file
  mf = File.open("#{comparison_report_path}/markdown.html", "w")
  mf.write('<table><tr><td>File</td><td colspan="2">%Stmts</td><td colspan="2">%Branch</td><td colspan="2">%Funcs</td><td colspan="2">%Lines</td><td colspan="2">Uncovered Line</td></tr>')
  mf.write('<tr><td></td><td>base</td><td>current</td><td>base</td><td>current</td><td>base</td><td>current</td><td>base</td><td>current</td><td>base</td><td>current</td></tr>')
  write_row_to_compare_table(mf, "All files",compare_obj["All files"])
  compare_obj["All files"]["packages"].each do |pack_name, package|
    write_row_to_compare_table(mf, "&nbsp#{pack_name}",package)
    package["files"].each do |file_name, file|
      write_row_to_compare_table(mf, "&nbsp&nbsp#{file_name}",file)
    end
  end
  mf.write('</table>')
  mf.close()

end

def write_row_to_compare_table(mf, name, node)
  contains_diff = false
  base_stmts = [get_ratio(node["base_metric"],"cov_stat","total_stat")]
  current_stmts = [get_ratio(node["current_metric"],"cov_stat","total_stat")]
  base_branch = [get_ratio(node["base_metric"],"cov_branch","total_branch")]
  current_branch = [get_ratio(node["current_metric"],"cov_branch","total_branch")]
  base_func = [get_ratio(node["base_metric"],"cov_func","total_func")]
  current_func  = [get_ratio(node["current_metric"],"cov_func","total_func")]
  base_line = [get_ratio(node["base_metric"],"cov_lines","total_lines")]
  current_line = [get_ratio(node["current_metric"],"cov_lines","total_lines")]
  base_uncover = get_uncover(node["base_metric"])
  current_uncover = get_uncover(node["current_metric"])
  contains_diff = compare_ratio(base_stmts, current_stmts) || contains_diff
  contains_diff = compare_ratio(base_branch,current_branch) || contains_diff
  contains_diff = compare_ratio(base_func,current_func) || contains_diff
  contains_diff = compare_ratio(base_line,current_line) || contains_diff
  if contains_diff
    mf.write("<tr><td>#{name}</td><td>#{base_stmts[0]}</td><td>#{current_stmts[0]}</td>  <td>#{base_branch[0]}</td><td>#{current_branch[0]}</td>  <td>#{base_func[0]}</td><td>#{current_func[0]}</td>  <td>#{base_line[0]}</td><td>#{current_line[0]}</td>  <td>#{base_uncover}</td><td>#{current_uncover}</td></tr>")
  end
end
#a tricky way for reference parameter
def compare_ratio(base, current)
  if base[0] == current[0]
    return false
  end
  if base[0] == "N/A" or current[0]=="N/A"
    return true
  end
  base_f = base[0].to_f
  current_f = current[0].to_f
  if current_f > base_f
    current[0]+="↑"
  else
    current[0]+="↓"
  end
  return true

end
def get_uncover(node)
  if node.nil?
    return "N/A"
  else
    uncover_lines = node["uncover"]
    if uncover_lines.length == 0
      return ""
    end
    if uncover_lines.length > 4
      uncover_lines.shift(uncover_lines.length - 4)
      uncover_lines.unshift "..."
    end
    return uncover_lines.to_s
  end
end
def get_ratio(node, cov_key, total_key)
  if node.nil?
    return "N/A"
  else
    cov_value=node[cov_key]
    total_value=node[total_key]
    if total_value==0
      return "100.0"
    else
      return "#{(cov_value*10000.0/total_value).to_i/100.0}"
    end
  end
end
def add_data_for_doc(compare_obj, xml_doc, metric_name)
  compare_obj["All files"][metric_name] = get_metics_node(xml_doc.coverage.project.metrics)
  compare_obj["All files"]["packages"]={} if compare_obj["All files"]["packages"].nil?
  # the clover.xml format has changed, node 'project' is the child of node 'coverage'
  xml_doc.coverage.project.package.each do |package|
    pack_name = package["name"]
    compare_obj["All files"]["packages"][pack_name] = {}  if compare_obj["All files"]["packages"][pack_name].nil?
    compare_obj["All files"]["packages"][pack_name][metric_name] = get_metics_node(package.metrics)
    compare_obj["All files"]["packages"][pack_name]["files"] = {} if compare_obj["All files"]["packages"][pack_name]["files"].nil?
    #handle the single file package situation
    if package.file.is_a?(Nokogiri::XML::Element)
      handle_file(compare_obj,package.file,pack_name,metric_name)
    elsif package.file.is_a?(Nokogiri::XML::NodeSet)
      package.file.each do |file|
        handle_file(compare_obj,file,pack_name,metric_name)
      end
    end
  end

end
def handle_file(compare_obj, file, pack_name,metric_name)
  file_name = file["name"]
  compare_obj["All files"]["packages"][pack_name]["files"][file_name] = {} if compare_obj["All files"]["packages"][pack_name]["files"][file_name].nil?
  compare_obj["All files"]["packages"][pack_name]["files"][file_name][metric_name] = get_metics_node(file.metrics)
  lines = file.xpath("./line")
  lines.each do |line|
    compare_obj["All files"]["packages"][pack_name]["files"][file_name][metric_name]["total_lines"]+=1
    compare_obj["All files"]["packages"][pack_name][metric_name]["total_lines"] +=1
    compare_obj["All files"][metric_name]["total_lines"]+=1
    if line["count"] == "0"
      compare_obj["All files"]["packages"][pack_name]["files"][file_name][metric_name]["uncover"].push(line["num"])
    else
      compare_obj["All files"]["packages"][pack_name]["files"][file_name][metric_name]["cov_lines"]+=1
      compare_obj["All files"]["packages"][pack_name][metric_name]["cov_lines"] +=1
      compare_obj["All files"][metric_name]["cov_lines"]+=1
    end
  end
end
def get_metics_node(source)
  metics_node = {}
  metics_node["total_stat"] = source["statements"].to_i
  metics_node["cov_stat"] = source["coveredstatements"].to_i
  metics_node["total_branch"] = source["conditionals"].to_i
  metics_node["cov_branch"] = source["coveredconditionals"].to_i
  metics_node["total_func"] = source["methods"].to_i
  metics_node["cov_func"] = source["coveredmethods"].to_i
  metics_node["total_lines"] = 0
  metics_node["cov_lines"] = 0
  metics_node["uncover"] = []
  metics_node
end
#publish markdown report to pull request page

def publish_to_pull_request_page(message=nil)
  unless ENV['USER'] == 'jenkins'
    #only available in jenkins envrionment
    puts "only available in jenkins env"
    return
  end
  # if the argument 'message' is not given(message=nil), then publish the markdown report to pull request page.
  if message
    comments_message = message
  else
    markdown_report_path = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/.comparison_report/markdown.html"
    unless File.exist? markdown_report_path
      raise "#{markdown_report_path} does not exist, please generate before"
    end
    markdown_message = File.read(markdown_report_path)
    job_url = ENV['BUILD_URL']
    comments_message = "job page:\n#{job_url}\nlinter report:\n#{job_url}eslint_report\ncode coverage report:\n#{job_url}Code_Coverage_Report\n#{markdown_message}\n"
  end
  pull_request = Github::PullRequests.new(ENV['GITHUB_USER'], ENV['GITHUB_PWD'])
  pull_request.comment_pull_request(ENV['PROJECT_NAME'],ENV['ORGANIZATION_NAME'],ENV["ghprbPullId"],comments_message)
end
