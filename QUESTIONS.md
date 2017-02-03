QUESTION 1A [RESOLVED]:

    There is an issue with the cookies, where right now you establish session information in a way that after the first login, the cookie is not validated. however, when the user hits back and refreshes and then logs in, things work fine.

    [SOLUTION]: I moved the `$location.url('/messages')` outside of the primary $scope function in the
    angular users controller, and instead into the callback function within the same users controller file.
    This only loads the /messages page AFTER the database has finished doing whatever it is that it needs
    to do (ie, looking up an existing user or creating a new user and returning that information). Because
    the /messages page uses a function which takes in the session ID [cookie] (created only after the DB has finished its query) and uses this session ID to look up the user to load on the messages page. What was
    happening was the page was loading before the database finished, thus the cookie ID did not exist, thus
    the user trying to be retrieved (a separate AJAX request to DB) was running BEFORE the other one finished! Now that I've moved the $location service into the callback, the second DB / AJAX only runs
    after the first has completed, thus the cookie ID is established and the second query has the proper
    valid parameters (that exist) to query the user to load. (phew what a mouthful)

QUESTION 1:

    + How do I display the json err objects on the front end? or the various errors from mongoose validations (ie, minlength, maxlength, etc)?

      See: 'server/controllers/server-user-controller' (.catch function of create method)

QUESTION 2:

    + When a user enters a username, the first thing I do is have a method run ('login()' in my server user controller) which looks up the user (using findOne in mongoose).
    If the user data is null, I had a more simpler solution which merely redirected to my '/register' post route (this redirect occurs in my server-side users controller).
    This more simpler solution (in my mind) does not work however, as when I try and use 'res.redirect('/register')', I receive an error that only GET requests are allowed (my '/register' is a post route).

    I was able to use $http promises in my angular factory to get around this, and still get the desired functionality (a new user is created if not found). However this involved some more code,
    and it would be nice to do it cleaner.

    See: 'server/controllers/server-user-controller' (the login() method is where the redirect and questions are commented out)


