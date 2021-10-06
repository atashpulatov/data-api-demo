<!-- 
<%@ page language="java" import="org.owasp.encoder.Encode" %>  
<%@ page language="java" import="com.microstrategy.auth.sessionmgr.SessionManager" %>
<%@ page language="java" import="com.microstrategy.auth.rest.ParamNames" %>
<%@ page import="com.microstrategy.consumerweb.servlets.ContentSecurityPolicyUtil" %>
<%
  SessionManager sessionManager = (SessionManager)session.getAttribute(ParamNames.SESSION_MANAGER);
  String authToken = Encode.forJavaScriptBlock(sessionManager.getAccessToken());
  String cspNonce = ContentSecurityPolicyUtil.getNonce(request);
%> -->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>MicroStrategy - Authenticating...</title>
</head>

<body>
  <noscript>You need to enable JavaScript to login.</noscript>
  <script nonce="<%=cspNonce%>">
    var message = {
      type: 'auth-token',
      payload: '<%=authToken%>'
    };

    var origin = location.origin || '*';

    if (parent && parent !== window) {
      parent.postMessage(message, origin);
    }

    if (opener && opener !== window) {
      opener.postMessage(message, origin);
    }

    function messageParent() {
      function callback() {
          Office.context.ui.messageParent(JSON.stringify(message));
      }

      if (Office && Office.context && Office.context.ui && Office.context.ui.messageParent) {
        Office.onReady(callback);
      } else {
        setTimeout(messageParent, 1e3);
      }
    }

    document.addEventListener('DOMContentLoaded', messageParent);

  </script>
  <script nonce="<%=cspNonce%>" src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js"></script>
</body>

</html>