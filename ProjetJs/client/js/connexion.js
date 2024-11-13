$(document).ready(function () {
    // $("#login-form").submit(function (event) {
    //     event.preventDefault(); // Prevent the default form submission

    //     const email = $("#email").val();
    //     const password = $("#password").val();

    //     // Send the login data to the back-end route
    //     $.ajax({
    //         url: "http://localhost:3000/api/auth/login",
    //         method: "POST",
    //         contentType: "application/json",
    //         data: JSON.stringify({ email, password }),
    //         success: function (response) {                
    //             // Store the token in local storage for session management
    //             localStorage.setItem("token", response.token);
    //             window.location.href = "index.html";
    //         },
    //         error: function (error) {
    //             alert("Erreur de connexion: " + (error.responseJSON ? error.responseJSON.message : "Une erreur s'est produite"));
    //         }
    //     });
    // });

    $('#login-form').submit(function(event) {
        event.preventDefault();

        const email = $('#email').val();
        const password = $('#password').val();

        // Get the IP address and proceed with the login request
        getIPAddress(function(ipAddress) {
            if (ipAddress) {
                // Perform the login request with the IP address included
                $.ajax({
                            url: "http://localhost:3000/api/auth/login",
                            method: "POST",
                            contentType: "application/json",
                            data: JSON.stringify({ email, password, ipAddress }),
                            success: function (response) {                
                                // Store the token in local storage for session management
                                localStorage.setItem("token", response.token);
                                window.location.href = "index.html";
                            },
                            error: function (error) {
                                alert("Erreur de connexion: " + (error.responseJSON ? error.responseJSON.message : "Une erreur s'est produite"));
                            }
                        });
                
            } else {
                alert("Impossible de récupérer l'adresse IP.");
            }
        });
    });

    function getIPAddress(callback) {
        $.ajax({
            url: 'https://api.ipify.org?format=json',
            method: 'GET',
            success: function(data) {
                callback(data.ip);
            },
            error: function(error) {
                console.error('Error fetching IP address:', error);
                callback(null);
            }
        });
    }

});



