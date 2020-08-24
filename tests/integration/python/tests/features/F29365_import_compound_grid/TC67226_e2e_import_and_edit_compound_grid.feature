# @windows_desktop
@windows_chrome
# @mac_desktop
@mac_chrome
# @ci
Feature: F29365 - Import compound grid

  Scenario: [TC67226] - Import and edit compound grid
    Given I logged in as default user
     When I clicked Import Data button
      And MyLibrary Switch is OFF
      And I found and selected object "Dossier with compound grid"
      # todo: use different dossier
      # And I found and selected object "Dossier with Compound Grid - Exclude/Keep Only"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Visualization 1"
      And I clicked import dossier
     Then I closed last notification
      # todo: change for different dossier
      And cells ["A2", "A9", "A16"] should have values ["Atlanta", "New Orleans", "Web"]

     When I clicked Edit object 1
      And I waited for dossier to load successfully
      And I selected "Region" in Replace With for "Call Center" attribute
      And I selected Exclude for "South" element in "Region" attribute
      And I selected "Total" in Show Totals for "Region" attribute
      # todo: use different dossier
      # And I selected "Subcategory" in Replace With for "Month of Year" attribute
      # And I selected Exclude for "Art & Architecture" element in "Subcategory" attribute
      # And I selected "Total" in Show Totals for "Subcategory" attribute
      And I clicked import dossier
     Then I closed last notification
      # todo: change for different dossier
      And cells ["A2", "A7", "A9"] should have values ["Total", "Southeast", "Web"]

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
     Then I closed last notification

     When I removed object 1 using icon
     Then I closed last notification
      And I log out
