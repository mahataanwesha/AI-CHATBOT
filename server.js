const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { handleIncomingMessage } = require('./bot');
const { MessagingResponse } = require('twilio').twiml;

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Basic Health Check
app.get('/', (req, res) => {
    res.send('Health Chatbot Server is Running.');
});

// 6. Send Alert via Twilio (and Chatbot Replies)
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post('/api/send-alert', async (req, res) => {
    // ... existing alert logic ...
    const { phone_number, message } = req.body;
    try {
        await client.messages.create({
            body: message,
            from: 'whatsapp:+14155238886',
            to: phone_number
        });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Chatbot Handler
app.get('/sms', (req, res) => {
    res.send('This is the Twilio Webhook endpoint. It only accepts POST requests from Twilio.');
});

app.post('/sms', async (req, res) => {
    console.log("------------------------------------------");
    console.log("INCOMING MESSAGE:", req.body.Body);
    console.log("FULL BODY:", JSON.stringify(req.body, null, 2));

    // Acknowledge immediately to avoid Twilio timeout
    res.status(200).send('OK');

    const userId = req.body.From;
    const messageBody = req.body.Body;
    const mediaUrl = req.body.MediaUrl0;

    try {
        const responseText = await handleIncomingMessage(userId, messageBody, mediaUrl);

        if (responseText) {
            const sendMsg = async (retryCount = 0) => {
                try {
                    // Dynamic handling: Reply from the same number/channel that received it
                    // fast and easy way to support both SMS and WhatsApp
                    const fromNumber = req.body.To;

                    await client.messages.create({
                        body: responseText,
                        from: fromNumber,
                        to: userId
                    });
                    console.log(`Reply sent successfully to ${userId} from ${fromNumber}`);
                } catch (err) {
                    console.warn(`Attempt ${retryCount + 1} failed: ${err.message}`);
                    if (err.code === 63038 && retryCount < 3) {
                        console.log(`Twilio Rate Limit Hit! Waiting 5s before retry...`);
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        return sendMsg(retryCount + 1);
                    }
                    throw err;
                }
            };
            await sendMsg();
        }
    } catch (error) {
        console.error("FINAL FAILURE sending message:", error.message);
    }
    console.log("------------------------------------------");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Twilio Webhook URL needed: http://localhost:${PORT}/sms`);
});
