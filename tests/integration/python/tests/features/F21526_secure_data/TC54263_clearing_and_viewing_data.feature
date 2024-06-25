#@ci_pipeline_postmerge_windows_chrome 
Feature: F21526 - Secure data

  Scenario: [TC54263] - Clearing and viewing data
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "Revenue by Region and Category - secure data"
      And I selected import type "Import Data" and clicked import
      And I waited for object to be imported successfully
     Then I closed last notification

     When I selected cell "E1"
      And I clicked Add Data button
      And I found and selected object "Secure data - always working"
      And I selected import type "Import Data" and clicked import
      And I waited for object to be imported successfully
     Then I closed all notifications
      And I verified that cells ["A1", "B33", "E1", "F77"] have values ["Region", "Music", "Country", "Sub-Saharan Africa"]

     When I clicked clear data
     Then I verified that cells ["A1", "B33", "E1", "F77"] have values ["Region", "", "Country", ""]
      And I logged out

     When I logged in with username "Tim" and empty password
      And I clicked view data
      And I closed all notifications
     Then I verified that cells ["B33", "F77"] have values ["Music", "Sub-Saharan Africa"]

     When I clicked clear data
     Then I logged out

     When I logged in with username "Jeff" and empty password
      And I clicked view data
      And I closed all notifications
     Then I verified that cells ["B33", "F77", "B3"] have values ["", "Sub-Saharan Africa", "Books"]

     When I clicked clear data
     Then I logged out

     When I logged in with username "Martyna" and empty password
      And I clicked view data
      And I closed last notification
      And I closed all warning notifications
     Then I verified that cells ["F77", "B3" ] have values ["Sub-Saharan Africa", ""]

     When I removed object 2 using icon
      And I removed object 1 using icon
      And I closed all notifications

     Then I logged out
