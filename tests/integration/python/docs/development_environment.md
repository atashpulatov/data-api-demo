# Developer's environment

### Navigating from feature file to step definition in `Visual Studio Code`

- install `Cucumber (Gherkin) Full Support` extension
- go to `Settings` (Command/Control + ,)
- search for `Cucumberautocomplete`
- click on the `Edit` in `settings.json`
- add following lines:

```json
"cucumberautocomplete.steps": [
    "tests/integration/python/tests/steps/*.py"
],
"cucumberautocomplete.syncfeatures": "tests/integration/python/tests/*/*feature",
```

- restart `Visual Studio Code`
- open a feature file and right click a step and select `Go To Definition`
