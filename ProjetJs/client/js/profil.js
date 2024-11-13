$(document).ready(function() {
    // Load user profile information on page load
    $.ajax({
        url: '/user/profile',  // Ensure this matches your backend route
        method: 'GET',
        success: function(data) {
            $('#name').val(data.name);
            $('#email').val(data.email);
        },
        error: function(error) {
            $('#profileMessage').text("Erreur lors du chargement des informations du profil.").addClass("text-danger");
        }
    });

    // Show/hide password change form with smooth toggle and text change
    $('#showPasswordForm').click(function() {
        $('#passwordForm').slideToggle(300, function() {
            // Update button text based on visibility after toggle completes
            $('#showPasswordForm').text($(this).is(':visible') ? 'Annuler' : 'Changer le mot de passe');
        });
    });


    // Update user profile information
    $('#updateProfile').click(function() {
        const name = $('#name').val();
        const email = $('#email').val();
        const phone = $('#phone').val();
        const address = $('#address').val();

        // Password fields
        const currentPassword = $('#currentPassword').val();
        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();

        // Validate password fields if the password section is visible
        if ($('#passwordForm').is(':visible')) {
            if (!currentPassword || !newPassword || !confirmPassword) {
                $('#profileMessage').text("Veuillez remplir tous les champs du mot de passe.").addClass("text-danger");
                return;
            }
            if (newPassword !== confirmPassword) {
                $('#profileMessage').text("Les nouveaux mots de passe ne correspondent pas.").addClass("text-danger");
                return;
            }
        }

        // Prepare data to send
        const data = { name, email, phone, address };
        if ($('#passwordForm').is(':visible')) {
            data.currentPassword = currentPassword;
            data.newPassword = newPassword;
        }

        $.ajax({
            url: '/user/profile',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                $('#profileMessage').text("Profil mis à jour avec succès.").removeClass("text-danger").addClass("text-success");
                $('#passwordForm').hide();  // Hide password form on success
                $('#showPasswordForm').text("Changer le mot de passe");  // Reset button text
                $('#currentPassword, #newPassword, #confirmPassword').val("");  // Clear password fields
            },
            error: function(error) {
                $('#profileMessage').text("Erreur lors de la mise à jour du profil.").removeClass("text-success").addClass("text-danger");
            }
        });
    });
});
