/* jshint node: true */
var fs = require('fs');
var https = require('https');

var options = {
    key: fs.readFileSync('./file.pem'),
    cert: fs.readFileSync('./file.crt')
};

var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');

//var socketIo = require('socket.io');
var passportSocketIo = require('passport.socketio');

var sessionSecret = 'wielkiSekret44';
var sessionKey = 'express.sid';
var dataForReferee = '';

var dbConfig = require('./db');
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(dbConfig.url);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'node_modules/tablesorter/dist/js')));
app.use(express.static(path.join(__dirname, 'node_modules/rangeslider.js/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/fonts')));

app.use(expressSession({
    resave: true,
    saveUninitialized: true,
    key: sessionKey,
    secret: sessionSecret
}));
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

var users = require('./routes/users');
var admin = require('./routes/admin');
var referee = require('./routes/referee');
var viewer = require('./routes/viewer');

app.use('/users', users);
app.use('/admin', admin);
app.use('/viewer', viewer);
app.use('/referee', referee);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

var Horse = require('./models/horse');
var server = https.createServer(options,app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log('User connected');

    socket.on('allowHorseToRating',function(data){
        io.sockets.emit('allowHorseToRating', data);
    });
    
    socket.on('startRateHorse',function(data){
        console.log(data);
        io.sockets.emit('startRateHorseReferee', data);
    });
    
    socket.on('markHorse', function(data){
        console.log('markHorse:');
        console.log(data);
        io.sockets.emit('markHorseToDb', data);
    });
    
    socket.on('results',function(data){
        console.log(data);
        io.sockets.emit('showResults', data);
    });
    
    socket.on('reminder',function(data){
        console.log('reminder data');
        console.log(data);
        io.sockets.emit('reminderReferee', data);
    });
    
    socket.on('stopCompetition',function(data){
        console.log('stopCompetition data');
        console.log(data);
        io.sockets.emit('stopCompetitionToReferee', data);
    });
    
    socket.on('startCompetition',function(data){
        console.log('reminder data');
        console.log(data);
        io.sockets.emit('startCompetitionReferee', data);
    });
    
    socket.on('partialMark',function(data){
        console.log('partialMark data');
        console.log(data);
        io.sockets.emit('partialMarkToDb', data);
    });
    
    socket.on('getGroup',function(data){
        console.log('getGroup data');
        console.log(data);
        io.sockets.emit('getGroupReferee', data);
    });
});

server.listen(3000, function () {
    console.log('Serwer pod adresem https://localhost:3000/');
});