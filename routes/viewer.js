/* jshint node: true */

var express = require('express');
var router = express.Router();
var Result = require('../models/result');
var Horse = require('../models/horse');
var Competition = require('../models/competition');

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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('viewer', { title: 'Viewer' });
});

var exports = module.exports = {};

exports.index = function (req, res) {
    var body = '<html><body>';
    var username;
    if (req.user) {
        username = req.user.username;
        body += '<p>Jesteś zalogowany jako „' + username + '”</p>';
        body += '<a href="/logout">Wyloguj</a>';
    } else {
        body += '<a href="/login">Zaloguj</a>';
    }
    body += '</body></html>';
    res.send(body);
};

exports.login = function (req, res) {
    var body = '<html><body>';
    body += '<form action="/login" method="post">';
    body += '<div><label>Użytkownik:</label>';
    body += '<input type="text" name="username"/><br/></div>';
    body += '<div><label>Hasło:</label>';
    body += '<input type="password" name="password"/></div>';
    body += '<div><input type="submit" value="Zaloguj"/></div></form>';
    body += '</body></html>';
    res.send(body);
};

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/login');
};

	/* Handle Logout */
router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/getAllResults', function (req, res, next) {
    Result.find({}).populate('horse').populate('competition').lean().exec(function(err, competition) {
        if (err) throw err;
        res.json(JSON.parse(JSON.stringify(competition)));
    });
});

router.get('/getHorseById/:_id/', function(req,res){
    Horse.findOne({_id:req.params._id},function(err,horse){
        res.json(horse);
    });
});

router.get('/getCompetitionById/:_id/', function(req,res){
    Competition.findOne({_id:req.params._id}).populate('groups').exec(function(err,competition){
        res.json(competition);
    });
});

module.exports = router;