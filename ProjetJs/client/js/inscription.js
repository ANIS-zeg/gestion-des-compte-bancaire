$(document).ready(function () {
    $("#signup-form").submit(function (event) {
        event.preventDefault();

        const name = $("#fullname").val();
        const email = $("#email").val();
        const password = $("#password").val();
        const confirmPassword = $("#confirm-password").val();

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(password)) {
            alert("Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        $.ajax({
            url: "http://localhost:3000/api/auth/register",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ name, email, password }),
            success: function (response) {
                alert(response.message);
                window.location.href = "connexion.html";
            },
            error: function (error) {
                alert("Erreur lors de l'inscription: " + error.responseJSON.message);
            }
        });
    });
});
