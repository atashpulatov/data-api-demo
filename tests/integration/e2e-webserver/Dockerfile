FROM tomcat:8-jdk8-openjdk
EXPOSE 8005
EXPOSE 8443
COPY server.xml /usr/local/tomcat/conf/server.xml
COPY mstr-office.jks /usr/local/tomcat/conf/mstr-office.jks 
COPY tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml
COPY manager.xml /usr/local/tomcat/conf/Catalina/localhost/manager.xml
COPY web-dossier.xml /usr/local/tomcat/conf/Catalina/localhost/web-dossier.xml
COPY web-dossier.war /usr/local/tomcat/webapps/web-dossier.war
COPY configOverride.properties /opt/configOverride.properties
COPY deploy-webdossier.sh /opt/deploy-webdossier.sh

RUN cd /opt \
  && sh deploy-webdossier.sh
