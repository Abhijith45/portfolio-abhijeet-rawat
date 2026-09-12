require('dotenv').config();
const { sendInquiryNotification, DEFAULT_RECEIVER } = require('./utils/email');

async function runTest() {
    console.log('--- Testing Email Notification Service ---');
    console.log(`Target Receiver: ${process.env.CONTACT_RECEIVER_EMAIL || DEFAULT_RECEIVER}`);

    const result = await sendInquiryNotification({
        name: 'Cyberpunk Client Test',
        email: 'client.test@cyberportfolio.dev',
        message: 'Hello Abhijeet! Testing the email notification transmission pipeline.',
        createdAt: new Date(),
    });

    console.log('Result:', result);
    if (result.success) {
        console.log('✅ Email functionality successfully verified!');
    } else {
        console.error('❌ Email test failed:', result.error);
    }
    process.exit(result.success ? 0 : 1);
}

runTest();
