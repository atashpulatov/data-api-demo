#@ci_pipeline_premerge_windows_desktop @ci_pipeline_premerge_windows_chrome @ci_pipeline_premerge_mac_chrome
#@ci_pipeline_postmerge_windows_desktop @ci_pipeline_postmerge_windows_chrome @ci_pipeline_postmerge_mac_chrome
#@ci_pipeline_daily_windows_desktop @ci_pipeline_daily_windows_chrome @ci_pipeline_daily_mac_chrome
#@ci_pipeline_rv_windows_desktop @ci_pipeline_rv_windows_chrome @ci_pipeline_rv_mac_chrome
@disabled_windows_desktop @disabled_windows_chrome @disabled_mac_chrome
@release_validation @ga_validation
Feature: TS41441 - Sanity checks

  Scenario: [TC49134] - Error Handling and clear data part 1
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "01 Basic Report"
      And I expired user session
      And I clicked Prepare Data button
      And I logged in as default user
      And I clicked Import Data button
      And I found and selected object "50k columns report - pivoted"
     Then I clicked Import button and saw error "The table you try to import exceeds the worksheet limits."

     When I selected cell "A1048576"
      And I clicked Import Data button
      And I found and selected object "Report accessing XML file"
     Then I clicked Import button and saw error "The table you try to import exceeds the worksheet limits."

     When I selected cell "XFD1"
      And I clicked Import Data button
      And I found and selected object "Report accessing XML file"
     Then I clicked Import button and saw error "The table you try to import exceeds the worksheet limits."

     When I selected cell "A1"
      And I clicked Import Data button
      And I found and selected object "110k Sales Records.csv"
     Then I clicked Import button and saw error "This object exceeds the MicroStrategy project row limit. Please contact your administrator."

     When I selected cell "A1"
      And I clicked Import Data button
      And I found and selected object "Report with All data filtered out"
     Then I clicked Import button and saw error "This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty."

     When I selected cell "A1"
      And I clicked Import Data button
      And I found and selected object "Not Published Dataset.xlsx"
      And I hover over Import button
     Then I verified that tooltip for Import button shows message "You cannot import an unpublished cube."

     When I cleared search box
      And I found and selected object "Report unpublished cube"
     Then I clicked Import button and saw global error "You cannot import an unpublished cube."

     When I selected cell "A1"
      And I clicked Import Data button
      And I found and selected object "Report with Page by, Advanced Sorting, Thresholds, Outline, Banding, Merge cells & Multiform attributes"
      And I clicked Import button
     Then I closed all notifications

     When I clicked Add Data button
      And I found and selected object "Report accessing XML file"
      And I clicked Import button without checking results
     Then I clicked Cancel button in Range Taken popup

     When I selected cell "H1"
      And I clicked Add Data button
      And I found and selected object "Report with Totals and Subtotals"
      And I clicked Import button
     Then I closed all notifications

     When I added a new worksheet
      And I selected cell "A1"
      And I clicked Add Data button
      And I found and selected object "Report with crosstab 123"
      And I clicked Import button
     Then I closed all notifications

     When I added a new worksheet
      And I selected cell "A1"
      And I clicked Add Data button
      And I found and selected object "Revenue by Region and Category - secure data"
      And I clicked Import button
      And I closed all notifications
     Then I verified that cell "C3" has value "$3,506,062"

     When I clicked clear data
      And I waited for all progress notifications to disappear
      And I logged out
      And I logged in with username "Jeff" and empty password
      And I clicked view data
      And I waited for object to be refreshed successfully
      And I closed all warning notifications
      And I selected worksheet number 1
      And I selected worksheet number 3
     Then I verified that cells ["A2", "C3"] have values ["Mid-Atlantic", "$646,421"]

      And I logged out
