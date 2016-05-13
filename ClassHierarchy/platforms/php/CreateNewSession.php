<?php
// composer autoloader for required packages and dependencies
require_once('vendor/autoload.php');
$f3 = \Base::instance();

session_start();

$AUTHJS_LOCAL_SERVER = "a.local.com";
$AUTHJS_LOCAL_PORT = 3000;
$AUTHJS_FB_APP_ID = 460545824136907;
$AUTHJS_FB_APP_SCOPE = "user_about_me,email";

$format = "https://www.facebook.com/v2.0/dialog/oauth?response_type=code&scope=%s&redirect_uri=http://%s:%d/login/Facebook&client_id=%d";
$FB_OAUTH_URL = sprintf($format, $AUTHJS_FB_APP_SCOPE, $AUTHJS_LOCAL_SERVER, $AUTHJS_LOCAL_PORT, $AUTHJS_FB_APP_ID);


$f3->set('FB_OAUTH_URL', $FB_OAUTH_URL);


$f3->route('GET /', function($f3){
    if ($_SERVER['REMOTE_ADDR'] != "127.0.0.1" and $_SERVER['REMOTE_ADDR'] != "::1"){
        // TODO: return 403 error
        echo "local access only";
        return;
    }
    $f3->mset(
        array(
            'UserID' => $_SESSION['UserID'],
            'FullName' => $_SESSION['FullName'],
            'email' => $_SESSION['email']
        ));
    setcookie("LoginPageUrl", "/");
    echo View::instance()->render('views/index.php');
});


$f3->route('POST /Auth.JS/php/CreateNewSession.php', function(){
    $UserID = $_POST['UserID'];
    if (strlen($UserID) > 0){
        session_destroy();
        $_SESSION['UserID'] = $UserID;
        $_SESSION['FullName'] = $FullName;
        $_SESSION['email'] = $email;
    }
});


$f3->route('GET /login',
           function($f3) {
               $f3->reroute($f3->get("FB_OAUTH_URL"));
           }
);

$f3->route('GET /logout',
           function($f3) {
               session_destroy();
               $f3->reroute("/");
           }
);

$f3->run();