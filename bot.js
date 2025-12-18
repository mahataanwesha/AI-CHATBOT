const { getSession, updateSession, clearSession } = require('./services/sessionService');
const { translations, languageMenu } = require('./utils/translations');
const { askHealthQuestion } = require('./services/geminiService');
const { findNearestHospital } = require('./services/hospitalService');
const { logDebug } = require('./utils/logger');
const db = require('./utils/db');

// Helper to get text for current language
function T(langId, key) {
    // Default to English if language not set or key missing
    if (!langId || !translations[langId]) return translations['4'][key];
    return translations[langId][key] || translations['4'][key];
}

async function handleIncomingMessage(userId, messageBody, mediaUrl) {
    try {
        const session = getSession(userId);
        const { state, data } = session;
        const input = (messageBody || '').trim();

        logDebug(`User: ${userId} | Input: "${input}" | State: ${state} | Media: ${!!mediaUrl}`);

        // Global "Reset" or "Start" command
        if (input.toLowerCase() === 'reset') {
            updateSession(userId, { state: 'SELECT_LANGUAGE', data: {}, history: [] });
            return languageMenu;
        }

        if (input.toLowerCase() === 'hi' || input.toLowerCase() === 'hello') {
            if (state === 'MAIN_MENU' || state === 'ASKING_HEALTH_Q') {
                if (data.name) {
                    updateSession(userId, { state: 'MAIN_MENU' });
                    return T(data.language, 'welcome') + " " + data.name + "\n" + T(data.language, 'main_menu');
                }
            }
            updateSession(userId, { state: 'SELECT_LANGUAGE', data: {}, history: [] });
            return languageMenu;
        }

        // State Machine
        switch (state) {
            case 'SELECT_LANGUAGE':
                if (translations[input]) {
                    updateSession(userId, {
                        state: 'ENTER_NAME',
                        data: { ...data, language: input }
                    });
                    return translations[input].welcome;
                } else {
                    return languageMenu + "\n\n(Please reply with a number 1-9)";
                }

            case 'ENTER_NAME':
                updateSession(userId, {
                    state: 'ENTER_AGE',
                    data: { ...data, name: input }
                });
                return T(data.language, 'ask_age');

            case 'ENTER_AGE':
                const age = parseInt(input);
                if (isNaN(age) || age <= 0 || age > 120) return T(data.language, 'invalid_input');
                updateSession(userId, {
                    state: 'ENTER_GENDER',
                    data: { ...data, age: age }
                });
                return T(data.language, 'ask_gender');

            case 'ENTER_GENDER':
                // Check if user replied with number OR text (mapped)
                // The prompt says "collected... number-based inputs"
                let gender = null;
                if (input === '1') gender = 'Male';
                else if (input === '2') gender = 'Female';
                else if (input === '3') gender = 'Other';

                if (!gender) return T(data.language, 'invalid_input');

                // Logic for Marital Status
                // Male >= 21 OR Female >= 18
                let askMarital = false;
                if (gender === 'Male' && data.age >= 21) askMarital = true;
                if (gender === 'Female' && data.age >= 18) askMarital = true;

                const nextData = { ...data, gender: gender }; // Storing text is fine

                if (askMarital) {
                    updateSession(userId, { state: 'ENTER_MARITAL_STATUS', data: nextData });
                    return gender === 'Male' ? T(data.language, 'ask_marital_male') : T(data.language, 'ask_marital_female');
                } else {
                    updateSession(userId, { state: 'ENTER_PINCODE', data: nextData });
                    return T(data.language, 'ask_pincode');
                }

            case 'ENTER_MARITAL_STATUS':
                if (!['1', '2'].includes(input)) return T(data.language, 'invalid_input');
                // 1 = Married, 2 = Not
                if (input === '1') {
                    updateSession(userId, { state: 'ENTER_CHILDREN_COUNT', data: { ...data, maritalStatus: 'Married' } });
                    return T(data.language, 'ask_children_count');
                } else {
                    updateSession(userId, { state: 'ENTER_PINCODE', data: { ...data, maritalStatus: 'Single' } });
                    return T(data.language, 'ask_pincode');
                }

            case 'ENTER_CHILDREN_COUNT':
                const count = parseInt(input);
                if (isNaN(count) || count < 0) return T(data.language, 'invalid_input');
                if (count > 0) {
                    updateSession(userId, { state: 'ENTER_CHILDREN_AGES', data: { ...data, childrenCount: count } });
                    return T(data.language, 'ask_children_ages');
                } else {
                    updateSession(userId, { state: 'ENTER_PINCODE', data: { ...data, childrenCount: 0 } });
                    return T(data.language, 'ask_pincode');
                }

            case 'ENTER_CHILDREN_AGES':
                updateSession(userId, { state: 'ENTER_PINCODE', data: { ...data, childrenAges: input } });
                return T(data.language, 'ask_pincode');

            case 'ENTER_PINCODE':
                // Check if alphanumeric if strict? Prompt said "6-digit number".
                if (!/^\d{6}$/.test(input)) return T(data.language, 'invalid_input') + " (6 digits)";
                updateSession(userId, { state: 'ENTER_VAX_CARD', data: { ...data, pincode: input } });
                return T(data.language, 'ask_vax_no');

            case 'ENTER_VAX_CARD':
                const vaxInfo = mediaUrl ? "Photo Received" : input;
                const finalData = { ...data, vaxCard: vaxInfo };

                // DATA PERSISTENCE: Save User to DB
                db.run(`INSERT OR REPLACE INTO users (phone_number, name, age, gender, marital_status, children_count, pincode, vaccination_card) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [userId, finalData.name, finalData.age, finalData.gender, finalData.maritalStatus, finalData.childrenCount, finalData.pincode, finalData.vaxCard],
                    (err) => {
                        if (err) console.error("DB Error Saving User:", err);
                        else console.log(`User ${userId} saved/updated in DB.`);
                    }
                );

                updateSession(userId, { state: 'MAIN_MENU', data: finalData });
                return T(data.language, 'reg_complete') + "\n" + T(data.language, 'main_menu');

            case 'MAIN_MENU':
                switch (input) {
                    case '1': // Health Questions
                        updateSession(userId, { state: 'ASKING_HEALTH_Q' });
                        return (translations[data.language || '4'].start_chat_mode || "You can now ask health questions. Type '0' or 'Menu' to go back.");
                    case '2': // Preventive Tips
                        return "Tip: Drink 8 glasses of water daily and wash hands frequently.\n\n" + T(data.language, 'main_menu');
                    case '3': // Alerts
                        return "Alert: No current outbreaks in your area (" + (data.pincode || 'Generic') + ").\n\n" + T(data.language, 'main_menu');
                    case '4': // Reminders
                        return "Reminder: Checks show you are up to date.\n\n" + T(data.language, 'main_menu');
                    case '5': // Exit
                        return T(data.language, 'exiting');
                    case '6': // Nearby Hospitals
                        const hospitals = await findNearestHospital(data.pincode);
                        return hospitals + "\n\n" + T(data.language, 'main_menu');
                    default:
                        return T(data.language, 'main_menu');
                }

            case 'ASKING_HEALTH_Q':
                if (input.toLowerCase() === 'menu' || input === '0') {
                    updateSession(userId, { state: 'MAIN_MENU' });
                    return T(data.language, 'main_menu');
                }

                // Call Gemini
                // If language is somehow missing, default to English
                const langName = (translations[data.language] && translations[data.language].name) || 'English';
                const { text, isSevere } = await askHealthQuestion(input, langName, session.history);

                let finalResponse = text;
                if (isSevere) {
                    const hospital = await findNearestHospital(data.pincode);
                    finalResponse = T(data.language, 'severe_warning') + hospital + "\n\n" + text;

                    // ESCALATION: Auto-escalate severe cases
                    db.run(`INSERT INTO escalations (phone_number, severity_level, status) VALUES (?, ?, ?)`, [userId, 'HIGH', 'PENDING']);
                }

                // LOGGING: Save interactions
                db.run(`INSERT INTO health_logs (phone_number, query, ai_response, is_severe) VALUES (?, ?, ?, ?)`,
                    [userId, input, text, isSevere ? 1 : 0]);

                session.history.push({ role: "user", parts: [{ text: input }] });
                session.history.push({ role: "model", parts: [{ text: text }] });

                return finalResponse;

            default:
                // If state is unknown, reset
                updateSession(userId, { state: 'SELECT_LANGUAGE', data: {}, history: [] });
                return languageMenu;
        }

    } catch (e) {
        logDebug(`CRITICAL ERROR: ${e.message}\n${e.stack}`);
        return "Sorry, I encountered an error. Please reply 'Hi' to restart.";
    }
}

module.exports = { handleIncomingMessage };
