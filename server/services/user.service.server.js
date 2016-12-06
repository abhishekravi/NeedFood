module.exports = function (app, model) {

    var passport = require('passport');
    var cookieParser = require('cookie-parser');
    var session = require('express-session');
    var LocalStrategy = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var bcrypt = require("bcrypt-nodejs");

    //google authentication configuration
    var googleConfig = {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    };
    //facebook authentication configuration
    var facebookConfig = {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL
    };
    app.use(session({
        //use env variable
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    }));

    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(localStrategy));
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.get('/api/user', findUser);
    app.get('/api/user/:uid', findUserById);
    app.post('/api/register', createUser);
    app.put('/api/user/:uid', correctUserCheck, updateUser);
    app.delete('/api/user/:uid', correctUserCheck, deleteUser);
    app.post('/api/login', passport.authenticate('local'), login);
    app.post('/api/checkLogin', checkLogin);
    app.post('/api/logout', logout);
    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/project/#/home',
            failureRedirect: '/project/#/login'
        }));
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/project/#/home',
            failureRedirect: '/project/#/login'
        }));


    /**
     * method to check if user is logged in.
     * @param req
     * @param res
     */
    function checkLogin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    /**
     * method to login the user and get the user object.
     * @param req
     * @param res
     */
    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    /**
     * method to logout.
     * @param req
     * @param res
     */
    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }

    /**
     * method to login using local database.
     * @param username
     * @param password
     * @param done
     */
    function localStrategy(username, password, done) {
        model.userModel
            .findUserByUsername(username)
            .then(
                function (user) {

                    if (user!=null && user.username === username && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, '0');
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

    /**
     * method to login using google authentication.
     * @param token
     * @param refreshToken
     * @param profile
     * @param done
     */
    function googleStrategy(token, refreshToken, profile, done) {
        model.userModel
            .findUserByGoogleId(profile.id)
            .then(
                function (user) {
                    if (user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username: emailParts[0],
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: email,
                            google: {
                                id: profile.id,
                                token: token
                            }
                        };
                        return model.userModel.createUser(newGoogleUser);
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            )
            .then(
                function (user) {
                    return done(null, user);
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

    /**
     * method to login using facebook authentication.
     * @param token
     * @param refreshToken
     * @param profile
     * @param done
     */
    function facebookStrategy(token, refreshToken, profile, done) {
        model.userModel
            .findUserByFacebookId(profile.id)
            .then(
                function (user) {
                    var email = '';
                    var emailParts = ['', ''];
                    var firstName = profile.displayName;
                    if (profile.name.givenName)
                        firstName = profile.name.givenName;
                    var lastName = '';
                    if (profile.name.familyName)
                        lastName = profile.name.familyName;

                    if (user) {
                        return done(null, user);
                    } else {
                        if (profile.emails) {
                            email = profile.emails[0].value;
                            emailParts = email.split("@");
                        }
                        var newFacebookUser = {
                            username: emailParts[0],
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            facebook: {
                                id: profile.id,
                                token: token
                            }
                        };
                        return model.userModel.createUser(newFacebookUser);
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            )
            .then(
                function (user) {
                    return done(null, user);
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

    /**
     * to serialize object and pass it to client.
     * @param user
     * @param done
     */
    function serializeUser(user, done) {
        done(null, user);
    }

    /**
     * to get object when needed.
     * @param user
     * @param done
     */
    function deserializeUser(user, done) {
        model.userModel
            .findUserById(user._id)
            .then(
                function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                }
            );
    }

    /**
     * method to find user.
     * @param req
     * request
     * @param res
     * response
     */
    function findUser(req, res) {
        var query = req.query;
        if (query.password && query.username) {
            findUserByCredentials(req, res);
        } else if (query.username) {
            findUserByUsername(req, res);
        } else {
            res.json(req.user);
        }
    }

    /**
     * method to find user by username and password.
     * @param req
     * request
     * @param res
     * response
     * @returns {*}
     * user object
     */
    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = bcrypt.hashSync(req.query.password);
        model.userModel.findUserByCredentials(username, password)
            .then(
                function (user) {
                    if (user) {
                        res.json(user);
                    } else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    /**
     * method to find user by username.
     * @param req
     * request
     * @param res
     * response
     * @returns {*}
     * user object
     */
    function findUserByUsername(req, res) {
        var username = req.query.username;
        model.userModel.findUserByUsername(username)
            .then(
                function (user) {
                    if (user) {
                        res.send(user);
                    } else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    /**
     * method to find user by userid.
     * @param req
     * request
     * @param res
     * response
     * @returns {*}
     * user object
     */
    function findUserById(req, res) {
        var id = req.params.uid;
        model.userModel.findUserById(id)
            .then(
                function (user) {
                    if (user) {
                        res.send(user);
                    } else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    /**
     * creates new user.
     * @param req
     * request
     * @param res
     * response
     * @returns {*}
     * user object
     */
    function createUser(req, res) {
        var user = req.body;
        if(user.password)
            user.password = bcrypt.hashSync(user.password);
        model.userModel.createUser(user)
            .then(
                function (user) {
                    if (user) {
                        req.login(user, function (err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                }
            );
    }


    /**
     * method to check if the user id matches the user id of the currently logged in user.
     * @param req
     * @param res
     * @param next
     */
    function correctUserCheck(req, res, next) {
        var loggedIn = req.isAuthenticated();
        var sameUser = req.params.uid == req.user._id;
        if (loggedIn && sameUser) {
            next();
        } else {
            res.sendStatus(400).send("incorrect user id");
        }
    }

    /**
     * method to update user.
     * @param req
     * request
     * @param res
     * response
     */
    function updateUser(req, res) {
        var user = req.body;
        var uid = req.params.uid;
        model.userModel.updateUser(uid, user)
            .then(
                function (s) {
                    res.sendStatus(200);
                },
                function (e) {
                    res.sendStatus(400).send(e);
                });
    }

    /**
     * method to delete user.
     * @param req
     * request
     * @param res
     * response
     */
    function deleteUser(req, res) {
        var uid = req.params.uid;
        model.userModel.deleteUser(uid)
            .then(
                function (s) {
                    res.sendStatus(200);
                },
                function (e) {
                    res.sendStatus(400).send(e);
                });
    }
};