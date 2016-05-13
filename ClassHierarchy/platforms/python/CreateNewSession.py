#!/usr/bin/env python
import os
from config import *
from flask import Flask, request, session, redirect, render_template, flash, abort, make_response

app = Flask(__name__)

@app.route('/', methods = ['GET'])
def index():
    if request.remote_addr != "127.0.0.1":
        abort(403)
    if "UserID" in request.form and len(request.form["UserID"]) == 0:
        session.clear()
    resp = make_response(render_template("index.html"))
    resp.set_cookie('LoginPageUrl', '/')
    return resp

@app.route('/Auth.JS/python/CreateNewSession.py', methods = ['POST'])
def create_new_session():
    if "UserID" in request.form and len(request.form["UserID"]) > 0:
        session["UserID"] = request.form["UserID"]
        session["FullName"] = request.form["FullName"]
        session["email"] = request.form["email"]
    return ("OK")

@app.route('/login', methods = ['GET'])
def login():
    return redirect(FB_OAUTH_URL)

@app.route('/logout', methods = ['GET'])
def logout():
    session.clear()
    return redirect("/")

# TODO: Fix this in config.js
@app.route('/Auth.JS/aspx/AllInOne.aspx', methods = ['GET'])
def AllInOne():
    return redirect("/")

if __name__ == '__main__':
    app.debug = True
    app.secret_key = os.urandom(24)
    app.run(host='0.0.0.0', port=80)
