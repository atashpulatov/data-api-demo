# @windows_desktop
# @windows_chrome
# @mac_desktop
@mac_chrome
# @ci
Feature: F29365 - Import compound grid

  Scenario: [TC67226] - Import and edit compound grid
    Given I logged in as default user

      When I clicked Import Data button
        And MyLibrary Switch is OFF
        And I found and selected object "Dossier with compound grid"
        And I clicked Import button to open Import Dossier
        And I waited for dossier to load successfully
        And I selected visualization "Visualization 1"
        And I clicked import dossier
      Then I closed last notification
        # todo: add some value expetance

      When I clicked Edit object 1
        And I waited for dossier to load successfully
        And I selected "Region" in Replace With for "Call Center" attribute
        And I selected Exclude for "South" element in "Region" attribute
        And I selected "Total" in Show Totals for "Region" attribute
        And I clicked import dossier
      Then I closed last notification
        # todo: add some value expetance

      When I clicked Refresh on object 1
        And I waited for object to be refreshed successfully
      Then I closed last notification

      When I removed object 1 using icon
      Then I closed last notification
        And I log out
