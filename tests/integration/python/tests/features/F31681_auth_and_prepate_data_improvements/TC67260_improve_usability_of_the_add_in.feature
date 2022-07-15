#@ci_pipeline_daily_windows_desktop @ci_pipeline_daily_windows_chrome @ci_pipeline_daily_mac_chrome
@ci_pipeline_rv_windows_desktop @ci_pipeline_rv_windows_chrome @ci_pipeline_rv_mac_chrome
@windows_desktop @windows_chrome @mac_chrome
Feature: F31681 - Authentication and Prepare Data workflow improvements

  Scenario: [TC67260] Improve usability of the add-in
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

     When I found object by ID "C437801F11EA82FBF70F0080EFC55790" and selected "Unpublished cube"
     Then I verified that Import button is disabled

     When I hover over Import button
     Then I verified that tooltip for Import button shows message "You cannot import an unpublished cube."

     When I switched on MyLibrary
      And I switched off MyLibrary

     Then I verified that Import button is disabled

     When I hover over Import button
     Then I verified that tooltip for Import button shows message "You cannot import an unpublished cube."

     When I cleared search box
      And I found object "report"
      And I hovered over the first object in the list

     Then I verified that the background color of the first object is "#f9f9f9"

     When I selected the first object from the list
     Then I verified that the background color of the first object is "#f0f7fe"

     When I cleared search box
      And I found object by ID "6D70D06949B83CD9DBFAC0AF5FE0010E" and selected "Report with prompt - Object prompt | Required | Default answer"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I clicked Run button
      And I hovered over first filter

     Then I verified that the background color of the first filter is "#f7f7f7"

     When I selected the first filter
     Then I verified that the background color of the first filter is "#f0f7fe"

     When I selected the first option from Display attribute form names
     Then I verified that the background color of the first option in Display attribute form names is "#f0f7fe"

     When I clicked Cancel button
      And I hovered over Log Out in Dots Menu

     Then I verified that the background color of Log Out is "#f7f7f7"

      And I logged out
