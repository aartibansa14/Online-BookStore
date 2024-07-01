
  document.addEventListener("DOMContentLoaded", function () {
    const heartIcon = document.getElementById("logout-heart");

    if (heartIcon) {
      heartIcon.addEventListener("click", function (event) {
        event.preventDefault();

        // Send an AJAX request to the logout endpoint
        fetch('/logout', {
          method: 'GET',
        })
          .then(response => {
            if (response.ok) {
              // Redirect the user to the home page after logout
              window.location.href = '/landing';
            } else {
              console.error('Logout failed');
            }
          })
          .catch(error => {
            console.error('Logout failed:', error);
          });
      });
    }
  });

