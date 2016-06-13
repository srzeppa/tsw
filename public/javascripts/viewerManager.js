/*jshint jquery: true, devel: true, esversion: 6, browser: true, node: true */
/*global io: false */
"use strict";

$(document).ready(function() {
    console.log('viewer.ejs');

    console.log(location);
    
    var socket = io.connect(location.host);
//    var socket = io.connect('https://10.10.4.25:3000');
    alert = function() {};

    $.ajax({
        type: 'GET',
        url: '/viewer/getAllResults/',
        dataType: 'json',
        success: function(e) {
            console.log(e);
            var $tbody = $("<tbody></tbody>");
            for (let i = 0; i < e.length; i++) {
                if ($('#' + e[i].competition._id).length) {
                    if ($('#' + e[i].competition._id + e[i].horse._id).length) {
                        var value = parseFloat($('#' + e[i].competition._id + e[i].horse._id).next().text());
                        value = (e[i].overall + value) / 2;
                        var next = $('#' + e[i].competition._id + e[i].horse._id).next().text(value);
                    } else {
                        var $line = $("<tr></tr>");
                        $line.append($("<td id='" + e[i].competition._id + e[i].horse._id + "'></td>").html(e[i].horse.name));
                        $line.append($("<td></td>").html(Math.round((e[i].overall) * 100) / 100));
                        $line.append($("<td> </td>").html("<button id=\"statsButton\" class=\"btn btn-success\" idHorse=" + e[i].horse._id + " type='button' data-toggle='collapse' data-target='#stats' aria-expanded='false' aria-controls='collapseExample'> Stats </button>"));
                        $line.appendTo($("#" + e[i].competition._id));
                    }
                } else {
                    var $title = $("<h1>" + e[i].competition.name + "</h1>");
                    $title.appendTo($("#results"));
                    var $table = $("<table id=\"" + e[i].competition._id + "\" class='table table-hover tablesorter'><thead><tr><th>Name</th><th>Overall</th><th>Stats</th></tr></thead></table>");
                    $table.appendTo($("#results"));
                    var $linee = $("<tr></tr>");
                    $linee.append($("<td id='" + e[i].competition._id + e[i].horse._id + "'></td>").html(e[i].horse.name));
                    $linee.append($("<td></td>").html(Math.round((e[i].overall) * 100) / 100));
                    $linee.append($("<td> </td>").html("<button id=\"statsButton\" class=\"btn btn-success\" idHorse=" + e[i].horse._id + " type='button' data-toggle='collapse' data-target='#stats' aria-expanded='false' aria-controls='collapseExample'> Stats </button>"));
                    $linee.appendTo($("#" + e[i].competition._id));
                }
                $('#' + e[i].competition._id).DataTable( {
                    "pagingType": "full_numbers",
                    searching: false
                } );
//                $("#results").children().tablesorter({sortList: [[1,1]]});
            }
        }
    });


    socket.on('showResults', function(data) {
        console.log('showresults');
        console.log(data);

        $.ajax({
            type: 'GET',
            url: '/viewer/getHorseById/' + data.horse + '/',
            dataType: 'json',
            success: function(e) {
                if ($('#' + data.competition._id).length) {
                    if ($('#' + data.competition._id + e._id).length) {
                        var value = parseFloat($('#' + data.competition._id + e._id).next().text());
                        value = (data.overall + value) / 2;
                        var next = $('#' + data.competition._id + e._id).next().text(value);
                    } else {
                        var $line = $("<tr></tr>");
                        $line.append($("<td id='" + data.competition._id + e._id + "'></td>").html(e.name));
                        $line.append($("<td></td>").html(Math.round((data.overall) * 100) / 100));
                        $line.append($("<td> </td>").html("<button id=\"statsButton\" class=\"btn btn-success\" idHorse=" + e._id + " type='button' data-toggle='collapse' data-target='#stats' aria-expanded='false' aria-controls='collapseExample'> Stats </button>"));
                        $line.appendTo($("#" + data.competition._id));
                    }
                } else {
                    console.log('else');
                    $.ajax({
                        type: 'GET',
                        url: '/viewer/getCompetitionById/' + data.competition._id + '/',
                        dataType: 'json',
                        success: function(competition) {
                            var $title = $("<h1>" + competition.name + "</h1>");
                            $title.appendTo($("#results"));
                            var $table = $("<table id=\"" + data.competition._id + "\" class='table table-hover tablesorter'><thead><tr><th>Name</th><th>Overall</th><th>Stats</th></tr></thead></table>");
                            $table.appendTo($("#results"));
                            var $linee = $("<tr></tr>");
                            $linee.append($("<td id='" + data.competition._id + e._id + "'></td>").html(e.name));
                            $linee.append($("<td></td>").html(data.overall));
                            $linee.append($("<td> </td>").html("<button id=\"statsButton\" class=\"btn btn-success\" idHorse=" + e._id + " type='button' data-toggle='collapse' data-target='#stats' aria-expanded='false' aria-controls='collapseExample'> Stats </button>"));
                            $linee.appendTo($("#" + data.competition._id));
                        }
                    });
                }
//                $("#results").children().tablesorter({sortList: [[1,1]]});
            }
        });
    });
    
    $('#results').on('click', 'button#statsButton', function() {
        console.log('statsButton clicked');
        $.ajax({
            type: 'GET',
            url: '/viewer/getAllResultsHorseById/' + $(this).attr('idHorse') + '/',
            dataType: 'json',
            success: function(e) {
                var $line;
                console.log(e);
                $('#statsDiv').html('<h3>' + e[0].horse.name + '</h3>');
                var $table = $("<table class='table table-hover tablesorter'><thead><tr><th>Competition</th><th>Overall</th></tr></thead></table>");
                
                for(let i = 0; i < e.length; i ++) {
                    if($('#' + e[i].competition.name).length){
                        var value = parseFloat($('#' + e[i].competition.name).next().text());
                        value = (e[i].overall + value) / 2;
                        var next = $('#' + e[i].competition.name).next().text(value);
                    } else {
                        $table.appendTo($("#results"));
                        var $linee = $("<tr></tr>");
                        $linee.append($("<td id='" + e[i].competition.name + "'></td>").html(e[i].competition.name));
                        $linee.append($("<td></td>").html(e[i].overall));
                        $linee.appendTo($($table));
                    }
                }
                
                $table.appendTo($('#statsDiv'));
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    });
    
    $('#championsButton').click(function(){
        console.log('champions clicked');
        $.ajax({
            type: 'GET',
            url: '/viewer/getAllResults/',
            dataType: 'json',
            success: function(e) {
                console.log(e);
                var $table = $("<table id='championsTable' class='table table-hover tablesorter'><thead><tr><th>Name</th><th>Overall</th></tr></thead></table>");
                $("#championsDiv").html($table);
                for (let i = 0; i < e.length; i ++) {
                    if($('#' + e[i].horse._id + 'champions').length){
                        var value = parseFloat($('#' + e[i].horse._id + "champions").next().text());
                        console.log(e[i].horse.name);
                        console.log(value);
                        value = (e[i].overall + value) / 2;
                        var next = $('#' + e[i].horse._id + "champions").next().text(value);
                    } else {
                        var $linee = $("<tr></tr>");
                        $linee.append($("<td id='" + e[i].horse._id + "champions'></td>").html(e[i].horse.name));
                        $linee.append($("<td></td>").html(e[i].overall));
                        $linee.appendTo($("#championsTable"));
                    }
//                    $linee.appendTo($('#championsTable'));
                }
            }
        });
    });
});