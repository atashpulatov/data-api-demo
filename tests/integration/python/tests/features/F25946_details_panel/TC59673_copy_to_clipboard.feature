Feature: F25946 - Details panel

  Scenario: [TC59673] - Copy to clipboard
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button

      And I found and selected object "CategorySubCategoryQuarter"

     When I displayed details for object number 1
     Then I verified that copying the details to clipboard works correctly

      And I closed Import Data popup
      And I logged out
