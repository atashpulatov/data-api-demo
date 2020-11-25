# python_test
(python_test - name to be changed ;) )

**python_test** is a test automation framework and implementation of automated tests for **MicroStrategy
Excel add-in**.

It supports [behavior-driven development (BDD)](https://en.wikipedia.org/wiki/Behavior-driven_development) and tests 
execution on different platforms. Thanks to modular architecture and use of Page Object Model pattern, tests
definitions are common for all platforms and it's easy to write and maintain tests and add support for new platforms. 

Tests are written in [Gherkin](https://cucumber.io/docs/gherkin/reference/), a natural-like language developed
as part of [Cucumber](https://cucumber.io/) framework and executed using
[behave](https://behave.readthedocs.io/en/latest/) Python framework. Example:

```gherkin
Feature: FMMMM - Import object

  Scenario: [TCNNNNN] - Simple import object
    Given I logged in as default user
      And I clicked Import Data button
      And I found and selected object "report to be imported"
      
     When I clicked Import button
     
     Then number of worksheets should be 1
      And cell "A42" should have value "42"
```

Currently tests can be executed on: Windows Desktop, Windows Chrome, Mac Desktop, Mac Chrome.

### Table of Contents:

- [Installation](docs/installation.md)
- [Running tests](docs/running_tests.md)
- [Running tests using existing application session](docs/running_tests_using_existing_session.md)
- [Adding a new test](docs/development_adding_new_test.md)
- [Adding a new Page](docs/development_adding_new_page.md)
- [Adding support for a new platform](docs/development_adding_new_platform.md)
- [Developer's notes](docs/development_notes.md)
- [Developer's environment](docs/development_environment.md)
