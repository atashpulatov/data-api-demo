@ci_pipeline_rv_windows_chrome
@ci_pipeline_rv_mac_chrome
@todo_windows_desktop
@windows_chrome
@mac_chrome
@release_validation
Feature: F21526 - Secure data

  Scenario: [TC54263] - Clearing and viewing data
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "778ECA4C11E990F800000080EFA56C55" and selected "Revenue by Region and Category - secure data"
      And I clicked Import button without checking results
      And I waited for object to be imported successfully
     Then I closed last notification

     When I selected cell "E1"
      And I clicked Add Data button
      And I found object by ID "DA3AE08611E9919D00000080EFF597FB" and selected "Secure data - always working"
      And I clicked Import button without checking results
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
