/* jshint node: true */

var express = require('express');
var router = express.Router();

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

router.get('/user_data', function(req, res) {

            if (req.user === undefined) {
                // The user is not logged in
                res.json({});
            } else {
                res.json({
                    user: req.user
                });
            }
        });

module.exports = router;