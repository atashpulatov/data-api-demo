@ci_pipeline_daily_windows_desktop
@ci_pipeline_rv_windows_desktop
@windows_desktop
Feature: TF9328 - Release Validation

  Scenario: [TC59469] - [Binding] Changing the name of the table in Excel Table options and refresh - ONLY DESKTOPS!
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "21311BF711EB7B426A380080EF75C6F3" and selected "01 Basic Report"
      And I clicked Import button
      And I closed all notifications
     Then I verified that the name of item number 1 in Name Box, ignoring timestamp at the end, is "_01_Basic_Report_"

     When I changed the table name to "table12345"
     Then I verified that the name of item number 1 in Name Box, ignoring timestamp at the end, is "table12345"

     When I clicked on object 1
#    TODO implement step: I verified that {cell_name} is a part of "{table_name}"
#    uncomment the step for this TC
#    Then I verified that A2 is a part of "table12345"
      And I selected object number 1 from Name Box
#    Then I verified that A2 is a part of "table12345"
      And I clicked Refresh on object 1
      And I waited for object to be refreshed successfully

     When I clicked on object 1
#    Then I verified that A2 is a part of "table12345"
      And I selected object number 1 from Name Box
#    Then I verified that A2 is a part of "table12345"
      And I changed object 1 name to "table1" using context menu
      And I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
     Then I verified that object number 1 is called "table1"

     When I clicked on object 1
#    Then I verified that A2 is a part of "table12345"
      And I selected object number 1 from Name Box
#    Then I verified that A2 is a part of "table12345"

     When I clicked Edit object 1
      And I unselected all attributes
      And I selected attribute element number 1
      And I unselected all metrics
      And I selected metric element number 1
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification
#    TODO Investigate why I verified that cell "A3" has value "Mid-Atlantic" step doesn't work correctly
#     Then I verified that cell "A3" has value "Mid-Atlantic"

     When I clicked on object 1
#    Then I verified that A2 is a part of "table12345"
#   TODO Investigate why I selected cell "A1" step doesn't work correctly
#      And I selected cell "A1"
#   TODO Investigate why I verified that cell "A1" has value "Region" step doesn't work correctly
#     Then I verified that cell "A1" has value "Region"

     When I selected object number 1 from Name Box
#    Then I verified that A2 is a part of "table12345"

      And I logged out

