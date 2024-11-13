$(document).ready(function () {
    // Load user profile information on page load
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/connexion.html";
        return;
    }

    // Make an authenticated AJAX request
    $.ajax({
        url: "http://localhost:3000/api/user/profile",
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (data) {
            $('#name').val(data.name);
            $('#email').val(data.email);
        },
        error: function (error) {
            $('#profileMessage').text("Erreur lors du chargement des informations du profil.").addClass("text-danger");
            if (error.status === 401) {
                $('#profileMessage').text("Non autorisé. Veuillez vous connecter.");
            }
        }
    });

    // Event listener for updating profile information
    $('#updateProfile').click(function () {

        const updatedName = $('#name').val();
        const updatedEmail = $('#email').val();

        // Make an authenticated AJAX request to update profile data
        $.ajax({
            url: "http://localhost:3000/api/user/profile",
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            contentType: 'application/json',
            data: JSON.stringify({
                name: updatedName,
                email: updatedEmail
            }),
            success: function (response) {
                $('#profileMessage').text("Profil mis à jour avec succès.").removeClass("text-danger").addClass("text-success");
            },
            error: function (error) {
                console.error("Error details:", error);
                $('#profileMessage').text("Erreur lors de la mise à jour du profil.").removeClass("text-success").addClass("text-danger");
                if (error.status === 401) {
                    $('#profileMessage').text("Non autorisé. Veuillez vous connecter.");
                }
            }
        });
    });


    $('#showPasswordForm').click(function () {
        $('#passwordForm').slideToggle(300, function () {
            $('#showPasswordForm').text($(this).is(':visible') ? 'Annuler' : 'Changer le mot de passe');
        });
    });



    $('#logout').click(function() {
        // Remove the token from localStorage
        localStorage.removeItem('token');

        // Redirect to the login page
        window.location.href = 'connexion.html';
    });

});
