#! /bin/bash
echo "Do you want to build the add-in? (y/n)"
read -n 1 shouldBuild
if [ $shouldBuild == "y" ]; then 
    yarn build
else
    echo -e "Build skipped\n" 
fi
echo "Enter the Intelligence Server Address IP: "
read iserver
scp -r build/* mstr@$iserver:/opt/apache/tomcat/apache-tomcat-9.0.12/webapps/MicroStrategyLibrary/static/loader-mstr-office