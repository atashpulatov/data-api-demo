@mac_chrome
Feature: F25943 - Details panel

  Scenario: [TC68123] - Copy to clipboard
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found and selected object "100_report"
      And I clicked Import button
      And I closed last notification


     When I removed object 1 using icon
      And I clicked close plugin button
      And I clicked plugin icon
     Then Right panel is empty

      And I log out
