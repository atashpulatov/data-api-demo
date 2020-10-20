@windows_desktop
@mac_chrome
@windows_chrome
@release_validation
Feature: TS41441 - Sanity checks

  Scenario: [TC59464] - Binding
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "28185E364F4B1CA6E8FA178214FDC3AE" and selected "01. • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«». • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&'()*+,-:;<=>@/`testtesttes/km123456"
      And I clicked Import button
      And I closed all notifications
      And I selected object number 1 from Name Box

     Then object number 1 should be called "01. • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«». • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&'()*+,-:;<=>@/`testtesttes/km123456"

     When I selected cell "K1"
      And I clicked Add Data button
      And I found object by ID "C2B08DA411EA441130640080EF154C73" and selected "01. • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«». • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&'()*+,-:;<=>@^`testtestteskaj"
      And I clicked Import button
      And I closed all notifications
      And I selected object number 2 from Name Box

     Then object number 1 should be called "01. • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«». • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&'()*+,-:;<=>@^`testtestteskaj"

      And I logged out
