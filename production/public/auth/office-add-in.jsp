<!-- <%@ page language="Java" import="com.microstrategy.auth.sessionmgr.SessionManager" %>
<%@ page language="Java" import="com.microstrategy.auth.rest.ParamNames" %>
<%
  SessionManager sessionManager = (SessionManager)session.getAttribute(ParamNames.SESSION_MANAGER);
  String authToken = sessionManager.getAccessToken();
%> -->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>MicroStrategy - Authenticating...</title>
</head>

<body>
  <noscript>You need to enable JavaScript to login.</noscript>
  <script>
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

    document.addEventListener("DOMContentLoaded", messageParent);

  </script>
  <script src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js"></script>
</body>

</html>