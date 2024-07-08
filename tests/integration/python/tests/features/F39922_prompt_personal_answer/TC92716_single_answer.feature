@personalAnswer
Feature: F39922 - Saving and reusing personal prompt answers in Library and the new Excel plug-in

Scenario: [TC92716] - My Prompt Answers | FUN | Single Personal Answer case
    Given I initialized Excel

    When I logged in as default user

    # reset to no personal answer
    When I clicked Import Data button
    And I click on Library icon
    And I switched to Content Discovery
    And I switched to project "MicroStrategy Tutorial"
    And I clicked on folder "Shared Reports"
    And I clicked on folder "_Automation"
    And I clicked on folder "Personal Answer"
    And I found and clicked "Report" object "Year-single-answer-report" in "Content Discovery"
    And I verified that Import with dropdown button is enabled
    And I clicked Import dropdown button
    And I verified that "Import Data" item in Import dropdown is enabled
    And I selected "Import Data" item in Import dropdown
    And I clicked Import with dropdown button without checking results
    And I uncheck save answer checkbox
    And I clicked Run button
    And I closed all notifications
    Then I verified that cells ["A2"] have values ["2020"]

    # create new personal answer
    And I clicked Add Data button
    And I switched to Content Discovery
    And I found and clicked "Report" object "Year-single-answer-report" in "Content Discovery"
    And I verified that Import with dropdown button is enabled
    And I clicked Import dropdown button
    And I verified that "Import Data" item in Import dropdown is enabled
    And I selected "Import Data" item in Import dropdown
    And I clicked Import with dropdown button without checking results
    And I unselected "2020" as an answer for "1. Year" prompt - object prompt
    And I selected "2021" as an answer for "1. Year" prompt - object prompt
    And I checked save answer checkbox
    And I clicked Run button
    And I verified that New Sheet is selected
    And I clicked OK button in Range Taken popup
    And I closed all notifications
    Then I verified that cells ["A2"] have values ["2021"]

    # remove personal answer
    And I clicked Add Data button
    And I switched to Content Discovery
    And I found and clicked "Report" object "Year-single-answer-report" in "Content Discovery"
    And I verified that Import with dropdown button is enabled
    And I clicked Import dropdown button
    And I verified that "Import Data" item in Import dropdown is enabled
    And I selected "Import Data" item in Import dropdown
    And I clicked Import with dropdown button without checking results
    And I verified "2021" is a selected answer for "1. Year" prompt - object prompt
    And I uncheck save answer checkbox
    And I clicked Run button
    And I verified that New Sheet is selected
    And I clicked OK button in Range Taken popup
    And I closed all notifications

    # check if remove success
    And I clicked Add Data button
    And I switched to Content Discovery
    And I found and clicked "Report" object "Year-single-answer-report" in "Content Discovery"
    And I verified that Import with dropdown button is enabled
    And I clicked Import dropdown button
    And I verified that "Import Data" item in Import dropdown is enabled
    And I selected "Import Data" item in Import dropdown
    And I clicked Import with dropdown button without checking results
    And I clicked Run button
    And I verified that New Sheet is selected
    And I clicked OK button in Range Taken popup
    And I closed all notifications
    Then I verified that cells ["A2"] have values ["2020"]