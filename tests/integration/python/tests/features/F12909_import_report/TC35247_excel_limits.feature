@windows_desktop
@mac_chrome

Feature: F12909 - Import report

  Scenario: [TC35247] - Importing reports larger than Excel rows & project limitation
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found object by ID "E6B64AE611E95F872F800080EFD500F4" and selected "1,5M Sales Records.csv"
     Then I clicked Import button and see error "The table you try to import exceeds the worksheet limits."
      And I log out
