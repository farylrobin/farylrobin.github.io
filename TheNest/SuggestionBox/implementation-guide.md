# Anonymous Suggestion Box Implementation Guide

This package contains everything you need to set up an anonymous suggestion box that collects user input and stores it in a Google Sheet. The suggestion box can be embedded in a Google Site for easy access by your company members.

## What's Included

1. **Frontend Files**:
   - `index.html` - The HTML structure of the suggestion box form
   - `style.css` - Styling for the suggestion box (responsive design)
   - `script.js` - JavaScript functionality for form submission

2. **Google Sheets Integration**:
   - `google-apps-script.js` - Script to handle form submissions in Google Sheets
   - `google-sheets-setup.md` - Step-by-step instructions for setting up Google Sheets

3. **Deployment Instructions**:
   - `github-pages-setup.md` - Instructions for deploying to GitHub Pages
   - `google-sites-embedding.md` - Instructions for embedding in Google Sites

## Implementation Steps Overview

1. **Set up Google Sheets**:
   - Create a new Google Sheet
   - Set up the Google Apps Script
   - Deploy as a web app to get your submission URL
   - Follow the detailed instructions in `google-sheets-setup.md`

2. **Update the Script**:
   - Open `script.js`
   - Replace `GOOGLE_SCRIPT_URL_PLACEHOLDER` with your Google Apps Script web app URL

3. **Deploy to GitHub Pages**:
   - Create a GitHub repository
   - Push the code to GitHub
   - Enable GitHub Pages
   - Follow the detailed instructions in `github-pages-setup.md`

4. **Embed in Google Sites**:
   - Use the iframe embedding method to add the suggestion box to your Google Site
   - Follow the detailed instructions in `google-sites-embedding.md`

## Features

- **Anonymous Submissions**: No user identification is collected
- **Challenge and Solution Fields**: Structured format for feedback
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Data**: Submissions appear immediately in your Google Sheet
- **Easy Embedding**: Simple to add to any Google Site

## Customization Options

- Edit the HTML and CSS to match your company branding
- Add additional fields to the form if needed (requires changes to both frontend and Google Apps Script)
- Modify the success/error messages in the JavaScript file

## Support

If you encounter any issues during implementation, refer to the detailed documentation files included in this package.

Happy collecting feedback!
