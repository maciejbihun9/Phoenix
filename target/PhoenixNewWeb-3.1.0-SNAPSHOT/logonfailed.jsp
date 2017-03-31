<html>
<head>
  <title>Phoenix Log On</title>
  <link href="<%= request.getContextPath() %>/tdm.css" rel=stylesheet type=text/css>
  <style>
  h2 {
    font-size: 20px;
    color: white;
    padding-left: 5px
  }
  </style>
</head>

<body>
  <table border='0' cellpadding='0' cellspacing='0' width='100%' height='100%'>
    <tr>
      <td valign='top' align='center'>
        <table border='0' class='loginTable'>
          <tr>
            <td class='top' align='left'><h2>Phoenix</h2></td>
            <td class='top' align='right'><img src="<%= request.getContextPath() %>/volvo.gif" width='129' height='43' border='0'></td>
          </tr>
          <tr>
            <td colspan='2' class='header'></td>
          </tr>
          <tr>
            <td class='loginArea' colspan='2'>
              <table>
                <tr>
                  <td colspan='2'>
                    <span class='formLable'>User name or password incorrect. Login failed, <a href="<%= request.getContextPath() %>/logon.jsp">try again.</a></span><br>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>