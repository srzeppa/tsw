/*jshint jquery: true, devel: true, esversion: 6, browser: true, node: true */
/*global io: false */
/*jshint loopfunc: true */

"use strict";
$( document ).ready(function() {
	console.log('referee.ejs');
    
    $('#head').prop( "disabled", true );
    $('#legs').prop( "disabled", true );
    $('#body').prop( "disabled", true );
    $('#movement').prop( "disabled", true );
    $('#neck').prop( "disabled", true );
    $('#markHorseButton').prop('disabled', true);
    
    var socket = io.connect('https://localhost:3000');
    var refereesArray = [];
    var competition;
    var group;
    var userId;

//    socket.on('connect', function(data) {
//	});
    
    socket.on('startCompetitionReferee', function(data) {
        competition = data;
        console.log('competition');
        console.log(competition);
        $.ajax({
            type: 'GET',
            url: "/referee/getPartialMarks/" + competition._id + '/',
            dataType: 'json',
            success: function (e) {
                console.log('getPartialMarks');
                console.log(e);
//                $('#head').val( e );
//                $('#legs').prop( "disabled", false );
//                $('#body').prop( "disabled", false );
//                $('#movement').prop( "disabled", false );
//                $('#neck').prop( "disabled", false );
            }
        });
	});
    
    socket.on('getGroupReferee', function(data) {
        group = data;
        console.log('group');
        console.log(group);
	});
    
    socket.on('startRateHorseReferee', function(data) {
        console.log('startRateHorseReferee');
        console.log(data);
        
            $.ajax({
                type: 'GET',
                url: "/referee/getGroupById/" + group + '/',
                dataType: 'json',
                success: function (e) {
                    for(let j = 0; j < e.referees.length; j ++){
                        console.log(e.referees[j]._id);
                        if(userId === e.referees[j]._id){
                            console.log('userId === e.referees[j]._id');
                            $('#horseToRate').html("<h1>" + data.horse._id + "</h1>");
                            $('#head').prop( "disabled", false ).val(0);
                            $('div#head').text(0);
                            $('#legs').prop( "disabled", false ).val(0);
                            $('div#legs').text(0);
                            $('#body').prop( "disabled", false ).val(0);
                            $('div#body').text(0);
                            $('#movement').prop( "disabled", false ).val(0);
                            $('div#movement').text(0);
                            $('#neck').prop( "disabled", false ).val(0);
                            $('div#neck').text(0);
                            $('#markHorseButton').prop('disabled', false).attr('idHorse', data.horse._id);
                            break;
                        }
                    }
                }
            });
	});
    
    socket.on('allowHorseToRating', function(data) {
        $('#' + data._id).parent().append($( "<td id='typeMark'></td>" ).html( "<input required='true' type='number' class='form-control'>" ));
        $('#' + data._id).parent().append($( "<td id='headMark'></td>" ).html( "<input required='true' type='number' class='form-control'>" ));
        $('#' + data._id).parent().append($( "<td id='bodyMark'></td>" ).html( "<input required='true' type='number' class='form-control'>" ));
        $('#' + data._id).parent().append($( "<td id='legsMark'></td>" ).html( "<input required='true' type='number' class='form-control'>" ));
        $('#' + data._id).parent().append($( "<td id='movementMark'></td>" ).html( "<input required='true' type='number' class='form-control'>" ));
        $('#' + data._id).parent().append($( "<td></td>" ).html( "<button id=\"markHorseButton\" class=\"btn btn-info\" idHorse="+ data._id +"> Mark </button>" ) );
	});
    
    $('button#markHorseButton').on('click', function(){
        var result = 0;
        
        result = (parseInt($('#head').val()) + parseInt($('#legs').val()) + parseInt($('#neck').val()) + parseInt($('#movement').val()) + parseInt($('#body').val()))/5;
        
        $.post( "/referee/mark/", {overall: result, competition: competition, horse: $(this).attr('idHorse'), referee: userId});
        
        socket.emit('results', {overall: result, competition: competition, horse: $(this).attr('idHorse'), referee: userId});
        
        $('#head').prop( "disabled", true );
        $('#legs').prop( "disabled", true );
        $('#body').prop( "disabled", true );
        $('#movement').prop( "disabled", true );
        $('#neck').prop( "disabled", true );
        $('#markHorseButton').prop('disabled', true);
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
            if(!($('#headMark').is(':disabled')))
            $('#headMarkDiv').css('border', '3px solid red'); 
            if(!($('#legsMark').is(':disabled')))
            $('#legsMarkDiv').css('border', '3px solid red'); 
            if(!($('#movementMark').is(':disabled')))
            $('#movementMarkDiv').css('border', '3px solid red'); 
            if(!($('#bodyMark').is(':disabled')))
            $('#bodyMarkDiv').css('border', '3px solid red'); 
            if(!($('#neckMark').is(':disabled')))
            $('#neckMarkDiv').css('border', '3px solid red'); 
        }
    });
    
    socket.on('stopCompetitionToReferee', function(data){
        $('#headMark').prop( "disabled", true );
        $('#legsMark').prop( "disabled", true );
        $('#bodyMark').prop( "disabled", true );
        $('#movementMark').prop( "disabled", true );
        $('#neckMark').prop( "disabled", true );
    });
    
    $('input[type=range]').each(function(){
        $(this).change(function(){
            var attr = $(this).attr('id');
            var value = $(this).val();
            $('div[id='+attr+']').text(value);
        });
    });
    
    $('input').each(function() {
        $(this).change(function() {
            if($(this).attr('id') == 'legs'){
                socket.emit('partialMark', {
                    referee: userId,
                    competition: competition,
                    legs: $(this).val(),
                    head: 0,
                    body: 0,
                    movement: 0,
                    neck: 0
                });
            }
            if($(this).attr('id') == 'head'){
                socket.emit('partialMark', {
                    referee: userId,
                    competition: competition,
                    head: $(this).val(),
                    legs: 0,
                    body: 0,
                    movement: 0,
                    neck: 0
                });
            }
            if($(this).attr('id') == 'body'){
                socket.emit('partialMark', {
                    referee: userId,
                    competition: competition,
                    body: $(this).val(),
                    head: 0,
                    legs: 0,
                    movement: 0,
                    neck: 0
                });
            }
            if($(this).attr('id') == 'movement'){
                socket.emit('partialMark', {
                    referee: userId,
                    competition: competition,
                    movement: $(this).val(),
                    head: 0,
                    legs: 0,
                    body: 0,
                    neck: 0
                });
            }
            if($(this).attr('id') == 'neck'){
                socket.emit('partialMark', {
                    referee: userId,
                    competition: competition,
                    neck: $(this).val(),
                    head: 0,
                    legs: 0,
                    body: 0,
                    movement: 0
                });
            }
        });
    });
    
});