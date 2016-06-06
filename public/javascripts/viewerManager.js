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
            var $tbody = $("<tbody></tbody>");
            for(let i = 0; i < e.length; i ++){
                console.log(e[i].competition._id);
                if($('#' + e[i].competition._id).length){
                    var $line = $( "<tr></tr>" );
                    $line.append( $( "<td></td>" ).html( e[i].horse.name ) );
                    $line.append( $( "<td></td>" ).html( e[i].overall ) );
                    $line.appendTo( $( "#" + e[i].competition._id));
                } else {
                    var $title = $( "<h1>" + e[i].competition.name + "</h1>");
                    $title.appendTo( $( "#results" ) );
                    var $table = $( "<table id=\"" + e[i].competition._id + "\" class='table table-hover'><thead><tr><th>Name</th><th>Overall</th></tr></thead></table>" );
                    $table.appendTo( $( "#results" ) );
                    var $linee = $( "<tr></tr>" );
                    $linee.append( $( "<td></td>" ).html( e[i].horse.name ) );
                    $linee.append( $( "<td></td>" ).html( e[i].overall ) );
                    $linee.appendTo( $( "#" + e[i].competition._id));
                }
            }
        }
    });
    
    
    socket.on('showResults',function(data){
        console.log(data);
        
        $.ajax({
            type: 'GET',
            url: '/viewer/getHorseById/' + data.horse + '/',
            dataType: 'json',
            success: function(e){
                if($('#' + data.competition).length){
                    var $line = $( "<tr></tr>" );
                    $line.append( $( "<td></td>" ).html( e.name ) );
                    $line.append( $( "<td></td>" ).html( data.overall ) );
                    $line.appendTo( $( "#" + data.competition));
                } else {
                    $.ajax({
                        type: 'GET',
                        url: '/viewer/getCompetitionById/' + data.competition + '/',
                        dataType: 'json',
                        success: function(competition){
                            var $title = $( "<h1>" + competition.name + "</h1>");
                            $title.appendTo( $( "#results" ) );
                            var $table = $( "<table id=\"" + data.competition + "\" class='table table-hover'><thead><tr><th>Name</th><th>Overall</th></tr></thead></table>" );
                            $table.appendTo( $( "#results" ) );
                            var $linee = $( "<tr></tr>" );
                            $linee.append( $( "<td></td>" ).html( e.name ) );
                            $linee.append( $( "<td></td>" ).html( data.overall ) );
                            $linee.appendTo( $( "#" + data.competition));
                        }
                    });
                }
            }
        });
    });
});