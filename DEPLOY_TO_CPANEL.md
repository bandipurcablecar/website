# Deploying to cPanel

This project is a Single Page Application (SPA) built with React and Vite. hosting it on cPanel is straightforward.

## Prerequisites
- Access to your cPanel File Manager or FTP.
- Data from your local `.env` file (Supabase URL and Key).

## Step 1: Prepare for Production
1. Open your terminal in the project folder.
2. Run the build command:
   ```bash
   npm run build
   ```
3. This will create a `dist` folder in your project directory. This folder contains the optimized, production-ready version of your website.

## Step 2: Upload to cPanel
1. Log in to your cPanel.
2. Go to **File Manager**.
3. Navigate to **public_html** (or the subdomain folder where you want the site).
4. **Delete** any default files (like `default.html` or `cgi-bin` if not needed).
5. **Upload** the **CONTENTS** of the `dist` folder directly to `public_html`.
   - *Note: Do not upload the `dist` folder itself, open it and upload the files inside (assets folder, index.html, .htaccess, etc).*

## Step 3: Verify Routing
We have already added a `.htaccess` file to your `public` folder. When you ran the build, it was copied to `dist`.
Ensure you see the `.htaccess` file in your cPanel. (You may need to enable "Show Hidden Files" in cPanel File Manager settings).

**Why is this needed?**
React handles page navigation instantly in the browser. If a user visits `/investors` directly, cPanel tries to find a file named `investors.html`. The `.htaccess` file tells cPanel: "If you can't find the file, send them to `index.html` and let React handle it."

## Step 4: Database
Your database is hosted on Supabase (Cloud). Your cPanel site will automatically connect to it using the API keys bundled in your build. You do not need to set up MySQL databases in cPanel.

## Troubleshooting
- **White Screen?** Check the Console (F12) for errors.
- **404 on Refresh?** Ensure `.htaccess` is present in the root directory.
