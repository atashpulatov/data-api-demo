Feature: F12909 - Import report

  Scenario: [TC35247] - Importing reports larger than Excel rows & project limitation
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "1,5M Sales Records.csv"
      And I selected import type "Import Data" and clicked import
      Then I saw error message "The table you try to import exceeds the worksheet limits." and I clicked OK

      And I logged out
