# SEM-FCA on Termux (Android)

Complete guide to run sem-fca on Android using Termux.

## Installation

### 1. Install Termux
Download from [F-Droid](https://f-droid.org/en/packages/com.termux/) (Recommended) or Google Play Store.

### 2. Update Termux
```bash
apt update && apt upgrade -y
```

### 3. Install Node.js
```bash
apt install nodejs npm -y
```

### 4. Install sem-fca
```bash
npm install sem-fca
```

Or clone and install:
```bash
git clone https://github.com/imlimsemaj/sem-fca.git
cd sem-fca
npm install
```

## Quick Start on Termux

### Method 1: Using AppState (Recommended - No Password)

**Step 1: Get AppState on your computer/original device**
```javascript
const SemFCA = require('sem-fca');
const fs = require('fs');

const api = new SemFCA();
await api.login('your-email@example.com', 'your-password');

// Save session
const appState = api.getAppState();
fs.writeFileSync('appstate.json', JSON.stringify(appState, null, 2));
console.log('Saved to appstate.json');
```

**Step 2: Transfer appstate.json to Termux**
```bash
# On your phone in Termux
cd ~/sem-fca
# Transfer the file (via Bluetooth, Syncthing, adb push, etc.)
```

**Step 3: Use on Termux**
```javascript
const SemFCA = require('sem-fca');
const fs = require('fs');

const api = new SemFCA();
const appState = JSON.parse(fs.readFileSync('appstate.json'));

// Login using appState - NO PASSWORD NEEDED
await api.login(null, null, appState);
await api.messaging.sendMessage('123456789', 'Hello from Termux!');
```

### Method 2: Direct Login (requires password input)

```bash
export FB_EMAIL="your-email@example.com"
export FB_PASSWORD="your-password"
node example.js
```

Or hardcode in script (less secure):
```javascript
const SemFCA = require('sem-fca');
const api = new SemFCA();

await api.login('your-email@example.com', 'your-password');
await api.saveSession('session.json');
// Session saved for next time!
```

## Working with Files in Termux

### View saved sessions
```bash
cat session.json
cat appstate.json
```

### Use storage permissions
```bash
# Allow access to phone storage
termux-setup-storage

# Files will be available in ~/storage/
```

### Create a bot script
```bash
cat > bot.js << 'EOF'
const SemFCA = require('sem-fca');
const api = new SemFCA();

(async () => {
    const appState = require('./appstate.json');
    await api.login(null, null, appState);
    console.log('Connected as:', api.userID);
    
    // Your bot logic here
    await api.messaging.sendMessage('123456789', 'Automated message!');
})();
EOF

node bot.js
```

## Keep Bot Running 24/7 on Termux

### Using tmux (recommended)
```bash
# Install tmux
apt install tmux -y

# Create a session
tmux new-session -d -s sem-fca "node bot.js"

# View logs
tmux attach-session -t sem-fca

# Detach: Press Ctrl+B then D
```

### Using nohup
```bash
nohup node bot.js > bot.log 2>&1 &
tail -f bot.log
```

## Troubleshooting on Termux

### Issue: "Cannot find module"
```bash
npm install
```

### Issue: "Connection timeout"
- Check internet connection: `ping google.com`
- Try different User-Agent: `new SemFCA({ userAgent: "..." })`

### Issue: "Session expired"
- Re-login with credentials or get fresh appState
- Sessions expire after ~30-90 days

### Issue: "Account locked/suspicious login"
- Facebook might block automated logins
- Try logging in manually on web first
- Use appState from manual login instead

## Advanced: Scheduled Messages

Create a cron job to run bot periodically:
```bash
# Install cronie
apt install cronie -y

# Edit crontab
crontab -e

# Add: Send message every hour
0 * * * * cd ~/sem-fca && node bot.js >> bot.log 2>&1
```

## Performance Tips

1. **Use AppState instead of email/password** - Faster, more reliable
2. **Reuse HTTP client** - Create one API instance, reuse it
3. **Batch requests** - Send multiple messages before disconnecting
4. **Handle errors gracefully** - Network on mobile is unstable

```javascript
const SemFCA = require('sem-fca');
const api = new SemFCA();
const appState = require('./appstate.json');

await api.login(null, null, appState);

try {
    // Do multiple things
    await api.messaging.sendMessage('123', 'Message 1');
    await api.messaging.sendMessage('456', 'Message 2');
    await api.threads.getThreadList(10);
} catch (error) {
    console.log('Error:', error.message);
}
```

## Security Notes

- **Never hardcode passwords** in scripts
- **Keep appstate.json private** - treat like password
- **Don't share appState** with others
- **Use environment variables** for sensitive data
- **Rotate appState** periodically

```bash
# Secure: Use environment variables
export FB_APPSTATE=$(cat appstate.json)
node bot.js
```

## Links

- **GitHub:** https://github.com/imlimsemaj/sem-fca
- **Facebook:** https://facebook.com/imlimsemaj
- **Termux:** https://termux.dev

## Support

For issues or questions:
- Check error messages carefully
- Ensure Node.js is up to date: `node --version`
- Try in a fresh Termux environment
- Check Facebook's Terms of Service
