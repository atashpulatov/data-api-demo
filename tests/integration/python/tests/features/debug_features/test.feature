@mac_chrome
Feature: Empty feature

  Scenario: Empty scenario
    Given I logged in as default user

    And I closed Excel
    And I opened Excel and logged in to Excel as "de-de"
    And I logged in as default user
    
    And I closed Excel
    And I opened Excel and logged in to Excel as "es-es"
    And I logged in as default user
