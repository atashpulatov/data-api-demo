require 'vagrant/rake/provider/esxi'

provider = Vagrant::Rake::Provider::ESXI.new

provider.generate_tasks

task :"rt_deploy_mstr_office_centos_#{Git.branch_name}_dev" => [:move_artifact]