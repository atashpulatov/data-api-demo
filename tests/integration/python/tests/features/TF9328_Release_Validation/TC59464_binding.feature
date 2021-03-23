@windows_desktop
@disabled_mac_chrome
@disabled_windows_chrome
@release_validation
Feature: TS41441 - Sanity checks

  Scenario: [TC59464] - Binding
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "28185E364F4B1CA6E8FA178214FDC3AE" and selected "01. • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«». • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&'()*+,-:;<=>@/`testtesttes/km123456"
      And I clicked Import button
      And I closed all notifications

# TODO step implemented only for Windows Desktop
     Then item number 1 in Name Box, ignoring timestamp at the end, was called "_01___________________________________Report_for_testing_binding_and_special_characters______________________________________________________________________Report_for_testing_binding_and_special_characters_________________________testtestt_"
      And I selected object number 1 from Name Box

     When I selected cell "K1"
      And I clicked Add Data button
      And I found object by ID "C2B08DA411EA441130640080EF154C73" and selected "01. • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«». • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&'()*+,-:;<=>@^`testtestteskaj"
      And I clicked Import button
      And I closed all notifications
      And I selected object number 2 from Name Box

# TODO step implemented only for Windows Desktop
     Then item number 2 in Name Box, ignoring timestamp at the end, was called "_01___________________________________Report_for_testing_binding_and_special_characters______________________________________________________________________Report_for_testing_binding_and_special_characters_________________________testtestt_"
# TODO step implemented only for Windows Desktop
      And I selected object number 2 from Name Box

     Then I verified that object number 1 and object number 2 in Name Box have different timestamps

      And I logged out
