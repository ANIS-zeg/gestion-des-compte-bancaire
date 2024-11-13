function validateForm() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
      
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return false;
    }
  
  
    return true;
  }
  