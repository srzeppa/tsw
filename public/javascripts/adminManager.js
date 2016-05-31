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
            var loop = 0;
            for (let i = 0; i < arrayLength; i ++){
                loop++;
                var hor = e.horses[i];
                var $line = $( "<tr></tr>" );
                $line.append( $( "<td></td>" ).html( hor.name ) );
                $line.append( $( "<td></td>" ).html( hor.gender ) );
                $line.append( $( "<td></td>" ).html( hor.born ) );
                $line.append( $( "<td></td>" ).html( hor.owner ) );
                if(hor.activate === true){
//                    data-text-swap=\"Activate\"
                    $line.append( $( "<td> </td>" ).html( "<button id=\"activationHorseButton\" class=\"btn btn-danger\" idHorse="+ hor._id +"> Activation </button>" ) );
                } else {
//                    data-text-swap=\"Activate\"
                    $line.append( $( "<td> </td>" ).html( "<button id=\"activationHorseButton\" class=\"btn btn-success\" idHorse="+ hor._id +"> Activation </button>" ) );
                }
                $table.append( $line );
            }

            $table.appendTo( $( "#showAllHorses" ) );
            
            $('button#activationHorseButton').each(function(){
               console.log('chuj') ;
               console.log(this);
               $(this).click(function(){
                   if($(this).attr('class') == "btn btn-danger"){
                       console.log(this);
                       $(this).val('value','Activate');
                       var button = $(this);
                       $.ajax({
                           type: 'GET',
                           url: '/admin/deactivateHorse/' + $( this ).attr('idHorse'),
                           success: function(e){
                               console.log('deactivated');
//                               if(button.text() == button.data("text-swap")){
//                                   button.text(button.data("text-original"));
//                               } else {
//                                   button.data("text-original", button.text());
//                                   button.text(button.data("text-swap"));
//                               }
                           },
                           error: function(jqXHR, textStatus, errorThrown) {
                               console.log(textStatus, errorThrown);
                           }
                       });
                       $(this).attr('class', "btn btn-success");
                    } else {
                        console.log(this);
                        $(this).val('value','Deactivate');   
                        $.ajax({
                            type: 'GET',
                            url: '/admin/activateHorse/' + $( this ).attr('idHorse'),
                            success: function(e){
                                console.log('activated');
//                                if($(this).text() == $(this).data("text-swap")){
//                                    $(this).text($(this).data("text-original"));
//                                } else {
//                                    $(this).data("text-original", $(this).text());
//                                    $(this).text($(this).data("text-swap"));
//                                }
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
    
    
    
    
    
    
//    $( document ).change(function() {
//        $('#activationHorseButton').each(function() {
//            $(this).click(function(){
//                console.log('clicked');
//                if($(this).attr('class') == "btn btn-danger"){
//                    console.log(this);
//                    $.ajax({
//                        type: 'GET',
//                        url: '/admin/deactivateHorse/' + $( this ).attr('idHorse'),
//                        success: function(e){
//                            console.log('deactivated');
//                        },
//                        error: function(jqXHR, textStatus, errorThrown) {
//                            console.log(textStatus, errorThrown);
//                        }
//                    });
//                    $(this).attr('class', "btn btn-success");
//                } else {
//                    console.log(this);
//                    $.ajax({
//                        type: 'GET',
//                        url: '/admin/activateHorse/' + $( this ).attr('idHorse'),
//                        success: function(e){
//                            console.log('activated');
//                        },
//                        error: function(jqXHR, textStatus, errorThrown) {
//                            console.log(textStatus, errorThrown);
//                        }
//                    });
//                    $(this).attr('class', "btn btn-danger");
//                }
//            });
//        });
//    });
    
//    $('#activationHorseButton').click(activationHorseButtonFunction);
    
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