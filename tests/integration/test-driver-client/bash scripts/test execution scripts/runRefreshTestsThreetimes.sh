#!/bin/bash

cd ../..
for (( c=1; c<=3; c++ ))
do
    mvn clean -Dtest=RefreshTests test 
done
