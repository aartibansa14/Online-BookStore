const deleteButtons = document.querySelectorAll('.delete');
deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const bookIdToDelete = event.target.getAttribute('data-p_id');
        console.log(bookIdToDelete );
        // Send an AJAX request to delete the book
        fetch('/delete-book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ p_id: bookIdToDelete }),
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
    });
});





function capitalizeFirstLetter() {
    // Get the input element
    const inputElement = document.getElementById("inputText");

    // Get the current input value
    let inputValue = inputElement.value;

    // Check if there's at least one character
    if (inputValue.length > 0) {
        // Capitalize the first letter
        inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
    }

    // Update the input value with the capitalized text
    inputElement.value = inputValue;
}

