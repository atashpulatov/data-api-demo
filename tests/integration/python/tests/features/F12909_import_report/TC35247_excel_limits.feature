Feature: F12909 - Import report

  Scenario: [TC35247] - Importing reports larger than Excel rows & project limitation
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "1,5M Sales Records.csv"
      
     Then I clicked Import button and saw error "The table you try to import exceeds the worksheet limits."

      And I logged out
