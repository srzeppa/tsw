/* jshint node: true */

var express = require('express');
var router = express.Router();
var Group = require('../models/group');
var Competition = require('../models/competition');
var Result = require('../models/result');

router.use(function (req, res, next){
    if(!req.user){
        res.redirect('/');
    }
    next();
});

function hasAccess(accessLevel) {
    return function (req, res, next) {
        if (req.user && req.user.hasAccess(accessLevel)) {
            return next();
        }
        return res.render('index',{
            success: false,
            error: 'Unauthorized | go back please !'
        });
    };
}
 
router.get('/', [
    hasAccess('referee'), 
    function (req, res, next) {
        res.render('referee', {
            title: 'Referee',
            user: req.user
        });
    }
]);

router.get('/getGroupById/:_id/', [
    hasAccess('referee'),
    function(req,res){
        Group.findOne({_id:req.params._id}).populate('horses').populate('referees').exec(function(err,group){
            res.json(JSON.parse(JSON.stringify(group)));
        });
    }
]);

router.get('/getPartialMarks/:_id/', [
    hasAccess('referee'),
    function(req,res){
        Competition.findOne({_id:req.params._id}).populate('horses').populate('referees').populate('score').exec(function(err,competition){
            res.json(JSON.parse(JSON.stringify(competition)));
        });
    }
]);

router.get('/user_data', function(req, res) {
    if (req.user === undefined) {
        res.json({});
    } else {
        res.json({
            user: req.user
        });
    }
});

router.post('/mark/', [hasAccess('referee'), function(req, res) {
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
}]);

module.exports = router;