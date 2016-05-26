/*jshint jquery: true, devel: true, esversion: 6, browser: true, node: true */

"use strict";

$( document ).ready(function() {
	console.log('admin.ejs');
    $('#addHorseButton').on('click', function(e){
        console.log('chuj');
        $.ajax({
            type: 'GET',
            url: '/admin/showHorses/',
            dataType: 'json',
            success: function(e){
                var arrayLength = e.horses.length;
                var $table = $( "<table></table>" );
                
                for (let i = 0; i < arrayLength; i ++){
                    var hor = e.horses[i];
                    var $line = $( "<tr></tr>" );
                    $line.append( $( "<td></td>" ).html( hor.name ) );
                    $line.append( $( "<td></td>" ).html( hor.gender ) );
                    $line.append( $( "<td></td>" ).html( hor.born ) );
                    $line.append( $( "<td></td>" ).html( hor.owner ) );
                    $table.append( $line );
                }
                
                $table.appendTo( $( "#showAllHorses" ) );
                
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    });
});