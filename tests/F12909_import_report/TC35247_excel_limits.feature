@mac_chrome
Feature: F12909 - Import report

  Scenario: [TC35247] - Importing reports larger than Excel rows & project limitation
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found and selected object "1,5M Sales Records excel limit"
     Then I clicked Import button and see error "The table you try to import exceeds the worksheet limits."
      And I log out
