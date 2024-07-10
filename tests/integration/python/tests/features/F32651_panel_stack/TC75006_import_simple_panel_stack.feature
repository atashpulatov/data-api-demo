Feature: F32651 - Enable authors to create information-rich dossiers with Panel Stacks

  Scenario: [TC75006] - [ACC] Importing visualisation from simple Panel Stack
   Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      
      And I found and selected object "Dossier with Panel stacks and different navigation styles"
      And I clicked Import button to open Import Dossier
      And I selected dossier page or chapter 2
      And I selected panel stack "Panel 1"
      And I selected Visualization "Grid visualization on a panel stack"
      And I clicked import dossier
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B2", "C2492", "E2492"] have values ["NNE", "17268959.00", "33755965.00"]
      And I logged out
