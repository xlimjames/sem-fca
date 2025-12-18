const SemFCA = require('./src/index.js');
const { boxLog } = require('./src/utils/boxLog');
const fs = require('fs');
const path = require('path');

// Session file path
const SESSION_FILE = path.join(process.cwd(), 'session.json');

async function main() {
    const api = new SemFCA();

    try {
        // Check if session exists
        if (fs.existsSync(SESSION_FILE)) {
            boxLog('Session Found', 'Restoring from file...', 'loaded');
            await api.restoreSession(SESSION_FILE);
        } else {
            // First time login with email/password
            boxLog('First Login', 'Enter your Facebook credentials', 'setup');
            
            // For example - replace with your credentials
            const email = process.env.FB_EMAIL || 'your-email@example.com';
            const password = process.env.FB_PASSWORD || 'your-password';

            if (email === 'your-email@example.com') {
                boxLog('Error', 'Please set FB_EMAIL and FB_PASSWORD environment variables', 'error');
                process.exit(1);
            }

            await api.login(email, password);
            
            // Save session for future use
            await api.saveSession(SESSION_FILE);
            boxLog('Session Saved', SESSION_FILE, 'loaded');
        }

        // Now you're authenticated!
        boxLog('Ready', `Logged in as ${api.userID}`, 'bot');

        // Example: Send a message
        // await api.messaging.sendMessage('123456789', 'Hello from sem-fca!');
        
        // Example: Get thread list
        // const threads = await api.threads.getThreadList(10);
        // console.log('Your recent conversations:', threads);

        // Example: Get user info
        // const userInfo = await api.users.getUserInfo(api.userID);
        // console.log('Your profile:', userInfo);

        console.log('\n✓ sem-fca is ready to use!\n');

    } catch (error) {
        boxLog('Error', error.message, 'error');
        process.exit(1);
    }
}

main();
