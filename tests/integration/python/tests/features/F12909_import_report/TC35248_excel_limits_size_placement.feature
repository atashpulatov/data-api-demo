Feature: F12909 - Import report

  Scenario: [TC35248] - Importing objects exceeding Excel size and placement limits
    Given I initialized Excel

     When I logged in as default user
      And I selected cell "A1048576"
      And I clicked Import Data button
      And I found and selected object "1k report"

     Then I clicked Import button and saw error "The table you try to import exceeds the worksheet limits."

    Given I selected cell "XFD1"
      And I clicked Import Data button
      And I found object "1k report"
      And I opened All objects list

     When I selected first found object from the objects list
     Then I clicked Import button and saw error "The table you try to import exceeds the worksheet limits."

      And I logged out
