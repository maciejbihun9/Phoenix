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
<body onLoad='document.log_on_form.j_username.focus()'>
  <form action="j_security_check" method="post" name="log_on_form">
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
                <table border='0'>
                  <tr>
                    <td colspan='2'>
                      <span class='formLable'>User ID:</span><br>
                      <INPUT NAME='j_username' TYPE=text size='30' style='width: 100%' VALUE=""><br>
                      <span class='formLable'>Password:</span><br>
                      <INPUT NAME='j_password' TYPE='password' size='30' style='width: 100%'><br><br>
                      <p style = "text-align: center;">
                        <INPUT TYPE=submit class=button VALUE="Log On">
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td colspan='2' class='footer'></td>
            </tr>
	      </table>
	    </td>
      </tr>
    </table>
  </form>
</body>
</html>