/*jshint node: true, browser: true, jquery: true*/
/*jshint loopfunc: true */
var express = require('express');
var router = express.Router();
var Horse = require('../models/horse');
var Competition = require('../models/competition');
var Score = require('../models/partialScore');
var Group = require('../models/group');
var Result = require('../models/result');
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var users = require('../models/users');
var bCrypt = require('bcrypt-nodejs');
var async = require("async");

router.use(function(req, res, next) {
    if (!req.user) {
        res.redirect('/');
    }
    next();
});


function hasAccess(accessLevel) {
    return function(req, res, next) {
        if (req.user && req.user.hasAccess(accessLevel)) {
            return next();
        }
        return res.render('index', {
            success: false,
            error: 'Unauthorized | go back please !'
        });
    };
}

router.get('/', [
    hasAccess('admin'),
    function(req, res, next) {
        res.render('admin', {
            title: 'Admin',
            user: req.user
        });
    }
]);

router.get('/showHorses', [
    hasAccess('admin'),
    function(req, res, next) {
        Horse.find({}).exec(function(err, horses) {
            if (err) throw err;
            var result = JSON.parse(JSON.stringify(horses));
            res.json({
                "horses": result
            });
        });
    }
]);

router.get('/showUsers', [
    hasAccess('admin'),
    function(req, res) {
        users.find({}).exec(function(err, users) {
            if (err) throw err;
            var result = JSON.parse(JSON.stringify(users));
            res.json({
                "users": result
            });
        });
    }
]);

router.post('/addHorse/', [
    hasAccess('admin'),
    function(req, res) {
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
    }
]);

