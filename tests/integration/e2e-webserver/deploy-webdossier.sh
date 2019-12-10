echo "start"
cd /usr/local/tomcat/bin 
./catalina.sh start 
file=/usr/local/tomcat/webapps/web-dossier/WEB-INF/classes/config/configOverride.properties 
while [ ! -f "$file" ] 
do 
    sleep 1 
    echo "wait"
done 
sleep 10
./catalina.sh stop
sleep 5

cp -f /opt/configOverride.properties /usr/local/tomcat/webapps/web-dossier/WEB-INF/classes/config/configOverride.properties
rm -rf /usr/local/tomcat/webapps/web-dossier/apps/addin-mstr-office
rm -rf /usr/local/tomcat/webapps/web-dossier/static/loader-mstr-office
unzip /opt/office.zip -d /usr/local/tomcat/webapps/web-dossier/apps/addin-mstr-office
unzip /opt/office-loader.zip -d /usr/local/tomcat/webapps/web-dossier/static/loader-mstr-office

