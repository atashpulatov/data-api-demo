echo "start"
cd /usr/local/tomcat/bin 
./catalina.sh start 
while :
do 
  status_code=$(curl --write-out %{http_code} --insecure --silent --output /dev/null 'https://127.0.0.1:8443/web-dossier/auth/ui/loginPage')
  expected_code=200
  if [[ $status_code == $expected_code ]]; then
    break
  fi
  sleep 1
done 
echo "web-dossier deploy succsess"
sleep 2
./catalina.sh stop
while :
do
  exit_code=0
  nc -z -v -w5 localhost 8443
  if [[ $? == $exit_code ]]; then
    echo "wait tomcat stop"
    sleep 1
  else
    break
  fi
done
echo "tomcat stop successfully, start to replace files"
sleep 2
cp -f /opt/configOverride.properties /usr/local/tomcat/webapps/web-dossier/WEB-INF/classes/config/configOverride.properties
cp -f /opt/context.xml /usr/local/tomcat/webapps/web-dossier/META-INF/context.xml

# sed -i 's+<param-value>UNSET</param-value>+<param-value>NONE</param-value>+g' /usr/local/tomcat/webapps/web-dossier/WEB-INF/web.xml
rm -rf /usr/local/tomcat/webapps/web-dossier/apps/addin-mstr-office
rm -rf /usr/local/tomcat/webapps/web-dossier/static/loader-mstr-office
unzip /opt/office.zip -d /usr/local/tomcat/webapps/web-dossier/apps/addin-mstr-office
unzip /opt/office-loader.zip -d /usr/local/tomcat/webapps/web-dossier/static/loader-mstr-office

