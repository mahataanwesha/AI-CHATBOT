const { handleIncomingMessage } = require('./bot');

async function testConversation() {
    const userId = 'test_user_123';

    console.log("--- Starting Test Conversation ---");

    // Simulating flow
    const inputs = [
        'hi',           // Start
        '1',            // Select Hindi
        'Ramesh',       // Name
        '30',           // Age
        '1',            // Male
        '1',            // Married (Since Age 30 > 21)
        '2',            // 2 Children
        '5, 3',         // Ages
        '110001',       // Pincode
        'VAX123',       // Vax Card
        '1',            // Main Menu -> Health Question
        'Mujhe halka bukhaar hai, kya karun?', // Question in Hindi
        '0',            // Back to menu
        '5'             // Exit
    ];

    for (const input of inputs) {
        console.log(`\nUser: ${input}`);
        const response = await handleIncomingMessage(userId, input);
        console.log(`Bot: ${response}`);
    }
}

testConversation();
