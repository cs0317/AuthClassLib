<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <title>Auth.JS Python Platform</title>
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

        <!-- TODO: make this css file local or put it in a CDN -->
        <link rel="stylesheet" href="http://getbootstrap.com/examples/navbar-fixed-top/navbar-fixed-top.css">

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">


        <!-- Latest compiled and minified JavaScript -->
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>

    </head>
    <body>

        <!-- Fixed navbar -->
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="#">Auth.JS Python Platform</a>
                </div>
                <div id="navbar" class="navbar-collapse collapse">
                    <ul class="nav navbar-nav">
                        <li class="active"><a href="#">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li>

            <?php if ($UserID == ""): ?>

             <a href="/login">
             <i class="fa fa-facebook-official" aria-hidden="true"></i>
             log in</a>
            <?php else: ?>
             <a href="/logout">
             Hello <?= $UserID ?> , log out</a>
            <?php endif; ?>

                        </li>
                    </ul>
                </div><!--/.nav-collapse -->
            </div>
        </nav>

        <div class="container">

            <!-- Main component for a primary marketing message or call to action -->
            <div class="jumbotron">

            <?php if ($UserID == ""): ?>
             <h2>Please <a href="/login">log in</a> first! </h2>
            <?php else: ?>
             <h2> Hello               <?= $UserID ?> </h2>
             <div class="panel panel-default">
             <!-- Default panel contents -->
             <div class="panel-heading">User information</div>
             <!-- List group -->
             <ul class="list-group">
             <li class="list-group-item">session.UserID: <?= $UserID ?> </li>
             <li class="list-group-item">session.FullName: <?= $FullName ?></li>
             <li class="list-group-item">session.email: <?= $email ?></li>                                                                                                                                                                                   </ul>
                                                                                                                                                                                   </div>
                                                                                                                                                                                   <p>To use Auth.JS with your python web app, paste these code into your web template</p>
                                                                                                                                                                                   <script src="https://gist.github.com/pmcao/868fc03c70ea2f27021bcda02c10a3da.js"></script>
            <?php endif; ?>

            </div>

        </div> <!-- /container -->

    </body>
</html>