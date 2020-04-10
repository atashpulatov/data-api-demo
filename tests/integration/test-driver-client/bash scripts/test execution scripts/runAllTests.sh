#!/bin/bash

cd ../..
mvn clean -Dtest="desktop.automation.functional.maintained.**" test
