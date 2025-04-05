# Google Sites Embedding Instructions

Follow these steps to embed your anonymous suggestion box in a Google Site:

## Step 1: Get Your Deployed Suggestion Box URL

1. After deploying to GitHub Pages, you should have a URL like:
   `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

2. Make sure your suggestion box is working correctly at this URL before embedding

## Step 2: Embed in Google Sites

### Method 1: Using Embed Code (Recommended)

1. Go to your Google Site and enter edit mode
2. Click where you want to add the suggestion box
3. Click the "Insert" menu and select "Embed"
4. Select "Embed code"
5. Paste the following HTML code, replacing `YOUR_GITHUB_PAGES_URL` with your actual GitHub Pages URL:

```html
<iframe 
  src="YOUR_GITHUB_PAGES_URL" 
  width="100%" 
  height="600" 
  frameborder="0" 
  scrolling="yes">
</iframe>
```

6. Click "Insert"
7. Adjust the height value (600) if needed to fit your form
8. Click "Publish" to update your Google Site

### Method 2: Using Embed URL

1. Go to your Google Site and enter edit mode
2. Click where you want to add the suggestion box
3. Click the "Insert" menu and select "Embed"
4. Select "By URL"
5. Enter your GitHub Pages URL
6. Click "Insert"
7. Resize the embedded content as needed
8. Click "Publish" to update your Google Site

## Important Notes

- The embedded suggestion box will inherit some styles from your Google Site
- You may need to adjust the iframe height to ensure the entire form is visible
- If your form doesn't appear correctly, try using the Embed Code method for more control
- Remember that users will need to complete the Google Sheets setup before the form submissions will work
- Test the embedded form to ensure it works correctly within your Google Site