QUESTION 3 [RESOLVED FOR NOW--SEE #SLACK]:

    + Any idea why I was experiencing the unique:true validation errors when working with case insensitivity?

    (1) 'case insensitive' was a username requirement in the mockup.
        To remedy this, I used 'lowercase: true' key value when setting up the user model.
        In addition to 'lowercase', I also used 'unique: true' key values to force unique usernames.
        This forces all usernames, regardless of their case, to be stored as lowercase.
        This however was still causing a duplicate bug if I entered a username with cHanGingCaSe
        For some reason, the username in the mixed case, was flagging the 'unique: true' validation.
        To remedy this, I used the .toLowerCase() method in javascript to convert the $scope.user.username
        to lowercase BEFORE sending this data to the DB (which stores it as lowercase anyhow). I don't know
        why the unique error was firing earlier, but this seemed to remedy it entirely.

        [NOTE]: This could be firing off an error because the changingcase was being stored lowercase, and if a username already existed it would duplicate.
        Are you sure its not that the username was already valid?

        //// SEE JASON'S PM IN #SLACK ABOUT HOW TO APPROACH CASE insensitivity ////

        [MY SOLUTION:]

        In the above rambling, more or less, I was trying to outline that when I first setup my mongoDB, I made my mongoose Schema to
        force uniqueness and to drop any duplicates. However, when trying to enter a username with a changing case, Mongo treated this
        as a unique case, and did not flag the unique validation, creating both new entries for say, 'timknab' and 'TimKnab' (when both
        should be the same username and flagged). To remedy this initially, I simply forced usernames to be converted to LowerCase() using
        a native javascript method on the front end, and forcing it to lowercase in the schema (`lowercase: true`). Although this solved the problems,
        as now 'timknab' and 'TimKnab' would be forced to lowercase and be one-in-the-same, this did not allow for the intended functionality of the mockup.
        That is to say, the mockup wanted 'TimKnab' to be a valid username, and not be forced to lowercase, but also now allow for duplicates like  'timknab'.

        How I resolved this issue: [ADVANCED SOLUTION]:

            The way I remedied this, was to, in my register method on the `server-user-controller`, run some custom validation methods prior to actually creating the user.
            These validation methods do a few things: First, they do a regex test to see if the username is in alphanumerical format and only allowing underscore (`_`) characters.
            At the same time this is tested, the username is also tested for min and max lengths. If either the min or max length or the basic regex test fails, an error is sent back
            and the user creation never runs.

            If the username passes these first three tests, then the existing users are queried in the database to see if anyone matching the username in any case is found. This is done using
            a special regex friendly query type for mongoose. If any matches occur, no matter the case, then an error is sent back saying that the user already exists and the user is never created.

            If finally, all of the three first tests are passed, and the user is queried in the regex style but no matches are found, then and only then is the user actually created.

            Because this process was so long and dense, I decided to modularize into a folder on the server-side called `/modules` which holds all of the data and is responsible for the grunt work.

            There may be ways to incorporate some of the methods in that module into the actual schema, either as pre.save() functions or as instance methods. I did experiment with these approaches, however, I was trying to avoid creating an instance of my object until all tests were passed. IE, I could not access any instance methods of that object unless the
            object was already created. I suppose I could have used the pre.save methods to accomplish this and may try to revise my code to improve it and re-factor areas needed.

QUESTION 4 [RESOLVED]:

    + See: client/js/factories/angular-wall-factory
    Why can't I send data to my '/new' route as I was doing for other routes without problem?

    SOLUTION: The reason that this route wasn't working is that the model you had defined in your view ('messages.html')
    was in the format of `ng-model="postMessage"` -- this was creating an invalid object when being passed by bodyParser.json().
    Changing the aforementioned snippet to `ng-model='postMessage.message'` now instead passes an object as follows: `{message:<message-body>}`.
    Now, when the $http.post service is invoked, and the `/new` server route runs, an actual object is passed, and in the server
    side controller, we can then reference `req.body` and see the `{message:<message-body>}` contents.

    In summary, if it appears that your route is setup properly, that you're $http service verb is properly setup, and things are still not
    working, then be sure to check your ng-model in your views and make sure you've configured that properly. If the model isn't setup properly,
    the data won't pass to the back end properly (in this case, I had to add a property to the object in order for it to actually fire all the way to the backend).

QUESTION 5 [RESOLVED FOR NOW]:

    + Why are my mongoose associations between users and posts not working correctly?

    See: /server/models/post-model.js and /server/models/user-model.js

    [SOLUTION]: You have falsely assumed that the post will automatically be pushed
    into your user.posts array, and you assumed that the post.user will automatically
    update for you from mongoose. This is incorrect. You have to first save the ID
    manually into the post, and then push the post into the users array.

    Once you've done this, your posts should work.

    [SUB ISSUES]:

        [ISSUE EXPERIENCED]: I've got my posts to push now, but when I push into the array,
        the new push overwrites the old array. Is my old array being emptied somehow when
        I try and push again? Why is my push not working?

            [SOLUTION]: You forgot to save! Make sure to use Post.save() after pushing!

QUESTION 6 [RESOLVED]:

    + How do I update the name so it's the name not the user ID when a new post is created?

    [MY SOLUTION]: Adjusted model so when first post is made, the username is actually stored as a `username` field within the model.

QUESTION 7 [RESOLVED]:

    + Why does my $scope.commentMessage not seem to pass appropriately to my factory? See the comments below. For now I solved this by manually passing the model
    into the angular controller method. However this doesn't really give me the full solution I need, albeit comments are now being created.

        http://stackoverflow.com/questions/13714884/difficulty-with-ng-model-ng-repeat-and-inputs

        http://stackoverflow.com/questions/12977894/what-is-the-angularjs-way-to-databind-many-inputs

        https://github.com/angular/angular.js/issues/1267

        [SOLUTION] I was able to `track by $index` on my `/messages` page `ng-repeat`, and in addition, in my `ng-model` I used the same object in our `ng-repeat` (in this case it was
        `post in allPosts`), thus I used `ng-model="post.comment"`. Upon typing in the input field, `.comment` is immediately added to the individual `post` object from `ng-repeat`. However,
        to get only this single message's comment, we had to receive the `$index` on the controller and go through our `allPosts[idx].comment` to get the comment for that single post. I ended
        up also formatting it as an object for easier DB creation. See `/messages.html` for more information as I've placed inline comments beneath the `ng-repeat` and nested `ng-model` textarea.

        [UPDATE SOLUTION **READ THIS**] Listen, instead of taking that very complicated way above. DO NOT USE `track by index`, and instead just pass the `post` itself into the `ng-submit` function. So instead it'll look like this: `ng-submit="newComment(post)"`. This will pass the entire `post` object in, and from the `post.comment` we can get our message data.




//////////// WHERE I LEFT OFF //////////// @ 1:31AM

    + I attempted to fix database redundancy with the comments being pushed into the .comments array within the post schema. However, now I'm hitting async issues when trying to nest mongoose queries.
        Essentially, I was able to query the DB to get all posts, and then tried to go through a for loop on all posts and query the DB for the comments that pertained to each (is this the wrong way?)
        As the for loop moves faster through the iterations than the promise data is returned, my console logs or variable manipulations within the promise was out of synch with the variables in
        the scope of the for loop only (and not within the scope of the promise). WTF MATE

        [ATTEMPTED SOLUTION]: I want to try and pass back all the posts to the Angular Controller, and try putting my for loop in the controller so that for each post, a query is sent to the DB
        and the comments being returned, are attached back to the posts and the scope updated. I don't know if this will be a lot slower than the other method, or if this too will just cause
        the same async problem, but worth a shot. If I can't figure it out, that is when I'm going to message Jason again and post to stack exchange with a brief example (maybe I can create a snippet
        for Jason ahead of time as well).
