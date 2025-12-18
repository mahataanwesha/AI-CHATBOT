# How to Deploy Your AI Health Chatbot from (24/7 Availability)

To make your chatbot available 24/7 without needing your laptop to be on, you need to "deploy" it to a cloud server.
We will use **Render.com** because it is free and easy to set up.

## Prerequisites
1.  A **GitHub Account** (free).
2.  A **Render.com Account** (free).
3.  Your **Twilio Account** details.
4.  Your **Gemini API Key**.

## Step 1: Upload Your Code to GitHub
1.  Create a new Repository on GitHub (e.g., `ai-health-chatbot`).
2.  Open your terminal in VS Code and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/<YOUR_USERNAME>/ai-health-chatbot.git
    git push -u origin main
    ```

## Step 2: Deploy to Render.com
1.  Log in to [Render.com](https://render.com/).
2.  Click **"New"** -> **"Web Service"**.
3.  Select **"Build and deploy from a Git repository"**.
4.  Connect your GitHub account and select your `ai-health-chatbot` repository.
5.  **Configure the Service:**
    *   **Name:** `ai-health-chatbot` (or similar)
    *   **Region:** Singapore (or nearest to you)
    *   **Branch:** `main`
    *   **Runtime:** Node
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
    *   **Plan:** Free

6.  **Environment Variables (Important):**
    Scroll down to "Environment Variables" and click "Add Environment Variable". Add the following (copy values from your local `.env` file):
    *   `GEMINI_API_KEY`: (Your Gemini Key)
    *   `TWILIO_ACCOUNT_SID`: (Your Twilio SID)
    *   `TWILIO_AUTH_TOKEN`: (Your Twilio Token)
    *   `PORT`: `3000` (Optional, Render sets this automatically)

7.  Click **"Create Web Service"**.

## Step 3: Update Twilio Webhook
1.  Once deployment finishes, specific "URL" will be generated (e.g., `https://ai-health-chatbot.onrender.com`).
2.  Copy this URL.
3.  Go to your [Twilio Console](https://console.twilio.com/).
4.  Navigate to **Messaging** -> **Senders** -> **WhatsApp Settings** (or Active Numbers for SMS).
5.  Update the **Webhook URL** to your new Cloud URL + `/sms`:
    *   Example: `https://ai-health-chatbot.onrender.com/sms`
6.  Click **Save**.

## Conclusion
Your bot is now running on the cloud!
*   **Availability:** 24/7, even if your laptop is off.
*   **Access:** Anyone who messages your WhatsApp number will get a reply.

**Note on Database:**
Since you are using a local file database (SQLite), on the free plan, **data might reset** if the server restarts. For a permanent solution later, you would need to connect a cloud database (like PostgreSQL). But for now, the Chatbot functionality will work perfectly.
