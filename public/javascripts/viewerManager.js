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
            var $tbody = $("<tbody></tbody>");
            for(let i = 0; i < e.length; i ++){
                console.log(e[i].competition._id);
                if($('#' + e[i].competition._id).length){
                    var $line = $( "<tr></tr>" );
                    $line.append( $( "<td></td>" ).html( e[i].horse.name ) );
                    $line.append( $( "<td></td>" ).html( Math.round((e[i].overall) * 100 )/100 ));
                    $line.appendTo( $( "#" + e[i].competition._id));
                } else {
                    var $title = $( "<h1>" + e[i].competition.name + "</h1>");
                    $title.appendTo( $( "#results" ) );
                    var $table = $( "<table id=\"" + e[i].competition._id + "\" class='table table-hover tablesorter'><thead><tr><th>Name</th><th>Overall</th></tr></thead></table>" );
                    $table.appendTo( $( "#results" ) );
                    var $linee = $( "<tr></tr>" );
                    $linee.append( $( "<td></td>" ).html( e[i].horse.name ) );
                    $linee.append( $( "<td></td>" ).html( Math.round((e[i].overall) * 100) /100) );
                    $linee.appendTo( $( "#" + e[i].competition._id));
                }
            }
            $("#results").children().tablesorter();
        }
    });
    
    
    socket.on('showResults',function(data){
        console.log('showresults');
        console.log(data);
        
        $.ajax({
            type: 'GET',
            url: '/viewer/getHorseById/' + data.horse + '/',
            dataType: 'json',
            success: function(e){
                if($('#' + data.competition._id).length){
                    console.log('if');
                    var $line = $( "<tr></tr>" );
                    $line.append( $( "<td></td>" ).html( e.name ) );
                    $line.append( $( "<td></td>" ).html( data.overall ) );
                    $line.appendTo( $( "#" + data.competition._id));
                } else {
                    console.log('else');
                    $.ajax({
                        type: 'GET',
                        url: '/viewer/getCompetitionById/' + data.competition._id + '/',
                        dataType: 'json',
                        success: function(competition){
                            console.log('else1');
                            var $title = $( "<h1>" + competition.name + "</h1>");
                            console.log('else2');
                            $title.appendTo( $( "#results" ) );
                            console.log('else3');
                            var $table = $( "<table id=\"" + data.competition._id + "\" class='table table-hover tablesorter'><thead><tr><th>Name</th><th>Overall</th></tr></thead></table>" );
                            console.log('else4');
                            $table.appendTo( $( "#results" ) );
                            console.log('else5');
                            var $linee = $( "<tr></tr>" );
                            console.log('else6');
                            $linee.append( $( "<td></td>" ).html( e.name ) );
                            console.log('else7');
                            $linee.append( $( "<td></td>" ).html( data.overall ) );
                            console.log('else8');
                            $linee.appendTo( $( "#" + data.competition._id));
                            console.log('else9');
                        }
                    });
                    $("#results").children().tablesorter();
                }
            }
        });
    });
});