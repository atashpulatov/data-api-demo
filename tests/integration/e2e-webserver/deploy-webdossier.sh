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
