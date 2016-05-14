import os

AUTHJS_LOCAL_SERVER = os.environ.get("LOCAL_SERVER") or "a.local.com"
AUTHJS_LOCAL_PORT = os.environ.get("LOCAL_PORT") or 3000
AUTHJS_FB_APP_ID = os.environ.get("FB_APP_ID") or 460545824136907
AUTHJS_FB_APP_SCOPE = os.environ.get("FB_APP_SCOPE") or "user_about_me,email"

FB_OAUTH_URL = "https://www.facebook.com/v2.0/dialog/oauth?response_type=code&scope={}&redirect_uri=http://{}:{}/login/Facebook&client_id={}".format(AUTHJS_FB_APP_SCOPE, AUTHJS_LOCAL_SERVER, AUTHJS_LOCAL_PORT, AUTHJS_FB_APP_ID)
