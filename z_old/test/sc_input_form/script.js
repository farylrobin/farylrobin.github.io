// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    
    // Get references to the form and its elements
    const form = document.getElementById("sourcing-form");
    const submitButton = document.getElementById("submit-button");
    const statusMessage = document.getElementById("form-status");

    // Add a submit event listener to the form
    form.addEventListener("submit", async (event) => {
        // Prevent the default browser form submission (full page reload)
        event.preventDefault();

        // --- Client-Side Validation (Optional but Recommended) ---
        // This checks all 'required', 'min', 'max', 'pattern' attributes
        if (!form.checkValidity()) {
            // If the form is invalid, show native browser error messages
            form.reportValidity();
            return;
        }

        // --- Start Submission Process ---

        // 1. Disable the button and show a "sending" message
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
        statusMessage.textContent = "Sending your data, please wait...";
        statusMessage.className = "form-status-message"; // Reset classes

        // 2. Create a FormData object from the form
        // This automatically captures all form fields and their values,
        // including files, in the correct 'multipart/form-data' format.
        const formData = new FormData(form);

        // 3. Send the data using the Fetch API
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                // Headers are not explicitly set for 'multipart/form-data';
                // the browser sets the 'Content-Type' with the correct boundary
                // automatically when using FormData.
            });

            // 4. Handle the response from the webhook
            if (response.ok) {
                // Success!
                statusMessage.textContent = "Information submitted successfully!";
                statusMessage.classList.add("success");
                form.reset(); // Clear the form
            } else {
                // Server returned an error
                const errorData = await response.json().catch(() => ({})); // Try to get error details
                statusMessage.textContent = `Error: Submission failed. (Status: ${response.status})`;
                statusMessage.classList.add("error");
                console.error("Webhook error response:", errorData);
            }

        } catch (error) {
            // Network error or other unexpected issue
            statusMessage.textContent = "Error: Could not connect to the server. Please try again.";
            statusMessage.classList.add("error");
            console.error("Fetch error:", error);
        
        } finally {
            // 5. Re-enable the button regardless of outcome
            submitButton.disabled = false;
            submitButton.textContent = "Submit Information";
        }
    });
});