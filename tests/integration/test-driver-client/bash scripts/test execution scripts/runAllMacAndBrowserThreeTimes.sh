#!/bin/bash

cd ../..

for (( c=1; c<=3; c++ ))
do  
   mvn clean -Dtest="desktop.automation.functional.all.mac.and.browser.**" test 
done
