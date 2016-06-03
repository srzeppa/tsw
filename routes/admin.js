/*jshint node: true, browser: true, jquery: true*/
var express = require('express');
var router = express.Router();
var Horse = require('../models/horse');
var Competition = require('../models/competition');
var Group = require('../models/group');
var Result = require('../models/result');
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

router.get('/showHorses', [
    hasAccess('admin'),
    function (req, res, next) {
    console.log('you have access!');
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
    }
]);

router.get('/showUsers', [
    hasAccess('admin'),
    function(req, res){
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
}]);

router.post('/addHorse/', [
    hasAccess('admin'),
    function(req, res) {
    console.log('addHorse clicked route');
    var addHorseFunction = function() {
        var newHorse = new Horse();
        
        newHorse.name = req.body.name;
        newHorse.gender = req.body.gender;
        newHorse.owner = req.body.owner;
        newHorse.born = req.body.born;
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
}]);

router.get('/activateUser/:id', [
    hasAccess('admin'),
    function (req, res) {
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
}]);

router.get('/deactivateUser/:id', [
    hasAccess('admin'),
    function (req, res) {
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
}]);

router.get('/getHorseById/:id', [
    hasAccess('admin'),
    function(req,res){
    Horse.findOne({_id:req.params.id},function(err,horse){
        console.log(horse);
        res.json(horse);
    });
}]);

router.post('/editHorse/', [
    hasAccess('admin'),
    function(req,res){
    console.log('edithorse clicked route');
    var editHorseFunction = function() {
        Horse.findOne({_id:req.body._id},function(err,horse){
            console.log(horse);
            horse.update({
                name : req.body.name,
                owner : req.body.owner,
                gender : req.body.gender,
                born : req.body.born,
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
}]);

router.get('/getUserById/:id', [
    hasAccess('admin'),
    function(req,res){
    users.findOne({_id:req.params.id},function(err,user){
        console.log(user);
        res.json(user);
    });
}]);

router.get('/getAllActivateReferees/', [
    hasAccess('admin'),
    function(req,res){
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var collection = db.collection('users');

            collection.find({role:'referee', activate:true}).toArray(function(err, result) {
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
}]);

router.get('/getAllActivateHorses/', [
    hasAccess('admin'),
    function(req,res){
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var collection = db.collection('horses');

            collection.find({activate:true}).toArray(function(err, result) {
                if (err) {
                    console.log(err);
                } else if (result.length) {
                    console.log('Found');

                    var showUsersFunction = function() {
                        return {
                            "horses": result
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
}]);

router.post('/editUser/', [
    hasAccess('admin'),
    function(req,res){
    console.log('edituser clicked route');
    var editUserFunction = function() {
        users.findOne({_id:req.body._id},function(err,user){
            console.log(user);
            var password = createHash(req.body.password);
            user.update({
                username : req.body.username,
                password : password,
                email : req.body.email,
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                role : req.body.role
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
}]);

router.get('/activateHorse/:id', [
    hasAccess('admin'),
    function (req, res) {
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
}]);

router.get('/deactivateHorse/:id', [
    hasAccess('admin'),
    function (req, res) {
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
}]);

router.post('/addUser/', [
    hasAccess('admin'),
    function(req, res) {
    var addUserFunction = function() {
        var newUser = new users();

        newUser.username = req.body.username;
        var password = req.body.password;
        newUser.password = createHash(password);
        newUser.email = req.body.email;
        newUser.firstname = req.body.firstname;
        newUser.lastname = req.body.lastname;
        newUser.role = req.body.role;
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
}]);

router.post('/addCompetition/', [
    hasAccess('admin'),
    function(req, res) {
    var addCompetitionFunction = function() {
        var newCompetition = new Competition();
//        var newGroup = new Group();
        
        var tmpTable;
        var start = 0;
        var randomizedHorses = shuffle(req.body.horses);
        var randomizedReferees = shuffle(req.body.referees);
        var horsesCount = req.body.numberOfHorses;
        var refereesCount = req.body.numberOfReferees;
        var i = 0;
        var end = horsesCount;
        var listOfGroups = [];
        var newGroup;
        var test = randomizedHorses.length / horsesCount;

        while(i < test) {
//            while(randomizedHorses.slice(start,end).length === (end - start) && randomizedReferees.slice(start,end).length === (end - start)) {
            newGroup = new Group({
                horses: randomizedHorses.slice(start, end),
                referees: randomizedReferees.slice(start, end)
            });

            console.log('newGroup');
            console.log(newGroup);
            start = start + horsesCount;
            end = end + horsesCount;
            console.log('i');
            console.log(i);

            listOfGroups.push(newGroup._id);
            console.log('listOfGroups');
            console.log(listOfGroups);

            newGroup.save(function(err) {
                if (err) {
                    console.log('Error in Saving horse: ' + err);
                    throw err;
                }
                console.log('Group saving succesful');
                console.log(newGroup);
            });
            i++;
        }

        newCompetition.name = req.body.name;
        newCompetition.groups = listOfGroups;
        newCompetition.started = false;

        newCompetition.save(function(err) {
            if (err) {
                console.log('Error in Saving horse: ' + err);
                throw err;
            }
            console.log('Competition saving succesful');
            console.log(newCompetition);
        });
        return {
            "competition": newCompetition,
        };
    };
    res.json(addCompetitionFunction());
    res.writeHead(302, {
      'Location': '/admin/'
    });
    res.end();
}]);

router.get('/startCompetition/:id', [
    hasAccess('admin'),
    function (req, res) {
    var startCompetitionByIdFunction = function(){
        Competition.findOne({_id:req.params.id},function(err,competition){
            competition.started = true;
            competition.save(function(err){
                if(err){
                    return{
                        "msg": "error"
                    };
                }
                return {
                    "msg": "started"
                };
            });
        });
    };
    res.json(startCompetitionByIdFunction());
}]);

router.get('/stopCompetition/:id', [
    hasAccess('admin'),
    function (req, res) {
    var stopCompetitionByIdFunction = function(){
        Competition.findOne({_id:req.params.id},function(err,competition){
            competition.started = false;
            competition.save(function(err){
                if(err){
                    return{
                        "msg": "error"
                    };
                }
                return {
                    "msg": "stopped"
                };
            });
        });
    };
    res.json(stopCompetitionByIdFunction());
}]);

router.get('/showCompetitions', [
    hasAccess('admin'),
    function (req, res, next) {
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                var collection = db.collection('competitions');

                collection.find().toArray(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else if (result.length) {
                        console.log('Found');

                        var showCompetitionsFunction = function() {
                            return {
                                "competitions": result
                            };
                        };
                        res.json(showCompetitionsFunction());
                    } else {
                        console.log('No document(s) found with defined "find" criteria!');
                    }
                    db.close();
                });
            }
        });
    }
]);

var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

var shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

module.exports = router;