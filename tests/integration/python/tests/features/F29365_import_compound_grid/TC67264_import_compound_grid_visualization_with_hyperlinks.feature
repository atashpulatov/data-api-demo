@mac_chrome
@windows_chrome
Feature: F29365 - Import compound grid from dossier to Excel

  Scenario: [TC67264] - Import compound grid visualization with Hyperlinks
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

     When I found and selected object "Objects in compound grids - Hyperlinks"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Hyperlinks in rows"
      And I clicked import dossier
      And I closed all notifications
     
     Then cells ["C2", "C9", "C16"] should have values ["CICE, S.A.", "Viesgo", "Grupo Printeos"]

      And I log out
