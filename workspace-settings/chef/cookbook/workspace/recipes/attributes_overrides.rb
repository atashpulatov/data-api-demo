#
# Cookbook Name:: workspace
# Recipe:: attributes_overrides
#


node.override[:nodejs].deep_merge!(
  version: '10.16.3',
  binary: {
    checksum: {
      darwin_x64: '6febc571e1543c2845fa919c6d06b36a24e4e142c91aedbe28b6ff7d296119e4',
      linux_x64: '2f0397bb81c1d0c9901b9aff82a933257bf60f3992227b86107111a75b9030d9',
      win_x64: '19aa47de7c5950d7bd71a1e878013b98d93871cc311d7185f5472e6d3f633146'
    }
  }
)

node.override[:virtualbox][:version]  = '5.0.20-106931'
