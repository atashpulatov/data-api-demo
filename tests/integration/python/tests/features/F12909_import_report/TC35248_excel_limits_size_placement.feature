@windows_chrome @mac_chrome
Feature: F12909 - Import report

  Scenario: [TC35248] - Importing objects exceeding Excel size and placement limits
    Given I initialized Excel

     When I logged in as default user
      And I selected cell "A1048576"
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

     When I found object by ID "C97D02A611E9554DBFC00080EF353F8E" and selected "1k report"
     Then I clicked Import button and saw error "The table you try to import exceeds the worksheet limits."

    Given I selected cell "XFD1"
      And I clicked Import Data button
     When I found and selected object "1k report"
     Then I clicked Import button and saw error "The table you try to import exceeds the worksheet limits."

      And I logged out
