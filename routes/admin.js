/*jshint node: true, browser: true, jquery: true*/
var express = require('express');
var router = express.Router();
var Horse = require('../models/horse');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/tsw';

router.use(function(req, res, next) {
    if (!req.user) {
        res.redirect('/');
    }
    next();
});

console.log('here3');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('admin', {
        title: 'Admin'
    });
});


// Use connect method to connect to the Server
router.get('/showHorses', function(req, res){
    MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                console.log('Connection established to', url);

                // Get the documents collection
                var collection = db.collection('horses');

                // Insert some users
                collection.find().toArray(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else if (result.length) {
                        console.log('Found');
                        
                        var showHorsesFunction = function() {
                            return {
                                "horses": result
                            };
                        };
                        res.json(showHorsesFunction());
                        console.log(res.returnValue);
                        
                    } else {
                        console.log('No document(s) found with defined "find" criteria!');
                    }
                    db.close();
                });
            }
    });
});

router.get('/showUsers', function(req, res){
    MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                console.log('Connection established to', url);

                // Get the documents collection
                var collection = db.collection('users');

                // Insert some users
                collection.find().toArray(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else if (result.length) {
                        console.log('Found');
                        
                        var showUsersFunction = function() {
                            return {
                                "users": result
                            };
                        };
                        res.json(showUsersFunction());
                        console.log(res.returnValue);
                        
                    } else {
                        console.log('No document(s) found with defined "find" criteria!');
                    }
                    db.close();
                });
            }
    });
});

router.post('/addHorse', function(req, res) {
    var addHorseFunction = function() {
        var newHorse = new Horse();

        newHorse.name = req.param('name');
        newHorse.gender = req.param('gender');
        newHorse.owner = req.param('owner');
        newHorse.born = req.param('born');

        newHorse.save(function(err) {
            if (err) {
                console.log('Error in Saving horse: ' + err);
                throw err;
            }
            console.log('Horse saving succesful');
            console.log(newHorse);
            res.statusCode = 302;
            res.setHeader("Location", "/admin");
            res.end();
            return {
                "horse": newHorse
            };
        });
    };
    res.json(addHorseFunction());
});

/* Handle Registration POST */
module.exports = function(passport) {
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/referee',
        failureRedirect: '/signup',
        failureFlash: true
    }));
};

module.exports = router;