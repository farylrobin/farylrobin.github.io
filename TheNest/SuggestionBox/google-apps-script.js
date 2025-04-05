// Google Apps Script code for Google Sheets integration
// This code needs to be added to a Google Apps Script project connected to your Google Sheet

/**
 * doPost function to handle POST requests from the suggestion box form
 * @param {Object} e - The event object containing form data
 * @return {Object} - JSON response
 */
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Get form data
    var timestamp = e.parameter.timestamp || new Date().toISOString();
    var challenge = e.parameter.challenge;
    var solution = e.parameter.solution;
    
    // Format timestamp for better readability
    var formattedDate = new Date(timestamp);
    
    // Add row to spreadsheet
    sheet.appendRow([
      formattedDate,
      challenge,
      solution
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    // Log the error
    Logger.log(error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * doGet function to handle GET requests (not used but required for testing)
 * @return {Object} - HTML response
 */
function doGet() {
  return HtmlService.createHtmlOutput(
    "<h2>The Google Sheets API is active</h2>" +
    "<p>This web app is designed to receive form submissions from the suggestion box.</p>"
  );
}
