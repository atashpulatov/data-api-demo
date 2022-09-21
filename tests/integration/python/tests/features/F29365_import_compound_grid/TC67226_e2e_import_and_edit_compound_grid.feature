#@ci_pipeline_daily_windows_desktop @ci_pipeline_daily_windows_chrome @ci_pipeline_daily_mac_chrome
#@ci_pipeline_rv_windows_desktop
@ci_pipeline_rv_windows_chrome @ci_pipeline_rv_mac_chrome
@disabled_windows_desktop @windows_chrome @mac_chrome
Feature: F29365 - Import compound grid

  Scenario: [TC67226] - Import and edit compound grid
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "DB43CB0C11E9FEF1DC670080EF652715" and selected "Dossier with compound grid"
     Then I verified that Prepare Data button is disabled

      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Visualization 1"
      And I clicked import dossier
      And I closed last notification

     Then I verified that cells ["A2", "B9", "C2"] have values ["Atlanta", "1.051", "$1,052,108"]

     When I clicked Edit object 1
      And I waited for dossier to load successfully
      And I selected "Region" in Replace With for "Call Center" attribute for visualization "Visualization 1"
      And I selected Exclude for "Mid-Atlantic" element in "Region" attribute for visualization "Visualization 1"
      And I selected "Total" in Show Totals for "Region" attribute for visualization "Visualization 1"
      And I clicked import dossier
      And I closed last notification

     Then I verified that cells ["A2", "B9", "C2"] have values ["Total", "7.981", "$30,571,093"]

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification

     Then I verified that cells ["A2", "B9", "C2"] have values ["Total", "7.981", "$30,571,093"]

     When I removed object 1 using icon
      And I closed last notification
     Then I verified that cells ["A2", "B9", "C2"] have values ["", "", ""]

      And I logged out
