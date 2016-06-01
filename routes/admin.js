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

router.get('/showHorses', function(req, res){
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var collection = db.collection('horses');

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

router.get('/showUsers', function(req, res){
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var collection = db.collection('users');

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

router.get('/addHorse/name/:name/owner/:owner/gender/:gender/born/:born/', function(req, res) {
    console.log('addHorse clicked route');
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
            return {
                "horse": newHorse
            };
        });
    };
    res.json(addHorseFunction());
    res.writeHead(302, {
      'Location': '/admin/'
    });
    res.end();
});

router.get('/activateUser/:id', function (req, res) {
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

router.get('/deactivateUser/:id', function (req, res) {
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

router.get('/getHorseById/:id', function(req,res){
    Horse.findOne({_id:req.params.id},function(err,horse){
        console.log(horse);
        res.json(horse);
    });
});

router.get('/editHorse/:id/name/:name/owner/:owner/gender/:gender/born/:born/', function(req,res){
    console.log('edithorse clicked route');
    var editHorseFunction = function() {
        Horse.findOne({_id:req.params.id},function(err,horse){
            console.log(horse);
            horse.update({
                name : req.params.name,
                owner : req.params.owner,
                gender : req.params.gender,
                born : req.params.born,
            }, function(error){
                console.log(error);
            });
        });
    };
    res.json(editHorseFunction());
    res.writeHead(302, {
      'Location': '/admin/'
    });
    res.end();
});

router.get('/getUserById/:id', function(req,res){
    users.findOne({_id:req.params.id},function(err,user){
        console.log(user);
        res.json(user);
    });
});

router.get('/editUser/:id/username/:username/password/:password/email/:email/firstname/:firstname/lastname/:lastname/role/:role/',function(req,res){
    console.log('edituser clicked route');
    var editUserFunction = function() {
        users.findOne({_id:req.params.id},function(err,user){
            console.log(user);
            var password = createHash(req.params.password);
            user.update({
                username : req.params.username,
                password : password,
                email : req.params.email,
                firstname : req.params.firstname,
                lastname : req.params.lastname,
                role : req.params.role
            }, function(error){
                console.log(error);
            });
        });
    };
    res.json(editUserFunction());
    res.writeHead(302, {
      'Location': '/admin/'
    });
    res.end();
});

router.get('/activateHorse/:id', function (req, res) {
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

router.get('/deactivateHorse/:id', function (req, res) {
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

router.get('/addUser/username/:username/password/:password/email/:email/role/:role/firstname/:firstname/lastname/:lastname/', function(req, res) {
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
            return {
                "user": newUser
            };
        });
    };
    res.json(addUserFunction());
    res.writeHead(302, {
      'Location': '/admin/'
    });
    res.end();
});

var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports = router;