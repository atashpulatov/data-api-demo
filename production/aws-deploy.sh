#! /bin/bash
read -n 1 -p "Do you want to build the add-in? (y/n)" shouldBuild
if [ $shouldBuild == "y" ]; then 
    yarn build
else
    echo -e "Build skipped\n" 
fi
read -p "Enter the Intelligence Server Address IP: " iserver
scp -r build/* mstr@$iserver:/opt/apache/tomcat/apache-tomcat-9.0.12/webapps/MicroStrategyLibrary/apps/addin-mstr-office