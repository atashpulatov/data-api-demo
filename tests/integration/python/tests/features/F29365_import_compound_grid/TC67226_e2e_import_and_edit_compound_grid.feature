Feature: F29365 - Import compound grid

  Scenario: [TC67226] - Import and edit compound grid
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      
      And I found and selected object "Dossier with compound grid"
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
