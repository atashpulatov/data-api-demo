Feature: TS41441 - Sanity checks

  Scenario: [TC59464] - Binding
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      
      And I found and selected object "01. • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«». • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&'()*+,-:;<=>@/`testtesttes/km123456"
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button
      And I closed all notifications

     Then I verified that the name of item number 1 in Name Box, ignoring timestamp at the end, is "_01___________________________________Report_for_testing_binding_and_special_characters______________________________________________________________________Report_for_testing_binding_and_special_characters_________________________testtestt_"
      And I selected object number 1 from Name Box

     When I selected cell "K1"
      And I clicked Add Data button
      And I found and selected object "01. • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«». • !#$%&'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&'()*+,-:;<=>@^`testtestteskaj"
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button
      And I closed all notifications
      And I selected object number 2 from Name Box

     Then I verified that the name of item number 2 in Name Box, ignoring timestamp at the end, is "_01___________________________________Report_for_testing_binding_and_special_characters______________________________________________________________________Report_for_testing_binding_and_special_characters_________________________testtestt_"
      And I selected object number 2 from Name Box

     Then I verified that object number 1 and object number 2 in Name Box have different timestamps

      And I logged out
