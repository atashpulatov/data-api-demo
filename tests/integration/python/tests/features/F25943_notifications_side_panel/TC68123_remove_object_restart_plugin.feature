Feature: F25943 - Notifications side panel

  Scenario: [TC68123] - Removing the object and restarting plugin without closing notification
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      

      And I found and selected object "100_report"
      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      And I clicked Import with options button
      And I closed last notification

     When I removed object 1 using icon
      And I clicked close Add-in button
      And I clicked Add-in icon

     Then I verified that the right panel is empty

      And I logged out
