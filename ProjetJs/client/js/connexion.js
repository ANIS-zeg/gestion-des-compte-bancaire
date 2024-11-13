$(document).ready(function () {
    $("#login-form").submit(function (event) {
        event.preventDefault(); // Prevent the default form submission

        const email = $("#email").val();
        const password = $("#password").val();

        // Send the login data to the back-end route
        $.ajax({
            url: "http://localhost:3000/api/auth/login",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ email, password }),
            success: function (response) {
                alert(response.message);
                
                // Store the token in local storage for session management
                localStorage.setItem("token", response.token);

                // Redirect to the dashboard (index.html) after successful login
                window.location.href = "index.html";
            },
            error: function (error) {
                alert("Erreur de connexion: " + error.responseJSON.message);
            }
        });
    });
});

$(document).ready(function () {
    // Check if the user is logged in by verifying the presence of a token
    const token = localStorage.getItem("token");

    if (!token) {
        // Redirect to the login page if not logged in
        window.location.href = "connexion.html";
    } else {
        // Optionally, you could send a request to verify the token on the server side
        $.ajax({
            url: "http://localhost:3000/api/user/profile",
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            success: function (response) {
                // Display user information on the dashboard if needed
                console.log("User profile:", response);
            },
            error: function () {
                // If token verification fails, remove it and redirect to login
                localStorage.removeItem("token");
                window.location.href = "connexion.html";
            }
        });
    }
});

