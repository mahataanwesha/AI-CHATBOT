const ngrok = require('@ngrok/ngrok');

(async function () {
    try {
        // Establish connectivity
        // Establish connectivity
        const listener = await ngrok.forward({
            addr: 3000,
            authtoken: '36vy1TWDzGMbi9i5gO4BmVli9U3_6BJovXNCYPxSv28PLxLnY'
        });

        // Output only the URL to console
        console.log(`\n\nYOUR TWILIO WEBHOOK URL:\n${listener.url()}/sms\n\n`);

        // Keep it alive
        setInterval(() => { }, 1000);
    } catch (err) {
        console.error("Error starting ngrok:", err);
        // Fallback info
        console.log("If Auth Token is missing, go to dashboard.ngrok.com, sign up, and copy your Authtoken.");
        console.log("Then run: npx ngrok config add-authtoken <TOKEN>");
    }
})();
