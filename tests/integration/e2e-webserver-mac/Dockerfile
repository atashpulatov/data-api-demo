FROM nexus.internal.microstrategy.com:49080/tomcat:9-jdk11-openjdk
EXPOSE 8005
EXPOSE 8443
EXPOSE 80
COPY server.xml mstr-office.jks tomcat-users.xml  /usr/local/tomcat/conf/
# COPY mstr-office.jks /usr/local/tomcat/conf/mstr-office.jks 
# COPY tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml
COPY manager.xml web-dossier.xml /usr/local/tomcat/conf/Catalina/localhost/
# COPY web-dossier.xml /usr/local/tomcat/conf/Catalina/localhost/web-dossier.xml
COPY web-dossier.war /usr/local/tomcat/webapps/web-dossier.war
COPY context.xml configOverride.properties office.zip office-loader.zip deploy-webdossier.sh /opt/
# COPY deploy-webdossier.sh /opt/deploy-webdossier.sh

RUN apt-get update && apt-get install -y netcat \
  && cd /opt \
  && bash deploy-webdossier.sh
