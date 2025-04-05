# Google Sheets Integration Setup Instructions

Follow these steps to set up the Google Sheets integration for your anonymous suggestion box:

## Step 1: Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Rename the spreadsheet to "Anonymous Suggestion Box" or any name you prefer
3. In the first row (header row), add the following column headers:
   - A1: Timestamp
   - B1: Challenge
   - C1: Solution
4. Optional: Format the header row (bold, center align, freeze)

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, click on "Extensions" > "Apps Script"
2. Delete any code in the script editor
3. Copy and paste the entire code from the `google-apps-script.js` file into the script editor
4. Click on "File" > "Save" and give your project a name (e.g., "Suggestion Box Handler")

## Step 3: Deploy as Web App

1. Click on "Deploy" > "New deployment"
2. Click the gear icon next to "Select type" and choose "Web app"
3. Fill in the following details:
   - Description: Suggestion Box Handler
   - Execute as: "Me" (your Google account)
   - Who has access: "Anyone" (this allows anonymous submissions)
4. Click "Deploy"
5. You will be prompted to authorize the app - follow the authorization steps
6. After deployment, you'll receive a URL - **copy this URL**

## Step 4: Update Your Suggestion Box Form

1. Open the `script.js` file in your suggestion box project
2. Replace the placeholder `GOOGLE_SCRIPT_URL_PLACEHOLDER` with the URL you copied from the previous step
3. Save the file

## Important Notes

- The Google Sheet must be owned by the same Google account that deploys the Apps Script
- You may need to redeploy the Apps Script if you make changes to it
- The Apps Script will automatically add timestamps and format the data in your Google Sheet
- Make sure your Google Sheet has appropriate sharing settings if you want others to view the submissions
