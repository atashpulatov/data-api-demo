@ci_pipeline_postmerge_windows_chrome 
Feature: TS41441 - Sanity checks

  Scenario: [TC49134] - Error Handling part 2 Number formatting
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button

     When I found and selected object "Number Formatting"
      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      And I clicked Import with options button
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

      And I changed cell "G2" font name to "Arial Black"

     When I clicked Refresh on object 1
      And I closed last notification

     Then I verified that cell "L4" has value "245,677 PLN"
      And I verified that align middle button is selected for cell "B2"
      And I verified that align left button is selected for cell "C2"
      And I verified that bold button is selected for cell "D2"
      And I verified that for cell "G2" font name is "Arial Black"
      And I verified that cell "B4" has value "$8,907.00"
      And I verified that cell "B2" has value "$4,560.00"
      And I verified that cell "C4" has value "245.90%"

      And I logged out
