/* jshint node: true */

var express = require('express');
var router = express.Router();
var Group = require('../models/group');
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
        return res.json({
            success: false,
            error: 'Unauthorized'
        });
    };
}
 
router.get('/', [
    hasAccess('referee'), 
    function (req, res, next) {
    console.log('you have access!');
        res.render('referee', {
            title: 'Referee',
            user: req.user
        });
    }
]);

router.get('/getGroupById/:_id/', [
    hasAccess('referee'),
    function(req,res){
        console.log('getGroupById');
        Group.findOne({_id:req.params._id}).populate('horses').populate('referees').exec(function(err,group){
            res.json(JSON.parse(JSON.stringify(group)));
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

router.post('/mark/', [
    hasAccess('referee'),
    function(req, res) {
    console.log('mark clicked route');
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
            console.log('Mark saving succesful');
            console.log(mark);
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