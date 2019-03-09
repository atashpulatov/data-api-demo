Rake::Task[:upload].clear_prerequisites

desc "upload plugins to nexus"
task :upload_plugins=> [:clean, :build]  do
  Nexus.upload_artifact(
    group_id:       "#{$WORKSPACE_SETTINGS[:nexus][:base_coordinates][:group_id]}.#{Common::Version.application_branch}",
    artifact_id:    "office",
    artifact_ext:   "zip",
    version:        "#{Common::Version.application_version}",
    repository:     $WORKSPACE_SETTINGS[:nexus][:repos][:release],
    artifact_path:  "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/build/office-#{Common::Version.application_version}.zip"
  )

  Nexus.upload_artifact(
    group_id:       "#{$WORKSPACE_SETTINGS[:nexus][:base_coordinates][:group_id]}.#{Common::Version.application_branch}",
    artifact_id:    "office-loader",
    artifact_ext:   "zip",
    version:        "#{Common::Version.application_version}",
    repository:     $WORKSPACE_SETTINGS[:nexus][:repos][:release],
    artifact_path:  "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/office-loader/build/office-loader-#{Common::Version.application_version}.zip"
  )

  commit_hash_file = $WORKSPACE_SETTINGS[:paths][:project][:jenkins][:commit][:hash][:file]
  commit_hash_file_directory = File.dirname(commit_hash_file)

  FileUtils.mkdir_p(commit_hash_file_directory) unless File.exist?(commit_hash_file_directory)
  File.open(commit_hash_file, "w"){|file|
    file.puts Common::Version.application_commit_hash
  }

  Nexus.upload_artifact(
    group_id:       "#{$WORKSPACE_SETTINGS[:nexus][:base_coordinates][:group_id]}.#{Common::Version.application_branch}",
    artifact_id:    "office",
    artifact_ext:   "zip.commithash",
    version:        "#{Common::Version.application_version}",
    repository:     $WORKSPACE_SETTINGS[:nexus][:repos][:manifest],
    artifact_path:  commit_hash_file
  )

  Nexus.upload_artifact(
    group_id:       "#{$WORKSPACE_SETTINGS[:nexus][:base_coordinates][:group_id]}.#{Common::Version.application_branch}",
    artifact_id:    "office-loader",
    artifact_ext:   "zip.commithash",
    version:        "#{Common::Version.application_version}",
    repository:     $WORKSPACE_SETTINGS[:nexus][:repos][:manifest],
    artifact_path:  commit_hash_file
  )
end
