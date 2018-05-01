Rake::Task[:upload].clear_prerequisites

desc "deploy project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :deploy, :version do |t, args|
  good "Puts deployment code here: #{__FILE__}:#{__LINE__}"
end
