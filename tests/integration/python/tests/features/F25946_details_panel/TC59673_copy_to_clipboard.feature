@windows_desktop
@mac_chrome
@windows_chrome
Feature: F25946 - Details panel

  Scenario: [TC59673] - Copy to clipboard
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found object by ID "B40A496C11EA9A8C299F0080EF05BE92" and selected "CategorySubCategoryQuarter"

     When I displayed details for object number 1
     Then I verified that copying the details to clipboard works correctly

      And I closed Import Data popup
      And I logged out
