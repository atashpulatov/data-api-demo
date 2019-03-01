#! /bin/bash
yarn build
mkdir /opt/apache/tomcat/latest/webapps/MicroStrategyLibrary/office
cp -rf ./build/* /opt/apache/tomcat/latest/webapps/MicroStrategyLibrary/office/
