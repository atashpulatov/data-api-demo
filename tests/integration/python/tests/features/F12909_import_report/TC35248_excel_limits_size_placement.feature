@mac_chrome
Feature: F12909 - Import report

  Scenario: [TC35248] - Importing objects exceeding Excel size and placement limits
    Given I logged in as default user
    And I selected cell "A1048576"
    And I clicked Import Data button
    And MyLibrary Switch is OFF

    When I found and selected object "1k report"
    Then I clicked Import button and see error "The table you try to import exceeds the worksheet limits."

    Given I selected cell "XFD1"
    And I clicked Import Data button
    When I found and selected object "1k report"
    Then I clicked Import button and see error "The table you try to import exceeds the worksheet limits."

    Given I wrote text "test1" in cell "A2"
    And I selected cell "A1"
    And I clicked Import Data button
    When I found and selected object "1k report"
    Then I clicked Import button and see error "This operation requires the use of additional empty rows or columns."

    And I log out
