#@ci_pipeline_postmerge_windows_chrome
Feature: F34504 - Removal of sharing bookmark button from embedded library experience that is part of the federated analytics Office 365 Excel client

  Scenario: [TC73785] - E2E - Checking if sharing bookmarks icon is hidden
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "Visualization manipulation"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I added dossier to Library if not yet added
      And I created dossier bookmark "Test bookmark" if not exists
      And I selected dossier bookmark 1

     Then I verified Share bookmark icon is NOT visible
      And I closed popup window
      And I logged out
