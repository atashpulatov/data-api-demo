@windows_desktop
@windows_chrome
@mac_chrome
Feature: F12909 - Import report

  Scenario: [TC35247] - Importing reports larger than Excel rows & project limitation
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found object by ID "E6B64AE611E95F872F800080EFD500F4" and selected "1,5M Sales Records.csv"
     Then I clicked Import button and saw error "This object exceeds the MicroStrategy project row limit. Please contact your administrator."

      And I logged out
