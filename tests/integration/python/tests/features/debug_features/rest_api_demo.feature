@mac_chrome
@windows_desktop
@mac_desktop
@windows_chrome

Feature: Rest API demo feature

  Scenario: Certify object
    Given Object "13CFD83A458A68655A13CBA8D7C62CD5" in Tutorial project is not certified

      When I certify object "13CFD83A458A68655A13CBA8D7C62CD5" in Tutorial project
      Then object "13CFD83A458A68655A13CBA8D7C62CD5" is certified in Tutorial project

      When I decertify object "13CFD83A458A68655A13CBA8D7C62CD5" in Tutorial project
      Then object "13CFD83A458A68655A13CBA8D7C62CD5" is not certified in Tutorial project
