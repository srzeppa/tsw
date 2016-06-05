/*jshint jquery: true, devel: true, esversion: 6, browser: true, node: true */
/*global io: false */
"use strict";

$( document ).ready(function() {
	console.log('viewer.ejs');
    
    var socket = io.connect('https://localhost:3000');
    
    $.ajax({
        type: 'GET',
        url: '/viewer/getAllResults/',
        dataType: 'json',
        success: function(e){
            console.log(e);
        }
    });
    
    socket.on('showResults',function(data){
        console.log(data);
    });
});