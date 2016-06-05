/*jshint jquery: true, devel: true, esversion: 6, browser: true, node: true */
/*global io: false */
/*jshint loopfunc: true */

"use strict";
$( document ).ready(function() {
	console.log('referee.ejs');
    
    var socket = io.connect('https://localhost:3000');
    var refereesArray = [];
    var competition;
    var userId;

    socket.on('connect', function(data) {
//		console.log(data);
	});
    
    socket.on('startCompetition', function(data) {
        competition = data;
        $('#horseToRateTable').empty();
        var $table = $( "<table id=\"horsesToRateTable\" class='table table-hover'><thead><tr><th>Name</th><th>Typ</th><th>Głowa</th><th>Kłoda</th><th>Nogi</th><th>Ruch</th></tr></thead></table>" );
        var $tbody = $("<tbody></tbody>");
        refereesArray = [];
        console.log('startCompetition listen');
        console.log(data);
        for (let i = 0; i < data.groups.length; i++){
            refereesArray.push(data.groups[i].referees);
        }
        for(let i = 0; i < data.groups.length; i ++){
            $.ajax({
                type: 'GET',
                url: "/referee/getGroupById/" + data.groups[i]._id + '/',
                dataType: 'json',
                success: function (e) {
                    for(let j = 0; j < e.referees.length; j ++){
                        if (userId == e.referees[j]._id){
                            for(let k = 0; k < e.horses.length; k ++){
                                var $line = $( "<tr></tr>" );
                                $line.append( $( "<td id='"+e.horses[k]._id+"'></td>" ).html( e.horses[k].name ) );
                                $tbody.append( $line );
                                $table.append( $tbody );
                            }
                            break;
                        }
                    }
                }
            });
        }
        $table.appendTo( $( "#horseToRateTable" ) );
	});
    
    socket.on('allowHorseToRating', function(data) {
        console.log('allowHorseToRating');
        $('#' + data._id).parent().append($( "<td id='typMark'></td>" ).html( "<input required='true' type='number' class='form-control'>" ));
        $('#' + data._id).parent().append($( "<td id='glowaMark'></td>" ).html( "<input required='true' type='number' class='form-control'>" ));
        $('#' + data._id).parent().append($( "<td id='klodaMark'></td>" ).html( "<input required='true' type='number' class='form-control'>" ));
        $('#' + data._id).parent().append($( "<td id='nogiMark'></td>" ).html( "<input required='true' type='number' class='form-control'>" ));
        $('#' + data._id).parent().append($( "<td id='ruchMark'></td>" ).html( "<input required='true' type='number' class='form-control'>" ));
        $('#' + data._id).parent().append($( "<td></td>" ).html( "<button id=\"markHorseButton\" class=\"btn btn-info\" idHorse="+ data._id +"> Mark </button>" ) );
	});
    
    $('#horseToRateTable').on('click', 'button#markHorseButton', function(){
        var result = 0;
        
        console.log("$('#markHorseButton').parent().closest().parseInt($('#typMark').val())");
        console.log($(this).closest('td').prevAll("td#nogiMark").children('input').val());
        
        result = (parseInt($(this).closest('td').prevAll("td#typMark").children('input').val()) + parseInt($(this).closest('td').prevAll("td#glowaMark").children('input').val()) + parseInt($(this).closest('td').prevAll("td#klodaMark").children('input').val()) + parseInt($(this).closest('td').prevAll("td#nogiMark").children('input').val()) + parseInt($(this).closest('td').prevAll("td#ruchMark").children('input').val()))/5;
        console.log('result');
        console.log(result);
        
        socket.emit('markHorse', 
                    {result: result,
                     competition: competition._id,
                     horse: $(this).attr('idHorse')
                    });
    });
    
    
    $.ajax({
        type: 'GET',
        url: '/referee/user_data',
        dataType: 'json',
        success: function(e){
            console.log(e.user._id);
            userId = e.user._id;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
    
});