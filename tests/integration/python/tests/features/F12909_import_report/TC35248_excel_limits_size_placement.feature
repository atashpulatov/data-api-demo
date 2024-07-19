Feature: F12909 - Import report

  Scenario: [TC35248] - Importing objects exceeding Excel size and placement limits
    Given I initialized Excel

     When I logged in as default user
      And I selected cell "A1048576"
      And I clicked Import Data button
      And I found and selected object "1k report"
      And I selected import type "Import Data" and clicked import
     Then I saw error message "The table you try to import exceeds the worksheet limits." and I clicked OK

    Given I selected cell "XFD1"
      And I clicked Import Data button
      And I found object "1k report"
      And I opened All objects list

     When I selected first found object from the objects list
      And I selected import type "Import Data" and clicked import
     Then I saw error message "The table you try to import exceeds the worksheet limits." and I clicked OK

      And I logged out
