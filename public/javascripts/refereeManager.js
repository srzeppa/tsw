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
	});
    
    socket.on('startRateHorseReferee', function(data) {
//        competition = data;
//        $('#horseToRateTable').empty();
//        var $table = $( "<table id=\"horsesToRateTable\" class='table table-hover'><thead><tr><th>Name</th><th>Typ</th><th>Głowa</th><th>Kłoda</th><th>Nogi</th><th>Ruch</th></tr></thead></table>" );
//        var $tbody = $("<tbody></tbody>");
//        refereesArray = [];
//        console.log('startCompetition listen');
//        console.log(data);
//        for (let i = 0; i < data.groups.length; i++){
//            refereesArray.push(data.groups[i].referees);
//        }
//        for(let i = 0; i < data.groups.length; i ++){
//            $.ajax({
//                type: 'GET',
//                url: "/referee/getGroupById/" + data.groups[i]._id + '/',
//                dataType: 'json',
//                success: function (e) {
//                    for(let j = 0; j < e.referees.length; j ++){
//                        if (userId == e.referees[j]._id){
//                            for(let k = 0; k < e.horses.length; k ++){
//                                var $line = $( "<tr></tr>" );
//                                $line.append( $( "<td id='"+e.horses[k]._id+"'></td>" ).html( e.horses[k].name ) );
//                                $tbody.append( $line );
//                                $table.append( $tbody );
//                            }
//                            break;
//                        }
//                    }
//                }
//            });
//        }
//        $table.appendTo( $( "#horseToRateTable" ) );
        
        $("<div class='row'><h4 class='text-center' style='color: black'>Type</h4><div class='col-lg-6 col-lg-push-3 col-md-8 col-md-push-2 col-sm-12 text-center'><input id='typeMark' class='rangeslider rangeslider-horizontal' type='range' min='0' max='20' step='2' value='0'/>  <div id='neck' class='btn btn-info'>0</div></div></div><div class='row'><h4 class='text-center' style='color: black'>Head</h4><div class='col-lg-6 col-lg-push-3 col-md-8 col-md-push-2 col-sm-12 text-center'><input id='headMark' class='rangeslider rangeslider-horizontal' type='range' min='0' max='20' step='2' value='0'/>  <div id='neck' class='btn btn-info'>0</div></div></div><div class='row'><h4 class='text-center' style='color: black'>Body</h4><div class='col-lg-6 col-lg-push-3 col-md-8 col-md-push-2 col-sm-12 text-center'><input id='bodyMark' class='rangeslider rangeslider-horizontal' type='range' min='0' max='20' step='2' value='0'/>  <div id='neck' class='btn btn-info'>0</div></div></div><div class='row'><h4 class='text-center' style='color: black'>Legs</h4><div class='col-lg-6 col-lg-push-3 col-md-8 col-md-push-2 col-sm-12 text-center'><input id='legsMark' class='rangeslider rangeslider-horizontal' type='range' min='0' max='20' step='2' value='0'/><div id='movementMark' class='btn btn-info'>0</div></div></div><div class='row'><h4 class='text-center' style='color: black'>Movement</h4><div class='col-lg-6 col-lg-push-3 col-md-8 col-md-push-2 col-sm-12 text-center'><input id='neck' class='rangeslider rangeslider-horizontal' type='range' min='0' max='20' step='2' value='0'/>  <div id='neck' class='btn btn-info'>0</div></div></div>").appendTo('#horseToRateTable');
	});
    
    socket.on('allowHorseToRating', function(data) {
        $('#' + data._id).parent().append($( "<td id='typeMark'></td>" ).html( "<input required='true' type='number' class='form-control'>" ));
        $('#' + data._id).parent().append($( "<td id='headMark'></td>" ).html( "<input required='true' type='number' class='form-control'>" ));
        $('#' + data._id).parent().append($( "<td id='bodyMark'></td>" ).html( "<input required='true' type='number' class='form-control'>" ));
        $('#' + data._id).parent().append($( "<td id='legsMark'></td>" ).html( "<input required='true' type='number' class='form-control'>" ));
        $('#' + data._id).parent().append($( "<td id='movementMark'></td>" ).html( "<input required='true' type='number' class='form-control'>" ));
        $('#' + data._id).parent().append($( "<td></td>" ).html( "<button id=\"markHorseButton\" class=\"btn btn-info\" idHorse="+ data._id +"> Mark </button>" ) );
	});
    
    $('#horseToRateTable').on('click', 'button#markHorseButton', function(){
        var result = 0;
        
        result = (parseInt($(this).closest('td').prevAll("td#typeMark").children('input').val()) + parseInt($(this).closest('td').prevAll("td#headMark").children('input').val()) + parseInt($(this).closest('td').prevAll("td#bodyMark").children('input').val()) + parseInt($(this).closest('td').prevAll("td#legsMark").children('input').val()) + parseInt($(this).closest('td').prevAll("td#movementMark").children('input').val()))/5;
        $(this).parent().parent().remove();
        
        socket.emit('markHorse', 
                    {result: result,
                     referee: userId,
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
    
    socket.on('reminderReferee',function(data){
        if(data == userId){
            alert('Send me marks please!!');
        }
    });
    
    socket.on('stopCompetitionToReferee', function(data){
        $('#horseToRateTable').empty();
    });
    
});