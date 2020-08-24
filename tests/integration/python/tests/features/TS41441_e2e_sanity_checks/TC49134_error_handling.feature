@mac_chrome
Feature: TS41441 - Sanity checks

  Scenario: [TC49134] - Error Handling
    #Given I logged in as default user
    Given I pass
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found and selected object "1,5M Sales Records.csv"
     Then I clicked Import button and see error "The table you try to import exceeds the worksheet limits."

     When I selected cell "A1048576"
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      And I found and selected object "Report accessing XML file"
     Then I clicked Import button and see error "The table you try to import exceeds the worksheet limits."

     When I selected cell "XFD1"
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      And I found and selected object "Report accessing XML file"
     Then I clicked Import button and see error "The table you try to import exceeds the worksheet limits."

     When I selected cell "A1"
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      And I found and selected object "110k Sales Records.csv"
     Then I clicked Import button and see error "This object exceeds the MicroStrategy project row limit. Please contact your administrator."

     When I selected cell "A1"
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      And I found and selected object "Report with Page by, Advanced Sorting, Thresholds, Outline, Banding, Merge cells & Multiform attributes"
      And I clicked Import button
     Then I closed all notifications

     When I clicked Add Data button
      And MyLibrary Switch is OFF
      And I found and selected object "Report accessing XML file"
      And I clicked Import button without checking results
     Then I clicked Cancel button in Range Taken popup

     When I selected cell "H1"
      And I clicked Add Data button
      And MyLibrary Switch is OFF
      And I found and selected object "Report with Totals and Subtotals"
      And I clicked Import button
     Then I closed all notifications

     When I added a new worksheet
      And I clicked Add Data button
      And MyLibrary Switch is OFF
      And I found and selected object "Report with crosstab 123"
      And I clicked Import button
     Then I closed all notifications

     When I added a new worksheet
      And I clicked Add Data button
      And MyLibrary Switch is OFF
      And I found and selected object "Number Formatting"
      And I clicked Import button
      And I closed all notifications
     Then cell "B2" should have value "$4,560.00"

     When I clicked table design tab
     Then I clicked green table style

     When I clicked home tab
      And I selected cell "B4"
      And I clicked percentage button
     Then cell "B4" should have value "890700.00%"

     When I selected cell "C4"
      And I clicked comma style button
     Then cell "C4" should have value "2.46"

     When I selected cell "B2"
      And I clicked align middle button
      And I selected cell "C2"
      And I clicked align left button
      And I selected cell "D2"
      And I clicked bold button
      And I selected cell "E2"
      And I clicked font color button
      And I selected cell "G2"
      And I clicked fill color button
      And I changed cell "G2" font name to "Arial Black"

     When I clicked clear data
      And I log out
      And I logged in with username "user2" and password "user2"
      And I clicked view data
      And I closed all notifications
     Then cell "L4" should have value "245,677 PLN"

      And I log out