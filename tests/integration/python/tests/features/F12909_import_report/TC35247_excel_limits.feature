@windows_desktop @windows_chrome @mac_chrome
Feature: F12909 - Import report

  Scenario: [TC35247] - Importing reports larger than Excel rows & project limitation
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found object "1,5M Sales Records.csv"
      And I opened All objects list
      And I selected first found object from the objects list
      
     Then I clicked Import button and saw error "The table you try to import exceeds the worksheet limits."

      And I logged out
