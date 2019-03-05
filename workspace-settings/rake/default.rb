require 'compiler/maven'

Compiler::Maven.artifact_info(
  artifact_file_extension: "zip",
  output_dir: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/build",
)
