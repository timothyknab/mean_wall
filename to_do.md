Objective: Use the wireframe.png to make a MEAN wall that allows for users to be
created and logged in, and for front end and back end validations. Allow for messages
to be posted and comments to be posted. This will involve using database associations.
Remember to use key dependencies like express, angular, angular-route, mongoose and also
be sure to use restful routing.

Setup project folder:
    + make /client folder //DONE
    + make /server folder //DONE
    + npm init -y //DONE
    + bower init (hit enter a bunch) //DONE
    + make /client/js //DONE
    + make /client/html //DONE
    + make /client/css //DONE
    + make /client/js/controllers //DONE
    + make /client/js/factories //DONE
    + make /client/js/config //DONE
    + make /server/config //DONE
    + make /server/controllers //DONE
    + make /server/models //DONE
    + touch server/server.js //DONE

Setup Dependencies:
    + bower install angular angular-route --save //DONE
    + npm install express body-parser mongoose --save //DONE
    + you may add other dependencies later //DONE

Setup Basic Server:
    + Setup server/server.js //DONE
    + Import required dependencies //DONE
    + Setup a basic index file to be served by express static //DONE
    + Don't setup your Models quite yet (let's build this later) //DONE
    + Don't setup your Controllers quite yet (let's build this later) //DONE

Setup Front End First: (my preference):
    + Add Angular to the index file //DONE
    + Add Angular-Route to the index file //DONE
    + Load a partial with the login form (Build out the login form) //DONE
    + Setup basic Angular controllers (don't worry about the DB yet) //DONE
    + Setup basic Factories (don't worry about the DB yet) //DONE
    + See if you can get the $scope to update or create a user first without the DB //DONE

Build Out the Back End:
    + Setup your Mongoose file (DB) and models -- careful think about this! //DONE
    + Setup your server-side controllers (will need for routes) -- think about your methods! //DONE
    + For your first server-side method (linked to a server route), make a method which creates a new user. //DONE
    + Make another route which looks up a user by their username //DONE
    + Now in your angular factory, create some logic which first tries to find a user, then creates one if the user is not found. //DONE
    + Now modify your functionality so after login or creation, the user is brought to the Wall page. //DONE
    + Modify code to utilize express-session so that we can view the user we want when we load the Wall page:
        * Be sure to `npm install express-session --save` //DONE
        * Then in your server-app config, setup session and invoke it so you can reference it in your express app //DONE
        Note: (1) first, make sure that the username id is stored as a session variable //DONE
              (2) create a new controller for your Wall ('messages.html') page (be sure to update the app.js for this) //DONE
              (3) have the controller use the session id to lookup the user whom has logged in or been created, and show their name on the page "welcome, _______" //DONE

Build Out LogOut Feature:
    + Create 'Logout' button which clears out cookie and sends back to main page. //DONE

    [SOLUTION]: Used `req.session.destroy()` to remove session information and then used a
    callback function in the wall controller to redirect via `$location.url('/')` back to the index.

Development Issues Experienced and Log/Solutions:

    + See QUESTIONS.TXT

Remaining Features To Build:

    + Try the middleware more advanced approach and refactor code (no more than 2 hours) <======= #3

    + I noticed on your posts model, you have created a `comments` array, by which you are pushing records of your comments into the array...I understand
    why this seems easiest for loading the comments associated with each post, but this can become size costly when your comments start adding up. This method indeed causes 2 copies of each comment to be created. You need to fix this so only one copy of each comment is created, and when comments are needed for a post, the DB
    is queried and the array is returned and scope updated...figure out how to do this please dude! Sorry for the bummer issue! <===== #1  (SEE SERVER-WALL-CONTROLLER.JS)

        This is where the problem comes in: When you are loading the posts in your views, you
        are loading the comments array from within the posts. Instead, you somehow have to
        query the DB for comments relating to that post and return them.

    + Clean up your wall controller in general...wtf is going on there? Looks a little messy...any way to modularize any of your code?
    (MODULARIZE YOUR SERVER WALL CONTROLLER -- TOO CONFUSING! Will help you to break it down into smaller tasks...); <======== #2