router.post('/activateUser/', [
    hasAccess('admin'),
    function(req, res) {
        var activateUserByIdFunction = function() {
            users.findOne({
                _id: req.body._id
            }, function(err, user) {
                user.activate = true;
                user.save(function(err) {
                    if (err) {
                        return {
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
    }
]);

router.post('/deactivateUser/', [
    hasAccess('admin'),
    function(req, res) {
        var deactivateUserByIdFunction = function() {
            users.findOne({
                _id: req.body._id
            }, function(err, user) {
                user.activate = false;
                user.save(function(err) {
                    if (err) {
                        return {
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
    }
]);

router.get('/getHorseById/:_id/', [
    hasAccess('admin'),
    function(req, res) {
        Horse.findOne({
            _id: req.params._id
        }, function(err, horse) {
            res.json(horse);
        });
    }
]);

router.post('/editHorse/', [
    hasAccess('admin'),
    function(req, res) {
        var editHorseFunction = function() {
            Horse.findOne({
                _id: req.body._id
            }, function(err, horse) {
                horse.update({
                    name: req.body.name,
                    owner: req.body.owner,
                    gender: req.body.gender,
                    born: req.body.born,
                }, function(error) {
                    console.log(error);
                });
            });
        };
        res.json(editHorseFunction());
        res.writeHead(302, {
            'Location': '/admin/'
        });
        res.end();
    }
]);

router.get('/getUserById/:_id/', [
    hasAccess('admin'),
    function(req, res) {
        users.findOne({
            _id: req.params._id
        }, function(err, user) {
            res.json(user);
        });
    }
]);

router.get('/getAllActivateReferees/', [
    hasAccess('admin'),
    function(req, res) {
        users.find({
            role: 'referee',
            activate: true
        }).exec(function(err, users) {
            if (err) throw err;
            var result = JSON.parse(JSON.stringify(users));
            res.json({
                "users": result
            });
        });
    }
]);

router.get('/getAllActivateHorses/', [
    hasAccess('admin'),
    function(req, res) {
        Horse.find({
            activate: true
        }).exec(function(err, horses) {
            if (err) throw err;
            var result = JSON.parse(JSON.stringify(horses));
            res.json({
                "horses": result
            });
        });
    }
]);

router.post('/editUser/', [
    hasAccess('admin'),
    function(req, res) {
        var editUserFunction = function() {
            users.findOne({
                _id: req.body._id
            }, function(err, user) {
                var password = createHash(req.body.password);
                user.update({
                    username: req.body.username,
                    password: password,
                    email: req.body.email,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    role: req.body.role
                }, function(error) {
                    console.log(error);
                });
            });
        };
        res.json(editUserFunction());
        res.writeHead(302, {
            'Location': '/admin/'
        });
        res.end();
    }
]);

router.post('/activateHorse/', [
    hasAccess('admin'),
    function(req, res) {
        var activateHorseByIdFunction = function() {
            Horse.findOne({
                _id: req.body._id
            }, function(err, horse) {
                horse.activate = true;
                horse.save(function(err) {
                    if (err) {
                        return {
                            "msg": "error"
                        };
                    }
                    return {
                        "msg": "activated"
                    };
                });
            });
        };
        res.json(activateHorseByIdFunction());
        res.writeHead(302, {
            'Location': '/admin/'
        });
        res.end();
    }
]);

router.post('/deactivateHorse/', [
    hasAccess('admin'),
    function(req, res) {
        var deactivateHorseByIdFunction = function() {
            Horse.findOne({
                _id: req.body._id
            }, function(err, horse) {
                horse.activate = false;
                horse.save(function(err) {
                    if (err) {
                        return {
                            "msg": "error"
                        };
                    }
                    return {
                        "msg": "activated"
                    };
                });
            });
        };
        res.json(deactivateHorseByIdFunction());
        res.writeHead(302, {
            'Location': '/admin/'
        });
        res.end();
    }
]);

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
                    console.log('Error in Saving user: ' + err);
                    throw err;
                }
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
    }
]);

var getAllHorses = function(data) {
    var maleHorses = [];
    var femaleHorses = [];
    data.forEach(function(data) {
        Horse.findOne({
            _id: data
        }, function(err, horse) {
            if (horse.gender === 'female') {
                console.log('female');
                femaleHorses.push(horse);
            } else {
                console.log('male');
                maleHorses.push(horse);
            }
        });
    });
    return {
        maleHorses: maleHorses,
        femaleHorses: femaleHorses
    };
};


var test = function(data) {
    var horsesAfterGet = [];
    for (var i = 0; i < data.length; i++) {
        Horse.findOne({
            _id: data[i]
        }, function(err, horse) {
            console.log('horse');
            console.log(horse);
            horsesAfterGet.push(horse);
        });
    }

    return horsesAfterGet;
};

router.post('/addCompetition/', [
    hasAccess('admin'),
    function(req, res) {
        var name = '';
        var horses = [];
        var referees = [];
        var randomizedReferees = [];
        var randomizedHorses = [];
        var tmpTable = [];
        var startHorse = 0;
        var endHorse = 0;
        var endStalion = 0;
        var endMare = 0;
        var startReferee = 0;
        var endReferee = 0;
        var refereesCount = 0;
        var horsesCount = 0;
        var randomizedStalions = [];
        var randomizedMares = [];
        var startStalion = 0;
        var startMare = 0;


        var arr = Object.keys(req.body).map(function(k) {
            return req.body[k];
        });

        name = arr[0];
        horses = arr[1];
        referees = arr[2];
        refereesCount = parseInt(arr[3]);
        horsesCount = parseInt(arr[4]);
        randomizedStalions = arr[5];
        randomizedMares = arr[6];

        randomizedHorses = shuffle(horses);
        randomizedReferees = shuffle(referees);

        randomizedMares = shuffle(randomizedMares);
        randomizedStalions = shuffle(randomizedStalions);

        var i = 0;
        endHorse = horsesCount;
        endReferee = refereesCount;

        endStalion = horsesCount;
        endMare = horsesCount;

        parseInt(endMare);
        parseInt(endStalion);
        parseInt(startStalion);
        parseInt(startMare);

        async.whilst(
            function() {
                return (randomizedStalions.slice(startStalion, endStalion).length === horsesCount && randomizedReferees.slice(startReferee, endReferee).length === refereesCount);
            },
            function(callback) {

                var group = new Group({
                    horses: randomizedStalions.slice(startStalion, endStalion),
                    referees: randomizedReferees.slice(startReferee, endReferee)
                });

                tmpTable.push(group);

                i++;

                startStalion = startStalion + horsesCount;
                endStalion = endStalion + horsesCount;

                startReferee = startReferee + refereesCount;
                endReferee = endReferee + refereesCount;

                callback();
            },
            function(err, n) {

            }
        );
        i = 0;

        async.whilst(
            function() {
                return (randomizedMares.slice(startMare, endMare).length === horsesCount && randomizedReferees.slice(startReferee, endReferee).length === refereesCount);
            },
            function(callback) {
                var group = new Group({
                    horses: randomizedMares.slice(startMare, endMare),
                    referees: randomizedReferees.slice(startReferee, endReferee)
                });
                tmpTable.push(group);

                i++;

                startMare = startMare + horsesCount;
                endMare = endMare + horsesCount;

                startReferee = startReferee + refereesCount;
                endReferee = endReferee + refereesCount;
                callback();
            },
            function(err, n) {

            }
        );

        var z = 0;
        async.each(tmpTable, function(item, callback) {
            item.save(function(err) {
                if (!err) {
                    if (z === 0) {
                        z++;
                        var competition = new Competition({
                            name: name,
                            groups: tmpTable,
                            isActive: true,
                            hasStarted: false
                        });
                        competition.save(function(err) {
                            if (!err) {

                                res.json(tmpTable);
                            } else {
                                console.log(err);
                            }
                        });
                    }
                    callback();
                } else {
                    console.log(err);
                    callback();
                }
            });
        });
    }
]);

router.post('/startCompetition/', [
    hasAccess('admin'),
    function(req, res) {
        var startCompetitionByIdFunction = function() {
            Competition.findOne({
                _id: req.body._id
            }, function(err, competition) {
                competition.started = true;
                competition.save(function(err) {
                    if (err) {
                        return {
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
        res.writeHead(302, {
            'Location': '/admin/'
        });
        res.end();
    }
]);

router.post('/stopCompetition/', [
    hasAccess('admin'),
    function(req, res) {
        var stopCompetitionByIdFunction = function() {
            Competition.findOne({
                _id: req.body._id
            }, function(err, competition) {
                competition.started = false;
                competition.save(function(err) {
                    if (err) {
                        return {
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
        res.writeHead(302, {
            'Location': '/admin/'
        });
        res.end();
    }
]);

router.get('/showCompetitions', [
    hasAccess('admin'),
    function(req, res, next) {
        Competition.find({}).populate('groups').lean().exec(function(err, competition) {
            if (err) throw err;
            res.json(JSON.parse(JSON.stringify(competition)));
        });
    }
]);

router.get('/getCompetitionById/:_id/', [
    hasAccess('admin'),
    function(req, res) {
        Competition.findOne({
            _id: req.params._id
        }).populate('groups').exec(function(err, competition) {
            res.json(competition);
        });
    }
]);

router.get('/getGroupById/:_id/', [
    hasAccess('admin'),
    function(req, res) {
        Group.findOne({
            _id: req.params._id
        }).populate('horses').populate('referees').exec(function(err, group) {
            res.json(JSON.parse(JSON.stringify(group)));
        });
    }
]);

router.post('/mark/', [
    hasAccess('admin'),
    function(req, res) {
        var markFunction = function() {
            var mark = new Result();


            mark.overall = req.body.overall;
            mark.competition = req.body.competition;
            mark.horse = req.body.horse;

            mark.save(function(err) {
                if (err) {
                    console.log('Error in Saving horse: ' + err);
                    throw err;
                }
                return {
                    "mark": mark
                };
            });
        };
        res.json(markFunction());
        res.writeHead(302, {
            'Location': '/admin/'
        });
        res.end();
    }
]);

router.post('/partialMark/', [
    hasAccess('admin'),
    function(req, res) {
        var partialMarkFunction = function() {

            Score.find({
                referee: req.body.referee
            }, function(err, score) {
                if (score.length) {
                    console.log('score.length');
                    if (parseInt(req.body.legs) !== 0) {
                        score[0].update({
                            legs: req.body.legs,
                        }, function(error) {
                            console.log(error);
                        });
                    }
                    if (parseInt(req.body.head) !== 0) {
                        score[0].update({
                            head: req.body.head,
                        }, function(error) {
                            console.log(error);
                        });
                    }
                    if (parseInt(req.body.movement) !== 0) {
                        score[0].update({
                            movement: req.body.movement,
                        }, function(error) {
                            console.log(error);
                        });
                    }
                    if (parseInt(req.body.neck) !== 0) {
                        score[0].update({
                            neck: req.body.neck,
                        }, function(error) {
                            console.log(error);
                        });
                    }
                    if (parseInt(req.body.body) !== 0) {
                        score[0].update({
                            body: req.body.body
                        }, function(error) {
                            console.log(error);
                        });
                    }
                } else {
                    console.log('else');
                    var newScore = Score({
                        referee: req.body.referee,
                        legs: req.body.legs,
                        head: req.body.head,
                        movement: req.body.movement,
                        neck: req.body.neck,
                        body: req.body.body
                    });
                    newScore.save();
                    Competition.update({
                        _id: req.body.competition._id
                    }, {
                        $push: {
                            score: newScore._id
                        }
                    }, {
                        upsert: true
                    }, function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Successfully added");
                        }
                    });
                }
            });
        };
        res.json(partialMarkFunction());
        res.writeHead(302, {
            'Location': '/admin/'
        });
        res.end();
    }
]);


var createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

var shuffle = function(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

module.exports = router;