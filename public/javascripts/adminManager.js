/*jshint jquery: true, devel: true, esversion: 6, browser: true, node: true */

"use strict";

$( document ).ready(function() {
	console.log('admin.ejs');
    
    var refreshHorsesTable = function(){
    $.ajax({
        type: 'GET',
        url: '/admin/showHorses/',
        dataType: 'json',
        success: function(e){
            var arrayLength = e.horses.length;
            var $table = $( "<table id=\"horsesTable\"></table>" );
            for (let i = 0; i < arrayLength; i ++){
                var hor = e.horses[i];
                var $line = $( "<tr></tr>" );
                $line.append( $( "<td></td>" ).html( hor.name ) );
                $line.append( $( "<td></td>" ).html( hor.gender ) );
                $line.append( $( "<td></td>" ).html( hor.born ) );
                $line.append( $( "<td></td>" ).html( hor.owner ) );
                if(hor.activate === true){
                    $line.append( $( "<td> </td>" ).html( "<button id=\"activationHorseButton\" class=\"btn btn-danger\" idHorse="+ hor._id +"> Activation </button>" ) );
                } else {
                    $line.append( $( "<td> </td>" ).html( "<button id=\"activationHorseButton\" class=\"btn btn-success\" idHorse="+ hor._id +"> Activation </button>" ) );
                }
                $table.append( $line );
            }

            $table.appendTo( $( "#showAllHorses" ) );
            
            $('button#activationHorseButton').each(function(){
               $(this).click(function(){
                   if($(this).attr('class') == "btn btn-danger"){
                       $(this).val('value','Activate');
                       var button = $(this);
                       $.ajax({
                           type: 'GET',
                           url: '/admin/deactivateHorse/' + $( this ).attr('idHorse'),
                           success: function(e){
                               console.log('deactivated');
                           },
                           error: function(jqXHR, textStatus, errorThrown) {
                               console.log(textStatus, errorThrown);
                           }
                       });
                       $(this).attr('class', "btn btn-success");
                    } else {
                        $(this).val('value','Deactivate');   
                        $.ajax({
                            type: 'GET',
                            url: '/admin/activateHorse/' + $( this ).attr('idHorse'),
                            success: function(e){
                                console.log('activated');
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.log(textStatus, errorThrown);
                            }
                        });
                        $(this).attr('class', "btn btn-danger");
                    }
               });    
            });
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
    };
    refreshHorsesTable();
    
    $.ajax({
        type: 'GET',
        url: '/admin/showUsers/',
        dataType: 'json',
        success: function(e){
            var arrayLength = e.users.length;
            var $table = $( "<table id=\"usersTable\"></table>" );

            for (let i = 0; i < arrayLength; i ++){
                var us = e.users[i];
                var $line = $( "<tr></tr>" );
                $line.append( $( "<td> </td>" ).html( us.username ) );
                $line.append( $( "<td> </td>" ).html( us.email ) );
                $line.append( $( "<td> </td>" ).html( us.role ) );
                if(us.activate === true){
                    $line.append( $( "<td> </td>" ).html( "<button id=\"activationUserButton\" class=\"btn btn-danger\" idUser="+ us._id +"> Activation </button>" ) );
                } else {
                    $line.append( $( "<td> </td>" ).html( "<button id=\"activationUserButton\" class=\"btn btn-success\" idUser="+ us._id +"> Activation </button>" ) );
                }
                $table.append( $line );
            }

            $table.appendTo( $( "#showAllUsers" ) );
            
            $('button#activationUserButton').each(function(){
               $(this).click(function(){
                   if($(this).attr('class') == "btn btn-danger"){
                       $(this).val('value','Activate');
                       var button = $(this);
                       $.ajax({
                           type: 'GET',
                           url: '/admin/deactivateUser/' + $( this ).attr('idUser'),
                           success: function(e){
                               console.log('deactivated');
                           },
                           error: function(jqXHR, textStatus, errorThrown) {
                               console.log(textStatus, errorThrown);
                           }
                       });
                       $(this).attr('class', "btn btn-success");
                    } else {
                        $(this).val('value','Deactivate');   
                        $.ajax({
                            type: 'GET',
                            url: '/admin/activateUser/' + $( this ).attr('idUser'),
                            success: function(e){
                                console.log('activated');
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.log(textStatus, errorThrown);
                            }
                        });
                        $(this).attr('class', "btn btn-danger");
                    }
               });    
            });

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
    
    $('#activateUserButton').on('click', function(e){
        $.ajax({
            type: 'GET',
            url: '/admin/activateUser/:id/',
            success: function(e){
                console.log(e.msg);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    });
    
    $('#deactivateUserButton').on('click', function(e){
        $.ajax({
            type: 'GET',
            url: '/admin/deactivateUser/:id/',
            success: function(e){
                e.preventDefault();
                console.log(e.msg);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    });
    
    $('#activateHorseButton').on('click', function(e){
        $.ajax({
            type: 'GET',
            url: '/admin/activateHorse/:id/',
            success: function(e){
                console.log(e.msg);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    });
    
    $('#deactivateHorseButton').on('click', function(e){
        $.ajax({
            type: 'GET',
            url: '/admin/deactivateHorse/:id/',
            success: function(e){
                console.log(e.msg);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    });
    
    $('#addHorseButtonForm').on('click', function(e){
        console.log('addHorse clicked');
        $.ajax({
            type: 'GET',
            url: '/admin/addHorse/name/' + $('#horseName').val() + '/owner/' + $('#horseOwner').val() + '/gender/' + $('#horseName').val() + '/born/' + $('#horseBorn').val() + '/',
            success: function(e){
                $( "#showAllHorses" ).empty();
                refreshHorsesTable();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    });
    
    var z = function(){
        
    };
    
});




//https://codepen.io/ashblue/pen/mCtuA