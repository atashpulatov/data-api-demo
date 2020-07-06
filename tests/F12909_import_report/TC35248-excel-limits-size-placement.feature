@mac_chrome
Feature: F12909 - Import report

  Scenario: [TC35247] - Importing reports larger than Excel rows & project limitation
    Given I logged in as default user
    And   I selected cell "A1048576"
    And   I clicked Import Data button
    Then  MyLibrary Switch is OFF

    Given I found and selected object "1k report"
    And   I clicked Import button and see error "The table you try to import exceeds the worksheet limits."

    Given I selected cell "XFD1"
    And   I clicked Import Data button
    And   MyLibrary Switch is OFF
    And   I found and selected object "1k report"
    Then  I clicked Import button and see error "The table you try to import exceeds the worksheet limits."

    Given I selected cell "A2"
    And   I clicked Import Data button
    And   MyLibrary Switch is OFF
    And   I found and selected object "1k report"
    Then  I clicked Import button and see error "The table you try to import exceeds the worksheet limits."
    And   I log out
