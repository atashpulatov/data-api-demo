@mac_chrome
Feature: F31681 - Authentication and Prepare Data workflow improvements

  Scenario: [TC67260] Improve usability of the add-in
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

     When I found object by ID "C437801F11EA82FBF70F0080EFC55790" and selected "Unpublished cube"
     Then I verified that Import button is disabled

     When I switched on MyLibrary
      And I switched off MyLibrary

     Then I verified that Import button is disabled

     When I cleared search box
      And I found object "report"
      And I hovered over the first object in the list

     Then I verified that the background color of the first object is "rgba(249, 249, 249, 1)"

     When I selected the first object from the list
     Then I verified that the background color of the first object is "rgba(240, 247, 254, 1)"

     When I cleared search box
      And I found object by ID "6D70D06949B83CD9DBFAC0AF5FE0010E" and selected "Report with prompt - Object prompt | Required | Default answer"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I clicked Run button
      And I hovered over first filter

     Then I verified that the background color of the first filter is "rgba(247, 247, 247, 1)"

     When I selected the first filter
     Then I verified that the background color of the first filter is "rgba(240, 247, 254, 1)"

     When I selected the first option from Display attribute form names
     Then I verified that the background color of the first option in Display attribute form names is "rgba(240, 247, 254, 1)"

     When I clicked Cancel button
      And I hovered over Log Out in Dots Menu

     Then I verified that the background color of Log Out is "rgba(247, 247, 247, 1)"

      And I log out
