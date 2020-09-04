@mac_chrome
Feature: F31681 - Authentication and Prepare Data workflow improvements

  Scenario: [TC67260] Improve usability of the add-in
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

     When I found object by ID "269229C511EAD56AFBC20080EFE59C70" and selected "cube unpublished"
     Then I verified that Import Data button is disabled

     When I switched My Library toggle on
      And MyLibrary Switch is OFF

     Then I verified that Import Data button is disabled

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

     When I selected the first attribute form name
     Then I verified that the background color of the first attribute form name is "rgba(240, 247, 254, 1)"

     When I clicked Cancel button
      And I hovered over Log out

     Then I verified that the background color of the logout is "rgba(247, 247, 247, 1)"
      
      And I clicked three dots settings menu
      And I log out


   
