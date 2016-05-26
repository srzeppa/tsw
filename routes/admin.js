/*jshint node: true, browser: true, jquery: true*/

var express = require('express');
var router = express.Router();
var Horse = require('../models/horse');

router.use(function (req, res, next){
    if(!req.user){
        res.redirect('/');
    }
    next();
});

console.log('here3');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin', { title: 'Admin' });
});

//router.get('/admin/chuj', function(req, res, next) {
//  res.render('addHorse', { title: 'Add horse' });
//});

//router.get(/^\/admin\/((name\/(\d+)\/)?(gender\/(\d+)\/)?(owner\/(\d+)\/)?)?/, function(req,res){
router.post('/addHorse', function(req,res){
    var fawekOdsylaczFunkcja = function(){
        var newHorse = new Horse();

        newHorse.name = req.param('name');
        newHorse.gender = req.param('gender');
        newHorse.owner = req.param('owner');
        newHorse.born = req.param('born');

        newHorse.save(function(err) {
            if (err){
                console.log('Error in Saving horse: '+err);  
                throw err;  
            }
            console.log('Horse saving succesful');
            console.log(newHorse);
            res.statusCode = 302; 
            res.setHeader("Location", "/admin");
            res.end();
            return {
                "horse" : newHorse
            }
        });
    };
    res.json(fawekOdsylaczFunkcja());
});
    
module.exports = router;