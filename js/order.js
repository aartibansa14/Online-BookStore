
// Assuming 'order_date' contains the timestamp of when the order was created in milliseconds

const deleteButtons = document.querySelectorAll('.cancel');
deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const bookIdToDelete = event.target.getAttribute('data-or_id');
        const orderDate = new Date(event.target.getAttribute('data-order_date')); // Get the order creation time
        const currentTime = new Date(); // Get the current time
        const timeDifference = currentTime - orderDate; // Calculate the time difference in milliseconds

        // Check if the order was placed within the last 24 hours
        if (timeDifference <= 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
            fetch('/delete-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ or_id: bookIdToDelete }),
            })
                .then((response) => {
                    if (response.status === 200) {
                        // Handle success, e.g., remove the deleted book from the UI
                        event.target.parentElement.remove();
                    } else {
                        console.error('Error deleting book');
                    }
                })
                .catch((error) => {
                    console.error('Error deleting book:', error);
                });
        } else {
            console.log("Cannot cancel order after 24 hours.");
            // Display a message to the user indicating that the order cannot be cancelled after 24 hours
        }
    });
});




/*const deleteButtons = document.querySelectorAll('.cancel');
deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const bookIdToDelete = event.target.getAttribute('data-or_id');
        const orderDate = new Date(event.target.getAttribute('data-order_date')); // Get the order creation time
        const currentTime = new Date(); // Get the current time
        console.log(currentTime);
        const timeDifference = (currentTime - orderDate) / (1000 * 60); // Calculate the time difference in minutes
        
        // Check if the order was placed within the last 2 minutes
        if (timeDifference <= 2) {
            fetch('/delete-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ or_id: bookIdToDelete }),
            })
            .then((response) => {
                if (response.status === 200) {
                    // Handle success, e.g., remove the deleted book from the UI
                    event.target.parentElement.remove();
                } else {
                    console.error('Error deleting book');
                }
            })
            .catch((error) => {
                console.error('Error deleting book:', error);
            });
        } else {
            console.log("Cannot cancel order after 2 minutes.");
            // Display a message to the user indicating that the order cannot be cancelled after 2 minutes
        }
    });
});*/
