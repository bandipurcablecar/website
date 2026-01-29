# Deploying to bandipurcablecar.com.np via GitHub

This guide explains how to connect your local project to GitHub and automate deployments to your cPanel server.

## 1. Create a Repository on GitHub
1. Log in to [GitHub](https://github.com).
2. Click the **+** icon in the top right and select **New repository**.
3. Name it `bandipur-website` (or similar).
4. Do **not** initialize with README, .gitignore, or License (we already have them).
5. Click **Create repository**.

## 2. Push Your Code to GitHub
Open your terminal in this project folder (`d:\bandipur website`) and run the following commands (replace `YOUR_USERNAME` with your actual GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/bandipur-website.git
git branch -M main
git push -u origin main
```

## 3. Configure Deployment Secrets
For the automated deployment to work, you need to provide GitHub with your cPanel FTP credentials securely.

1. Go to your repository on GitHub.
2. Click on **Settings** > **Secrets and variables** > **Actions**.
3. Click **New repository secret**.
4. Add the following three secrets:

| Name | Value |
|------|-------|
| `FTP_SERVER` | Your domain name (e.g., `bandipurcablecar.com.np`) or your server IP. |
| `FTP_USERNAME` | Your cPanel/FTP username. |
| `FTP_PASSWORD` | Your cPanel/FTP password. |

## 4. That's it!
Once you push your code (Step 2), GitHub Actions will automatically:
1. Detect the new code.
2. Install dependencies (`npm install`).
3. Build the website (`npm run build`).
4. Upload the built files (`dist/`) to your server's `public_html/` folder using the credentials you provided.

You can monitor the progress in the **Actions** tab of your GitHub repository.

## Important Note regarding `server-dir`
In `.github/workflows/deploy.yml`:
```yaml
server-dir: ./public_html/
```
This uploads directly to your main domain. If you want to host it in a subdirectory (e.g., `bandipurcablecar.com.np/new-site/`), allow the first deploy to finish, then if it's in the wrong place, edit the `server-dir` in the file `deploy.yml` and push again.
