#@ci_pipeline_postmerge_windows_chrome
Feature: F39445 - Display object related information on the Excel sheet when importing data with the Excel Add-in

  Scenario: [TC94296] - Toggles behavior checks and re-ordering worksheet details
    Given I initialized Excel
     When I logged in as default user

      And I open Settings in Dots Menu
      And I clicked "Object Information" section on Settings menu

    # Toggle "Side panel details" OFF and check if all child toggles are OFF
      And I toggle the "Side panel details" parent setting
     Then I verified "Side panel details" parent setting is OFF
      And I verified "Imported By" child setting is OFF
      And I verified "Owner" child setting is OFF
      And I verified "Date Modified" child setting is OFF
      And I verified "Date Created" child setting is OFF
      And I verified "Description" child setting is OFF
      And I verified "Location" child setting is OFF
      And I verified "Version" child setting is OFF
      And I verified "ID" child setting is OFF

    # Toggle "Imported By" ON and check if parent setting is ON
     When I toggle the "Imported By" child setting
     Then I verified "Side panel details" parent setting is ON

    # Toggle all "Side panel details" child settings ON
      And I toggle the "Owner" child setting
      And I toggle the "Date Modified" child setting
      And I toggle the "Date Created" child setting
      And I toggle the "Description" child setting
      And I toggle the "Location" child setting
      And I toggle the "Version" child setting
      And I toggle the "ID" child setting

    # Toggle all "Side panel details" child settings OFF and check if parent setting is OFF
     When I toggle the "Imported By" child setting
      And I toggle the "Owner" child setting
      And I toggle the "Date Modified" child setting
      And I toggle the "Date Created" child setting
      And I toggle the "Description" child setting
      And I toggle the "Location" child setting
      And I toggle the "Version" child setting
      And I toggle the "ID" child setting
     Then I verified "Side panel details" parent setting is OFF

    # Toggle "Worksheet details" ON and check if all child toggles are ON
     When I toggle the "Worksheet details" parent setting
     Then I verified "Worksheet details" parent setting is ON
      And I verified draggable "Name" child setting is ON
      And I verified draggable "Owner" child setting is ON
      And I verified draggable "Description" child setting is ON
      And I verified draggable "Filter" child setting is ON
      And I verified draggable "Imported By" child setting is ON
      And I verified draggable "Date Modified" child setting is ON
      And I verified draggable "Date Created" child setting is ON
      And I verified draggable "ID" child setting is ON
      And I verified draggable "Page-By Information" child setting is ON

      And I logged out