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

    // Event listener for updating password
    $('#updateProfile').click(function () {
        const token = localStorage.getItem("token");

        // Retrieve updated values from the input fields
        const updatedName = $('#name').val();
        const updatedEmail = $('#email').val();

        // Prepare data for profile update
        const profileData = {
            name: updatedName,
            email: updatedEmail
        };

        // Check if the password change form is visible and gather password fields if needed
        if ($('#passwordForm').is(':visible')) {
            const currentPassword = $('#currentPassword').val();
            const newPassword = $('#newPassword').val();
            const confirmPassword = $('#confirmPassword').val();

            // Validate passwords
            if (!currentPassword || !newPassword || !confirmPassword) {
                $('#profileMessage').text("Veuillez remplir tous les champs du mot de passe.").addClass("text-danger");
                return;
            }
            if (newPassword !== confirmPassword) {
                $('#profileMessage').text("Les nouveaux mots de passe ne correspondent pas.").addClass("text-danger");
                return;
            }

            // Add password data to profile update if password fields are filled
            profileData.currentPassword = currentPassword;
            profileData.newPassword = newPassword;
        }

        // Make an authenticated AJAX request to update profile data
        $.ajax({
            url: "http://localhost:3000/api/user/profile",
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            contentType: 'application/json',
            data: JSON.stringify(profileData),
            success: function (response) {
                $('#profileMessage').text("Profil mis à jour avec succès.").removeClass("text-danger").addClass("text-success");
                // Clear password fields after successful update
                $('#currentPassword, #newPassword, #confirmPassword').val('');
                $('#passwordForm').slideUp(300);  // Hide the password form after update
                $('#showPasswordForm').text("Changer le mot de passe");
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

    $.ajax({
        url: 'http://localhost:3000/api/user/connection-history', 
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function(response) {
            const connectionTableBody = $('.table.table-striped tbody');
            connectionTableBody.empty();

            if (response.history && response.history.length > 0) {
                response.history.forEach(entry => {
                    const loginDate = new Date(entry.login_date);
                    const formattedDate = loginDate.toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    const formattedTime = loginDate.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    connectionTableBody.append(`
                        <tr>
                            <td>${formattedDate} à ${formattedTime}</td>
                            <td>${entry.ip_address}</td>
                        </tr>
                    `);
                });
            } else {
                connectionTableBody.append('<tr><td colspan="2" class="text-center">Aucune connexion trouvée.</td></tr>');
            }
        },
        error: function(error) {
            console.error('Erreur lors de la récupération de l\'historique des connexions :', error);
            $('.table.table-striped tbody').html('<tr><td colspan="2" class="text-danger text-center">Erreur de chargement.</td></tr>');
        }
    });
    
    $('#logout').click(function () {
        localStorage.removeItem('token');
        window.location.href = 'connexion.html';
    });

});
