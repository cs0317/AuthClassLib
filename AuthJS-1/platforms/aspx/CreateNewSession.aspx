<%@ Page Language="C#" %>
 
<script runat="server">
protected void Page_Load(object sender, EventArgs e)  {

 if (Request.ServerVariables["REMOTE_ADDR"]!="127.0.0.1") {
    Response.StatusCode = 403;
    Response.ContentType = "text/plain";
 } else {
   if (String.IsNullOrEmpty(Request.Form["UserID"])) {
      Session.Abandon();

      Response.Cookies.Add(new HttpCookie("ASP.NET_SessionId", ""));

   } else {
    Session["UserID"]=Request.Form["UserID"];
    Session["Fullname"]=Request.Form["Fullname"];
    Session["email"]=Request.Form["email"];
    Session["ReturnPort"]=Request.Form["ReturnPort"]; //This is only for debugging in visual studio
   }    
 }
}
</script>

