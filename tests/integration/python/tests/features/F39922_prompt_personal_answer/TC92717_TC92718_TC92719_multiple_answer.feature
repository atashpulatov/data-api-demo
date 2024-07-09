@personalAnswer
Feature: F39922 - Saving and reusing personal prompt answers in Library and the new Excel plug-in

Scenario: [TC92717_TC92717_TC92717] - My Prompt Answers | FUN | Single Personal Answer case
    Given I initialized Excel

    When I logged in as default user

    # Create personal answer
    When I clicked Import Data button
    And I click on Library icon
    And I switched to Content Discovery
    And I verified that Import button is disabled
    And I verified that Prepare Data button is disabled
    And I switched to project "MicroStrategy Tutorial"
    And I clicked on folder "Shared Reports"
    And I clicked on folder "_Automation"
    And I clicked on folder "Personal Answer"
    And I found and clicked "Report" object "Year-multi-answer-report" in "Content Discovery"
    And I verified that Import with options button is enabled
    And I clicked options button
    And I verified that "Import Data" option is enabled in options dropdown
    And I selected "Import Data" option in options dropdown
    And I clicked Import with options button without checking results
    And I clear the current personal answer
    And I create a new personal personal named "2020"
    And Ignore error I unselected "2021" as an answer for "1. Year" prompt - object prompt
    And Ignore error I unselected "2022" as an answer for "1. Year" prompt - object prompt
    And Ignore error I unselected "2023" as an answer for "1. Year" prompt - object prompt
    And I clicked Run button
    And I closed all notifications
    Then I verified that cells ["A2"] have values ["2020"]

    # Create personal answer as default
    And I clicked Add Data button
    And I switched to Content Discovery
    And I found and clicked "Report" object "Year-multi-answer-report" in "Content Discovery"
    And I verified that Import with options button is enabled
    And I clicked options button
    And I verified that "Import Data" option is enabled in options dropdown
    And I selected "Import Data" option in options dropdown
    And I clicked Import with options button without checking results
    And I unselected "2020" as an answer for "1. Year" prompt - object prompt
    And I unselected "2022" as an answer for "1. Year" prompt - object prompt
    And I unselected "2023" as an answer for "1. Year" prompt - object prompt
    And I create a new default personal personal named "2021"
    And I clicked Run button
    And I verified that New Sheet is selected
    And I clicked OK button in Range Taken popup
    And I closed all notifications
    Then I verified that cells ["A2"] have values ["2021"]

    # load, reanme, set default
    And I clicked Add Data button
    And I switched to Content Discovery
    And I found and clicked "Report" object "Year-multi-answer-report" in "Content Discovery"
    And I verified that Import with options button is enabled
    And I clicked options button
    And I verified that "Import Data" option is enabled in options dropdown
    And I selected "Import Data" option in options dropdown
    And I clicked Import with options button without checking results
    And I verified "2021" is a selected answer for "1. Year" prompt - object prompt
    And I load "2020" as the current answer
    And I verified "2020" is a selected answer for "1. Year" prompt - object prompt
    And I rename personal answer "2021" to "2021-1"
    And I load "2021-1" as the current answer
    And I verified "2021" is a selected answer for "1. Year" prompt - object prompt
    And I set "2020" personal answer as the default answer
    And I clicked Run button
    And I verified that New Sheet is selected
    And I clicked OK button in Range Taken popup
    And I closed all notifications
    Then I verified that cells ["A2"] have values ["2021"]

    # delete
    And I clicked Add Data button
    And I switched to Content Discovery
    And I found and clicked "Report" object "Year-multi-answer-report" in "Content Discovery"
    And I verified that Import with options button is enabled
    And I clicked options button
    And I verified that "Import Data" option is enabled in options dropdown
    And I selected "Import Data" option in options dropdown
    And I clicked Import with options button without checking results
    And I verified "2020" is a selected answer for "1. Year" prompt - object prompt
    And I delete personal answer "2021-1"
    And I clicked Run button
    And I verified that New Sheet is selected
    And I clicked OK button in Range Taken popup
    And I closed all notifications
    Then I verified that cells ["A2"] have values ["2020"]

    # delete and back to original state
    And I clicked Add Data button
    And I switched to Content Discovery
    And I found and clicked "Report" object "Year-multi-answer-report" in "Content Discovery"
    And I verified that Import with options button is enabled
    And I clicked options button
    And I verified that "Import Data" option is enabled in options dropdown
    And I selected "Import Data" option in options dropdown
    And I clicked Import with options button without checking results
    And I delete personal answer "2020"
    And I clicked Run button
    And I verified that New Sheet is selected
    And I clicked OK button in Range Taken popup
    And I closed all notifications

