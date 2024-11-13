$(document).ready(function () {
  $("#signup-form").submit(function (event) {
      event.preventDefault(); // Prevent the default form submission

      const name = $("#fullname").val();
      const email = $("#email").val();
      const password = $("#password").val();
      const confirmPassword = $("#confirm-password").val();

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
              window.location.href = "connexion.html"; // Redirect to login page on success
          },
          error: function (error) {
              alert("Erreur lors de l'inscription: " + error.responseJSON.message);
          }
      });
  });
});
