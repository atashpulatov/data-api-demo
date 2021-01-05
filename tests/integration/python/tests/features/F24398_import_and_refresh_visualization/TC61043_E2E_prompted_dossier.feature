@mac_chrome
@release_validation
Feature: F24398 - Import and refresh visualization

  Scenario: [TC61043] - E2E with dossier containing all types of prompts (including nested prompts)
    Given I logged in as default user
     When I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found object by ID "B10D39BF11EB4F676D890080EFD53FDF" and selected "Dossier with all type of prompts (except nested)"
      And I clicked Import button to open Import Dossier
#      And I waited for Run button for dossier to be enabled
      And I clicked Run button for prompted dossier if prompts not already answered
      And I waited for dossier to load successfully
      And I selected visualization "Visualization 1"
      And I clicked import dossier
      And I closed last notification
     Then cells ["A2", "C2"] should have values ["Books", "2015"]

     When I selected cell "F1"
      And I clicked Add Data button
      And I found object by ID "624DB01811EA678EB8250080EF558D4C" and selected "Nested prompt dossier"
      And I clicked Import button to open Import Dossier
#      And I waited for Run button for dossier to be enabled
      And I clicked Run button for prompted dossier if prompts not already answered
      And I clicked Run button for prompted dossier if prompts not already answered
      And I waited for dossier to load successfully
      And I selected visualization "Visualization 1"
      And I clicked import dossier
      And I closed last notification
     Then cells ["F2", "H8641"] should have values ["100 Places to Go While Still Young at Heart", "2016"]

      And I logged out