const fs = require('fs');
const path = require('path');

function logDebug(message) {
    const logStr = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(path.join(__dirname, 'debug.log'), logStr);
}

module.exports = { logDebug };
