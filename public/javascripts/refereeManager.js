/*jshint jquery: true, devel: true, esversion: 6, browser: true, node: true */
/*global io: false */
"use strict";
$( document ).ready(function() {
	console.log('referee.ejs');
    
    var socket = io.connect('https://localhost:3000');
    var test;

    socket.on('connect', function(data) {
		console.log(data);
	});
    
    socket.on('allowHorseToRating', function(data) {
		console.log(data);
        $('#test').append('data');
        $('#test').append(data.name);
	});
    
    socket.on('startCompetition', function(data) {
		console.log(data);
	});
    
    $.ajax({
        type: 'GET',
        url: '/referee/user_data',
        dataType: 'json',
        success: function(e){
            console.log(e.user._id);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
    
//    console.log('test');
//    console.log(req.user.id);
});