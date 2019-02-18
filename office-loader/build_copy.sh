#! /bin/bash
yarn build
mkdir /opt/apache/tomcat/latest/webapps/ROOT/office-loader
cp -rf ./build/* /opt/apache/tomcat/latest/webapps/ROOT/office-loader/
