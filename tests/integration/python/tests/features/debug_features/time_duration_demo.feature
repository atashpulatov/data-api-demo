Feature: Time duration demo

Scenario: Time duration demo
  Given I saved execution start time to "timer_1_label"
    And I wait 5
    And I saved execution end time to "timer_1_label"

    And I saved execution start time to "timer_2_label"
    And I wait 10
    And I saved execution end time to "timer_2_label"

    And I verified that execution time "timer_2_label" is similar to "timer_1_label" with "7.3" seconds threshold
    And I verified that execution time "timer_1_label" is not bigger than "timer_2_label"

