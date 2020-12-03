@windows_desktop
@mac_chrome
@release_validation
Feature: F30479 - Hardening of importing data from Dossier to Excel

  Scenario: [TC65052] - E2E Hardening of importing data from Dossier to Excel
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found object by ID "9F0DB07111EA9605CE6A0080EFC5A96D" and selected "Dossier with filter"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Visualization 1"

      # Additional import Dossier before a proper test is necessary as a workaround for Windows Desktop, where first
      # element check might be significantly longer than subsequent checks, which causes second import to be shorter
      # even if data loads quicker.
      And I clicked import dossier
      And I closed last notification
     Then cells ["A2", "A56161"] should have values ["2014", "2017"]


     When I clicked Edit object 1
      And I selected visualization "Visualization 1"
      And I saved execution start time to "visualisation_not_filtered_import_timer"
      And I clicked import dossier
      And I saved execution duration to "visualisation_not_filtered_import_timer"
      And I closed last notification
      And cells ["A2", "A56161"] should have values ["2014", "2017"]

      And I clicked Edit object 1
      And I selected visualization "Visualization 1"
      And I selected year "2014" in Year filter
      And I saved execution start time to "visualisation_only_2014_import_timer"
      And I clicked import dossier
      And I saved execution duration to "visualisation_only_2014_import_timer"
      And I closed last notification

     Then I verified that execution duration "visualisation_only_2014_import_timer" is not longer than "visualisation_not_filtered_import_timer"
      And cells ["A2", "A56161"] should have values ["2014", ""]

     When I selected cell "F1"
      And I clicked Add Data button
      And I found object by ID "077A3D5711EA84893F510080EF95313B" and selected "dossier with attribute/metric selector"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      # TODO And I select "Call Center" for attribute/metric selector
      And I selected visualization "Visualization 1"
      And I clicked import dossier
      And I closed last notification
     Then cells ["F2", "J2"] should have values ["Jan 2015", "18.70%"]

      And I logged out
