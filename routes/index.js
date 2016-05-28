/* jshint node: true */

var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()){
        console.log("autentykacja ok!");
		return next();
    }
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
};

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
		res.render('index', { message: req.flash('message') });
	});
    
    router.post('/login', function(req, res, next) {
        passport.authenticate('login', function(err, user, info) {
        if (err) { 
            return next(err);
        }
        if (!user) {
            return res.redirect('/'); 
        }
        req.logIn(user, function(err) {
            if (err) { 
                return next(err); 
            }
            if(req.user.role === 'admin'){
                return res.redirect('/admin');
            } else if(req.user.role === 'referee'){
                return res.redirect('/referee');
            }
        });
        })(req, res, next);
    });

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
};