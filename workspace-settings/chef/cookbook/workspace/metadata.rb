name             'workspace'
maintainer       'Someone'
maintainer_email 'someone@microstrategy.com'
description      'Installs/Configures workspace'
long_description 'Installs and configures a workspace for this project'
version          '1.0.0'

depends 'chef_commons'
depends 'virtualbox'
depends 'extras'

__END__
below are some examples of additional cookbooks

depends 'java-osx'
depends 'java-windows'
depends 'java'
depends 'gradle'

depends 'idea'
