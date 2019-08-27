#
# Cookbook Name:: workspace
# Recipe:: attributes_overrides
#

java_minor_version = 8
java_patch_version = 74
java_osx_checksum = '3117194c12f0c6a072b93ad5e299ecf017262fed'
java_windows_checksum = 'fdd3eece9ddb19cc4bb13096752b065d313e1c31'

case node['platform']
when 'redhat', 'centos', 'fedora', 'amazon'
  node.override[:java].deep_merge!({
    install_flavor: 'oracle_rpm',
    java_home: "/usr/java/jdk1.#{java_minor_version}.0_#{java_patch_version}",
    oracle_rpm: {
      type: 'jdk',
      package_version: "1.#{java_minor_version}.0_#{java_patch_version}-fcs",
      package_name: "jdk1.#{java_minor_version}.0_#{java_patch_version}"
    }
  })
when 'mac_os_x'
  node.override[:java].deep_merge!({
    osx_dmg: {
      app_name:       "JDK #{java_minor_version} Update #{java_patch_version}",
      volumes_dir:    "JDK #{java_minor_version} Update #{java_patch_version}",
      package_id:     "JDK #{java_minor_version} Update #{java_patch_version}.pkg",
      url:            "https://nexus.internal.microstrategy.com:8443/repositories/filerepo/com/oracle/java/jdk/macosx/#{java_minor_version}u#{java_patch_version}/macosx-#{java_minor_version}u#{java_patch_version}-x64.dmg",
      dmg_name:       "jdk-#{java_minor_version}u#{java_patch_version}-macosx-x64",
      checksum:       java_osx_checksum,
      java_home:      "/Library/Java/JavaVirtualMachines/jdk1.#{java_minor_version}.0_#{java_patch_version}.jdk/Contents/Home"
    }
  })
when 'windows'
  node.override[:java].deep_merge!({
    windows: {
      java_home: "C:\\Java\\jdk1.#{java_minor_version}.0_#{java_patch_version}",
      checksum: java_windows_checksum,
      url: "https://nexus.internal.microstrategy.com/service/local/repositories/filerepo/content/com/oracle/java/jdk/windows/#{java_minor_version}u#{java_patch_version}/windows-#{java_minor_version}u#{java_patch_version}-x64.exe"
    }
  })
else
  Chef::Application.fatal!("this OS is not supported: #{node['platform']}")
end

node.override[:nodejs].deep_merge!(
  version: '10.16.3',
  binary: {
    checksum: {
      darwin_x64: '6febc571e1543c2845fa919c6d06b36a24e4e142c91aedbe28b6ff7d296119e4',
      linux_x64: '2f0397bb81c1d0c9901b9aff82a933257bf60f3992227b86107111a75b9030d9'
    }
  }
)

node.override[:virtualbox][:version]  = '5.0.20-106931'
