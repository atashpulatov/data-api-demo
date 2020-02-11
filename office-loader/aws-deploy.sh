#! /bin/bash
if [ "$1" == "" ]; then
  echo "Do you want to build the add-in? (y/n)"
  read -n 1 shouldBuild
else
  shouldBuild="$1"
fi
if [ "$shouldBuild" == "y" ]; then 
    yarn build
else
    echo -e "Build skipped\n" 
fi
if [ "$2" == "" ]; then
  echo "Enter the Intelligence Server Address IP: "
  read iserver
else
  iserver="$2"
fi
scp -r build/* mstr@$iserver:/opt/apache/tomcat/apache-tomcat-9.0.30/webapps/MicroStrategyLibrary/static/loader-mstr-office