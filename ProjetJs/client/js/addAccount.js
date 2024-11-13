// addAccount.js
$(document).ready(function () {
    $("#account-form").submit(function (event) {
      event.preventDefault();
  
      const accountData = {
        name: $("#name").val(),
        type: $("#type").val(),
        low_balance_threshold: $("#threshold").val() ? parseFloat($("#threshold").val()) : null,
      };
  
      const token = localStorage.getItem("token");
  
      $.ajax({
        url: "http://localhost:3000/api/accounts/add",
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        contentType: "application/json",
        data: JSON.stringify(accountData),
        success: function (response) {
          alert(response.message);
          window.location.href = "index.html"; // Redirect back to the main page after creation
        },
        error: function (error) {
          alert("Erreur lors de la création du compte: " + error.responseJSON.message);
        }
      });
    });

      $('#logout').click(function() {
          // Remove the token from localStorage
          localStorage.removeItem('token');
  
          // Redirect to the login page
          window.location.href = 'connexion.html';
      });

  });
  