@mac_chrome
Feature: F31681 - Authentication and Prepare Data workflow improvements

  Scenario: [TC67260] Improve usability of the add-in
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

     When I hovered over the first object in the list
     Then I verified that the background color of the first object is "rgba(249, 249, 249, 1)"

     When I selected the first object from the list
     Then I verified that the background color of the first object is "rgba(240, 247, 254, 1)"

      And I log out
