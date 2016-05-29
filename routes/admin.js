/*jshint node: true, browser: true, jquery: true*/
var express = require('express');
var router = express.Router();
var Horse = require('../models/horse');
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/tsw';
var users = require('../models/users');
var bCrypt = require('bcrypt-nodejs');

router.use(function(req, res, next) {
    if (!req.user) {
        res.redirect('/');
    }
    next();
});


function hasAccess(accessLevel) {
    return function (req, res, next) {
        if (req.user && req.user.hasAccess(accessLevel)) {
            return next();
        }
        return res.json({
            success: false,
            error: 'Unauthorized'
        });
    };
}
 
router.get('/', [
    hasAccess('admin'), // protection middleware 
    function (req, res, next) {
    console.log('you have access!');
        res.render('admin', {
            title: 'Admin',
            user: req.user
        });
    }
]);

router.get('/showHorses', function(req, res, next){
    MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
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
                    } else {
                        console.log('No document(s) found with defined "find" criteria!');
                    }
                    db.close();
                });
            }
    });
});

router.get('/showUsers', function(req, res, next){
    MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
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
                    } else {
                        console.log('No document(s) found with defined "find" criteria!');
                    }
                    db.close();
                });
            }
    });
});

router.post('/addHorse', function(req, res, next) {
    var addHorseFunction = function() {
        var newHorse = new Horse();

        newHorse.name = req.param('name');
        newHorse.gender = req.param('gender');
        newHorse.owner = req.param('owner');
        newHorse.born = req.param('born');
        newHorse.activate = true;

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

//router.get('/deleteuser/:id', function (req, res, next) {
//    var deleteUserByIdFunction = function(){
//        users.remove({"_id": ObjectId(req.params.id)}, function(err, docs) {
//            if(err){
//                return{
//                    "msg": "deleted"
//                };
//            }
//            return {
//                "msg": "deleted"
//            };
//        });
//    };
//    res.json(deleteUserByIdFunction());
//    res.writeHead(302, {
//      'Location': '/admin/'
//    });
//    res.end();
//});

//router.get('/deletehorse/:id', function (req, res, next) {
//    var deleteHorseByIdFunction = function(){
//        Horse.remove({"_id": ObjectId(req.params.id)}, function(err, docs) {
//            if(err){
//                return{
//                    "msg": "deleted"
//                };
//            }
//            return {
//                "msg": "deleted"
//            };
//        });
//    };
//    res.json(deleteHorseByIdFunction());
//    res.writeHead(302, {
//      'Location': '/admin/'
//    });
//    res.end();
//});

router.get('/activateUser/:id', function (req, res, next) {
    var activateUserByIdFunction = function(){
        users.findOne({_id:req.params.id},function(err,user){
            user.activate = true;
            user.save(function(err){
                if(err){
                    return{
                        "msg": "error"
                    };
                }
                return {
                    "msg": "activated"
                };
            });
        });
    };
    res.json(activateUserByIdFunction());
    res.writeHead(302, {
      'Location': '/admin/'
    });
    res.end();
});

router.get('/deactivateUser/:id', function (req, res, next) {
    var deactivateUserByIdFunction = function(){
        users.findOne({_id:req.params.id},function(err,user){
            user.activate = false;
            user.save(function(err){
                if(err){
                    return{
                        "msg": "error"
                    };
                }
                return {
                    "msg": "activated"
                };
            });
        });
    };
    res.json(deactivateUserByIdFunction());
    res.writeHead(302, {
      'Location': '/admin/'
    });
    res.end();
});

router.get('/activateHorse/:id', function (req, res, next) {
    var activateUserByIdFunction = function(){
        Horse.findOne({_id:req.params.id},function(err,horse){
            horse.activate = true;
            horse.save(function(err){
                if(err){
                    return{
                        "msg": "error"
                    };
                }
                return {
                    "msg": "activated"
                };
            });
        });
    };
    res.json(activateUserByIdFunction());
    res.writeHead(302, {
      'Location': '/admin/'
    });
    res.end();
});

router.get('/deactivateHorse/:id', function (req, res, next) {
    var deactivateUserByIdFunction = function(){
        Horse.findOne({_id:req.params.id},function(err,horse){
            horse.activate = false;
            horse.save(function(err){
                if(err){
                    return{
                        "msg": "error"
                    };
                }
                return {
                    "msg": "activated"
                };
            });
        });
    };
    res.json(deactivateUserByIdFunction());
    res.writeHead(302, {
      'Location': '/admin/'
    });
    res.end();
});

router.post('/addUser', function(req, res, next) {
    var addUserFunction = function() {
        var newUser = new users();

        newUser.username = req.param('username');
        var password = req.param('password');
        newUser.password = createHash(password);
        newUser.email = req.param('email');
        newUser.firstname = req.param('firstname');
        newUser.lastname = req.param('lastname');
        newUser.role = req.param('role');
        newUser.activate = true;

        newUser.save(function(err) {
            if (err) {
                console.log('Error in Saving horse: ' + err);
                throw err;
            }
            console.log('User saving succesful');
            console.log(newUser);
            res.statusCode = 302;
            res.setHeader("Location", "/admin");
            res.end();
            return {
                "user": newUser
            };
        });
    };
    res.json(addUserFunction());
});

var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports = router;