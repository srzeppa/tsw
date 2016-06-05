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
            var $table = $( "<table id=\"competitionsViewTable\" class='table table-hover'><thead><tr><th>Name</th><th>Overall</th></tr></thead></table>" );
            var $tbody = $("<tbody></tbody>");
            for(let i = 0; i < e.length; i ++){
                console.log(e[i].horse.name);
                var $line = $( "<tr></tr>" );
                $line.append( $( "<td></td>" ).html( e[i].horse.name ) );
                $line.append( $( "<td></td>" ).html( e[i].overall ) );
                $tbody.append( $line );
                $table.append( $tbody );
            }
            $table.appendTo( $( "#results" ) );
        }
    });
    
    
    socket.on('showResults',function(data){
        console.log(data);
    });
});