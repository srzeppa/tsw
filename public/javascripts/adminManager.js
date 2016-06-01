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
                    $line.append( $( "<td> </td>" ).html( "<button id=\"editHorseButton\" class=\"btn btn-warning\" idHorse="+ hor._id +"> Edit </button>" ) );
                    $table.append( $line );
                }

                $table.appendTo( $( "#showAllHorses" ) );

                $('button#editHorseButton').each(function(){
                   $(this).click(function(){
                       console.log(this);
                       var $form;
                       
                       $( $("<div id='editHorseDiv'><input id='horseNameEdit' type='text' name='name' placeholder='Name' required='required' autofocus='autofocus' class='form-control'/><select id='horseGenderEdit' class='form-control' name='gender'><option value='male'>male</option><option value='female'>female</option></select><input id='horseOwnerEdit' type='text' name='owner' placeholder='Owner' required='required' autofocus='autofocus' class='form-control'/><input id='horseBornEdit' type='text' name='born' placeholder='Born' required='required' autofocus='autofocus' class='form-control'/><button id='editHorseButtonSubmit' type='submit' class='btn btn-lg btn-success btn-block'>Edit</button><span class='clearfix'></span></div>")).insertAfter( "#horsesTable" );
                       
                       var idHorse = $( this ).attr('idHorse');
                       
                       $.ajax({
                           type: 'GET',
                           url: '/admin/getHorseById/' + $( this ).attr('idHorse') + '/',
                           dataType: 'json',
                           success: function(e){
                               console.log(e);

                               document.getElementById("horseNameEdit").value = e.name;
                               document.getElementById("horseOwnerEdit").value = e.owner;
                               document.getElementById("horseBornEdit").value = e.born;
                               document.getElementById("horseGenderEdit").value = e.gender;
                           },
                           error: function(jqXHR, textStatus, errorThrown) {
                               console.log(textStatus, errorThrown);
                           }
                       });
                       
                       $('#editHorseButtonSubmit').click(function(){
                           $.ajax({
                               type: 'GET',
                               url: '/admin/edithorse/' + idHorse + '/name/' + $('#horseNameEdit').val() + '/owner/' + $('#horseOwnerEdit').val() + '/gender/' + $('#horseGenderEdit').val() + '/born/' + $('#horseBornEdit').val() + '/',
                               success: function(e){
                                   console.log('editHorseclicked');
                                   $( "#showAllHorses" ).empty();
                                   $( "#editHorseDiv" ).empty();
                                   refreshHorsesTable();
                               },
                               error: function(jqXHR, textStatus, errorThrown) {
                                   console.log(textStatus, errorThrown);
                               }
                           });
                       });
                   });
                });
                                                       
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
    
    var refreshUsersTable = function(){
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
                    $line.append( $( "<td> </td>" ).html( "<button id=\"editUserButton\" class=\"btn btn-warning\" idUser="+ us._id +"> Edit </button>" ) );
                    $table.append( $line );
                }

                $table.appendTo( $( "#showAllUsers" ) );
                
                $('button#editUserButton').each(function(){
                   $(this).click(function(){
                       console.log(this);
                       var $form;
                       
                       $( $("<div id='editUserDiv'><input id='userUsernameEdit' type='text' name='username' placeholder='Username' required='required' autofocus='autofocus' class='form-control'/><input id='userPasswordEdit' type='password' name='password' placeholder='Password' required='required' class='form-control nomargin'/><input id='userEmailEdit' type='email' name='email' placeholder='Email' required='required' class='form-control'/><input id='userFirstnameEdit' type='text' name='firstName' placeholder='First Name' required='required' class='form-control'/><input id='userLastnameEdit' type='text' name='lastName' placeholder='Last Name' required='required' class='form-control'/><select id='userRoleEdit' class='form-control' name='role'><option value='referee'>Referee</option><option value='admin'>Admin</option></select><button id='editUserButtonFormSubmit' type='submit' class='btn btn-lg btn-success btn-block'>Edit user</button><span class='clearfix'></span></div>")).insertAfter( "#usersTable" );
                       
                       var idUser = $( this ).attr('idUser');
                       
                       console.log('idUser');
                       console.log(idUser);
                       
                       $.ajax({
                           type: 'GET',
                           url: '/admin/getUserById/' + $( this ).attr('idUser') + '/',
                           dataType: 'json',
                           success: function(e){
                               console.log(e);

                               document.getElementById("userUsernameEdit").value = e.username;
                               document.getElementById("userPasswordEdit").value = e.password;
                               document.getElementById("userEmailEdit").value = e.email;
                               document.getElementById("userFirstnameEdit").value = e.firstname;
                               document.getElementById("userLastnameEdit").value = e.lastname;
                               document.getElementById("userRoleEdit").value = e.role;
                           },
                           error: function(jqXHR, textStatus, errorThrown) {
                               console.log(textStatus, errorThrown);
                           }
                       });
                       
                       $('#editUserButtonFormSubmit').click(function(){
                           console.log('clicked editUserButtonFormSubmit');
                           $.ajax({
                               type: 'GET',
                               url: '/admin/editUser/' + idUser + '/username/' + $('#userUsernameEdit').val() + '/password/' + $('#userPasswordEdit').val() + '/email/' + $('#userEmailEdit').val() + '/firstname/' + $('#userFirstnameEdit').val() + '/lastname/' + $('#userLastnameEdit').val() + '/role/' + $('#userRoleEdit').val() + '/',
                               success: function(e){
                                   console.log('editUser clicked');
                                   $( "#showAllUsers" ).empty();
                                   $( "#editUserDiv" ).empty();
                                   refreshUsersTable();
                               },
                               error: function(jqXHR, textStatus, errorThrown) {
                                   console.log(textStatus, errorThrown);
                               }
                           });
                       });
                   });
                });

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
    };
    refreshUsersTable();
    
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
    
    $('#addUserButtonForm').on('click', function(e){
        console.log('addUser clicked');
        $.ajax({
            type: 'GET',
            url: '/admin/addUser/username/' + $('#userUsername').val() + '/password/' + $('#userPassword').val() + '/email/' + $('#userEmail').val() + '/role/' + $('#userRole').val() + '/firstname/' + $('#userFirstname').val() + '/lastname/' + $('#userLastname').val() + '/',
            success: function(e){
                $( "#showAllUsers" ).empty();
                refreshUsersTable();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    });
    
});

//https://codepen.io/ashblue/pen/mCtuA