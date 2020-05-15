#!/bin/bash

cd ../..

for (( c=1; c<=3; c++ ))
do  
   mvn clean -Dtest="desktop.automation.functional.maintained.mvp.**" test
done
