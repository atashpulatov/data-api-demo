@mac_chrome
@mac_desktop
@windows_chrome
@windows_desktop
Feature: Rest API demo feature

  Scenario: Certify object
    Given I ensured object "8B7F2D9611EA9A8C50AA0080EFD55E92" in Tutorial project is decertified

     When I certified object "8B7F2D9611EA9A8C50AA0080EFD55E92" in Tutorial project
     Then object "8B7F2D9611EA9A8C50AA0080EFD55E92" is certified in Tutorial project

     When I decertified object "8B7F2D9611EA9A8C50AA0080EFD55E92" in Tutorial project
     Then object "8B7F2D9611EA9A8C50AA0080EFD55E92" is not certified in Tutorial project
