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
                $line.append( $( "<td> </td>" ).html("<a id=\"deleteHorseByIdButton\" href = \"/admin/deletehorse/" + hor._id + "\"/ > Delete </a>") );
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
                $line.append( $( "<td> </td>" ).html("<a id=\"deleteUserByIdButton\" href = \"/admin/deleteuser/" + us._id + "\"/ > Delete </a>") );
                $table.append( $line );
            }

            $table.appendTo( $( "#showAllUsers" ) );

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
    
    $('#deleteUserByIdButton').on('click', function(e){
        $.ajax({
            type: 'GET',
            url: '/admin/deleteuser/:id/',
            success: function(e){
                console.log(e.msg);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    });
    
    $('#deleteHorseByIdButton').on('click', function(e){
        $.ajax({
            type: 'GET',
            url: '/admin/deletehorse/:id/',
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