# GitHub Pages Deployment Instructions

Follow these steps to deploy your anonymous suggestion box to GitHub Pages:

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click the "+" icon in the top-right corner and select "New repository"
3. Name your repository (e.g., "anonymous-suggestion-box")
4. Add a description (optional): "An anonymous suggestion box that integrates with Google Sheets"
5. Choose "Public" visibility (required for GitHub Pages with a free account)
6. Click "Create repository"

## Step 2: Push Your Code to GitHub

Run the following commands in your terminal, replacing `YOUR_USERNAME` with your GitHub username and `YOUR_REPO_NAME` with your repository name:

```bash
# Configure Git (if not already configured)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Commit your changes
git commit -m "Initial commit: Anonymous suggestion box"

# Push to GitHub
git push -u origin master
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select "master branch" (or "main" if that's your default branch)
5. Click "Save"
6. Wait a few minutes for your site to be published
7. GitHub will provide you with a URL (typically `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`)

## Step 4: Verify Deployment

1. Visit the GitHub Pages URL provided to ensure your suggestion box is working correctly
2. Test the form to make sure it looks and functions as expected (note: form submission will not work until you update the Google Script URL)

## Important Notes

- It may take a few minutes for your site to be published after enabling GitHub Pages
- Make sure your repository is public if you're using a free GitHub account
- If you make changes to your code, you'll need to commit and push them to update the deployed site
- Remember to update the Google Script URL in your `script.js` file with the actual URL from your Google Apps Script deployment
