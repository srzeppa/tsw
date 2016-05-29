/*jshint jquery: true, devel: true, esversion: 6, browser: true, node: true */

"use strict";

$( document ).ready(function() {
	console.log('admin.ejs');
    
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
                    $line.append( $( "<td> </td>" ).html("<a href=\"/admin/deactivateHorse/" + hor._id + "\"/ class=\"btn btn-danger\" role=\"button\" id=\"deactivateHorseButton\"> Deactivate </a>"  ) );
                } else {
                    $line.append( $( "<td> </td>" ).html("<a href=\"/admin/activateHorse/" + hor._id + "\"/ class=\"btn btn-success\" role=\"button\" id=\"activateHorseButton\"> Activate </a>"  ) );
                }
//                $line.append( $( "<td> </td>" ).html("<a id=\"deleteHorseByIdButton\" href = \"/admin/deletehorse/" + hor._id + "\"/ > Delete </a>") );
                $table.append( $line );
            }

            $table.appendTo( $( "#showAllHorses" ) );

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });

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
                    $line.append( $( "<td> </td>" ).html("<a href=\"/admin/deactivateUser/" + us._id + "\"/ class=\"btn btn-danger\" role=\"button\" id=\"deactivateUserButton\"> Deactivate </a>"  ) );
                } else {
                    $line.append( $( "<td> </td>" ).html("<a href=\"/admin/activateUser/" + us._id + "\"/ class=\"btn btn-success\" role=\"button\" id=\"activateUserButton\"> Activate </a>"  ) );
                }
                $table.append( $line );
            }

            $table.appendTo( $( "#showAllUsers" ) );

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
    
//    $('#deleteUserByIdButton').on('click', function(e){
//        $.ajax({
//            type: 'GET',
//            url: '/admin/deleteuser/:id/',
//            success: function(e){
//                console.log(e.msg);
//            },
//            error: function(jqXHR, textStatus, errorThrown) {
//                console.log(textStatus, errorThrown);
//            }
//        });
//    });
    
//    $('#deleteHorseByIdButton').on('click', function(e){
//        $.ajax({
//            type: 'GET',
//            url: '/admin/deletehorse/:id/',
//            success: function(e){
//                console.log(e.msg);
//            },
//            error: function(jqXHR, textStatus, errorThrown) {
//                console.log(textStatus, errorThrown);
//            }
//        });
//    });
    
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
    
});




//https://codepen.io/ashblue/pen/mCtuA