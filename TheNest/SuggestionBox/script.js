// Global variables
let isSubmitting = false;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get form element
    const form = document.getElementById('suggestionForm');
    const statusMessage = document.getElementById('statusMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    // Add submit event listener to form
    form.addEventListener('submit', handleSubmit);
    
    /**
     * Handle form submission
     * @param {Event} event - The submit event
     */
    async function handleSubmit(event) {
        // Prevent default form submission
        event.preventDefault();
        
        // If already submitting, don't allow multiple submissions
        if (isSubmitting) {
            return;
        }
        
        // Get form data
        const challenge = document.getElementById('challenge').value.trim();
        const solution = document.getElementById('solution').value.trim();
        
        // Validate form data
        if (!challenge || !solution) {
            showStatus('Please fill in both the challenge and solution fields.', 'error');
            return;
        }
        
        // Set submitting state
        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        try {
            // Prepare data for Google Sheets
            const timestamp = new Date().toISOString();
            const formData = {
                timestamp: timestamp,
                challenge: challenge,
                solution: solution
            };
            
            // Send data to Google Sheets
            const result = await submitToGoogleSheets(formData);
            
            if (result.success) {
                // Show success message
                showStatus('Thank you! Your suggestion has been submitted successfully.', 'success');
                // Reset form
                form.reset();
            } else {
                // Show error message
                showStatus('There was an error submitting your suggestion. Please try again later.', 'error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            showStatus('There was an error submitting your suggestion. Please try again later.', 'error');
        } finally {
            // Reset submitting state
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Suggestion';
        }
    }
    
    /**
     * Submit form data to Google Sheets
     * @param {Object} data - The form data to submit
     * @returns {Object} - Result of the submission
     */
    async function submitToGoogleSheets(data) {
        // This will be replaced with actual Google Sheets Web App URL in the next step
        const scriptURL = 'GOOGLE_SCRIPT_URL_PLACEHOLDER';
        
        try {
            // Create form data for submission
            const formDataToSend = new FormData();
            formDataToSend.append('timestamp', data.timestamp);
            formDataToSend.append('challenge', data.challenge);
            formDataToSend.append('solution', data.solution);
            
            // Send data to Google Sheets Web App
            const response = await fetch(scriptURL, {
                method: 'POST',
                body: formDataToSend
            });
            
            // Check if response is ok
            if (response.ok) {
                return { success: true };
            } else {
                console.error('Server responded with an error:', response.status);
                return { success: false, error: `Server error: ${response.status}` };
            }
        } catch (error) {
            console.error('Error submitting to Google Sheets:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Show status message to user
     * @param {string} message - The message to display
     * @param {string} type - The type of message (success or error)
     */
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = type; // Apply the appropriate CSS class
        
        // Add the appropriate class based on message type
        if (type === 'success') {
            statusMessage.classList.add('success');
            statusMessage.classList.remove('error', 'hidden');
        } else if (type === 'error') {
            statusMessage.classList.add('error');
            statusMessage.classList.remove('success', 'hidden');
        }
        
        // Automatically hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusMessage.classList.add('hidden');
            }, 5000);
        }
    }
});
