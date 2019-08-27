#! /bin/bash
npm run build
mkdir /opt/apache/tomcat/latest/webapps/MicroStrategyLibrary/office
cp -rf ./build/* /opt/apache/tomcat/latest/webapps/MicroStrategyLibrary/office/
