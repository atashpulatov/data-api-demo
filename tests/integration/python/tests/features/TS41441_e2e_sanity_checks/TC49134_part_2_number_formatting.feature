#@ci_pipeline_premerge_mac_chrome
#@ci_pipeline_postmerge_mac_chrome
#@ci_pipeline_daily_windows_chrome @ci_pipeline_daily_mac_chrome
#@disabled_ci_pipeline_all_mac_chrome
@ci_pipeline_rv_windows_chrome @ci_pipeline_rv_mac_chrome
@windows_desktop @windows_chrome @mac_chrome
@release_validation @ga_validation
Feature: TS41441 - Sanity checks

  Scenario: [TC49134] - Error Handling part 2 Number formatting
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

     When I found object by ID "8C5FA36E11E960ED26F00080EF256F5C" and selected "Number Formatting"
      And I clicked Import button
      And I closed all notifications
     Then I verified that cell "B2" has value "$4,560.00"

     When I clicked table design tab
     Then I clicked green table style

     When I selected cell "B4"
      And I clicked percentage button
     Then I verified that cell "B4" has value "890700%"

     When I selected cell "C4"
      And I clicked comma style button
     Then I verified that cell "C4" has value "2.46"

     When I selected cell "B2"
      And I clicked align middle button

      And I selected cell "C2"
      And I clicked align left button

      And I selected cell "D2"
      And I clicked bold button

      And I selected cell "E2"
      And I changed font color to "Light Green"

      And I selected cell "G2"
      And I changed fill color to "Light Green"

      And I changed cell "G2" font name to "Arial Black"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification

     Then I verified that cell "L4" has value "245,677 PLN"
      # TODO Check possibility to verify colors
      # And I verified that for cell "E2" font color "Light Green" is selected
      # And I verified that for cell "G2" fill color s"Light Green" is selected
      And I verified that align middle button is selected for cell "B2"
      And I verified that align left button is selected for cell "C2"
      And I verified that bold button is selected for cell "D2"
      And I verified that for cell "G2" font name is "Arial Black"
      And I verified that cell "B4" has value "$8,907.00"
      And I verified that cell "B2" has value "$4,560.00"
      And I verified that cell "C4" has value "245.90%"

      And I logged out
