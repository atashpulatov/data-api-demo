@mac_chrome
Feature: F21402 - Support for prompted reports while importing data for Excel add-in

  Scenario: [TC40306] - Importing prompted reports functionality, for all type of prompts (value, object, expression, etc) with Prepare Data
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF
     When I found object by ID "CDE36AFC11EA6220B17C0080EF054542" and selected "Report with all type of prompts (except nested)"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I selected "Electronics" as an answer for "3" prompt - object prompt
      And I typed "2016" for "4" prompt - value prompt
      And I typed "06/06/2016" for "8" prompt - value prompt
#      And I clicked Run button
#      And I clicked Run button
#
#     Then I closed last notification
#
#      And I log out