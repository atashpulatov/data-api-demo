@windows_desktop
@windows_chrome
@mac_desktop
@mac_chrome
@ci
Feature: F29365 - Import compound grid

  Scenario: [TC67226] - Import and edit compound grid
    Given I logged in as default user
    # Given I pass
      When I clicked Import Data button
      And MyLibrary Switch is OFF
      And I found and selected object "Dossier with compound grid"
      And I clicked Import button to open Import Dossier
      And I selected visualization "Visualization 1"
      And I clicked import dossier
      Then I closed last notification

      # step 10
      # When I clicked Edit object 1
      # step 12
      # And I selected "Region" in Replace With for "Call Center" attribute
      # step 11
      # And I selected Exclude for "Web" element in "Region" attribute
      # steps 13-15
      # And I selected "Total" in Show Totals for "Region" attribute
      # step 16
      # And I clicked import dossier
      # Then I closed last notification

      # When I clicked Refresh on object 1
      # And I waited for object to be refreshed successfully
      # Then I closed last notification

      # When I removed object 1 using icon
      # Then I closed last notification

      # And I log out
