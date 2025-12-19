# SMS/WhatsApp Health Chatbot

This is a multilingual health chatbot designed for Twilio SMS/WhatsApp integration.

## Features
- **Multilingual Support**: 9 Languages (Hindi, Bengali, Odia, English, Marathi, Gujarati, Kannada, Tamil, Telugu).
- **Registration Flow**: Collects Name, Age, Gender, Marital Status, Children details, Location, and Vaccination info.
- **AI Integration**: Uses Google Gemini for health Q&A (Restricted to home remedies, no prescriptions).
- **Safety**: Automatically detects severe symptoms and provides mock hospital details.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   - Open `.env` file.
   - Add your **Google Gemini API Key** (Get it from [Google AI Studio](https://aistudio.google.com/)).
   - Add your **Twilio SID and Auth Token** (Get it from [Twilio Console](https://www.twilio.com/console)).

3. **Run the Server**:
   ```bash
   npm start
   ```
   Server runs on `http://localhost:3000`.

4. **Connect to Twilio (Public Access)**:
   Since Twilio needs to reach your local computer, use **ngrok**:
   ```bash
   npx ngrok http 3000
   ```
   - Copy the `https` URL (e.g., `https://a1b2c3d4.ngrok.io`).
   - Go to Twilio Console -> Phone Numbers -> Messaging.
   - For **SMS**: Paste `https://.../sms` in the Webhook URL field.
   - For **WhatsApp**: Go to "Messaging" -> "Try it out" -> "Send a WhatsApp message". Connect your number (e.g., send `join <keyword>`). In "Sandbox Settings", paste the webhook URL.

## Testing Locally
You can test the conversation logic without Twilio by running:
```bash
node test_bot.js
```

## Project Structure
- `server.js`: Webhook entry point.
- `bot.js`: Chatbot state machine and logic.
- `utils/translations.js`: Language data.
- `services/geminiService.js`: AI interaction logic.

## Accessing the Chatbot via WhatsApp

Follow the steps below to start using the chatbot on WhatsApp:

**Save the WhatsApp Number**
Save the WhatsApp number **+14155238886** on your phone.
You can name the contact something like AI Chatbot for easy identification.

**Connect to Twilio Sandbox**
Open WhatsApp and send the verification code **join knew-its** to the saved number.
This step connects your WhatsApp account to the Twilio Sandbox.

**Start the Chatbot**
Once connected, send "**HI**" to the chatbot.

**Ask Your Questions**
You can now access the chatbot through WhatsApp and ask questions related to your health doubts.
