#@ci_pipeline_postmerge_windows_chrome 
Feature: TS41441 - Sanity checks

  Scenario: [TC49134] - Error Handling part 2 Number formatting
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button

     When I found and selected object "Number Formatting"
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
      And I verified that for cell "E2" font color "Light Green" is selected
      And I verified that for cell "G2" fill color "Light Green" is selected
      And I verified that align middle button is selected for cell "B2"
      And I verified that align left button is selected for cell "C2"
      And I verified that bold button is selected for cell "D2"
      And I verified that for cell "G2" font name is "Arial Black"
      And I verified that cell "B4" has value "$8,907.00"
      And I verified that cell "B2" has value "$4,560.00"
      And I verified that cell "C4" has value "245.90%"

      And I logged out
