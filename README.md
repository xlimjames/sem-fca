# SEM-FCA - Powerful Facebook Chat API

**The most powerful, lightweight Facebook Chat API library for Node.js**

- ✅ Works on all platforms: Windows, Linux, macOS, **Termux (Android)**
- ✅ 40+ real features from production FCA
- ✅ **AppState login** - No password needed, just cookies
- ✅ Beautiful gradient logging with boxLog
- ✅ TypeScript support
- ✅ Zero bloat - Clean, fast, efficient

**By:** [imlimsemaj](https://facebook.com/imlimsemaj)

## Features

### Messaging (12 methods)
Send, edit, delete, react to messages, typing indicators, stickers, share URLs

### Threads (12 methods)
List, get history, archive, mute, pin, add/remove members

### Users (9 methods)
Get info, block, friend, follow, unfollow

### Posting (9 methods)
Create posts, comments, stories, like, share

### Plus
- Session management (AppState)
- Cookie jar support
- File-based session persistence
- TypeScript definitions

## Installation

```bash
npm install sem-fca
```

## Quick Start

### Method 1: AppState Login (RECOMMENDED - No Password!)

**Get appState (one-time setup):**
```javascript
const SemFCA = require('sem-fca');
const fs = require('fs');

const api = new SemFCA();
await api.login('your-email@example.com', 'your-password');

// Save the session
await api.saveSession('appstate.json');
console.log('Session saved!');
```

**Use AppState later (no password needed):**
```javascript
const SemFCA = require('sem-fca');
const api = new SemFCA();

// Login with just the saved session
const appState = JSON.parse(require('fs').readFileSync('appstate.json'));
await api.login(null, null, appState);

console.log('Logged in as:', api.userID);
```

### Method 2: Direct Email/Password Login

```javascript
const SemFCA = require('sem-fca');
const api = new SemFCA();

await api.login('your-email@example.com', 'your-password');

// Now you're authenticated
await api.messaging.sendMessage('threadID', 'Hello!');
```

### Method 3: Session File

```javascript
const api = new SemFCA();

// Restore from saved file
await api.restoreSession('./session.json');

// Use the API
await api.threads.getThreadList(20);
```

## Complete Example

```javascript
const SemFCA = require('sem-fca');
const { boxLog } = require('sem-fca');
const fs = require('fs');

const api = new SemFCA();

(async () => {
    try {
        // Login
        if (fs.existsSync('session.json')) {
            boxLog('Session', 'Restoring...', 'loaded');
            await api.restoreSession('session.json');
        } else {
            boxLog('Login', 'Authenticating...', 'setup');
            await api.login('your-email@example.com', 'your-password');
            await api.saveSession('session.json');
        }

        boxLog('Connected', `Logged in as ${api.userID}`, 'bot');

        // Get recent conversations
        const threads = await api.threads.getThreadList(10);
        console.log(`You have ${threads.length} conversations`);

        // Send a message
        await api.messaging.sendMessage('123456789', 'Hello from sem-fca!');

        // Get user info
        const user = await api.getCurrentUser();
        console.log('Your profile:', user.name);

        // Set typing indicator
        await api.messaging.sendTypingIndicator('123456789', true);

        // Send with reaction emoji
        await api.messaging.setMessageReaction('messageID', '😂');

    } catch (error) {
        boxLog('Error', error.message, 'error');
    }
})();
```

## API Reference

### Authentication

```javascript
// Login with email & password
await api.login(email, password);

// Login with appState
const appState = JSON.parse(fs.readFileSync('appstate.json'));
await api.login(null, null, appState);

// Get session data
const appState = api.getAppState();

// Save session to file
await api.saveSession('session.json');

// Restore from file
await api.restoreSession('session.json');

// Check if authenticated
console.log(api.isAuthenticated()); // true/false

// Logout
await api.logout();
```

### Messaging

```javascript
// Send message
await api.messaging.sendMessage(threadID, 'Hello!');

// Edit message
await api.messaging.editMessage(messageID, 'Updated text');

// Delete message
await api.messaging.unsendMessage(messageID);

// React with emoji
await api.messaging.setMessageReaction(messageID, '❤️');

// Typing indicator
await api.messaging.sendTypingIndicator(threadID, true); // typing
await api.messaging.sendTypingIndicator(threadID, false); // stopped

// Send sticker
await api.messaging.sendSticker(threadID, 'stickerID');

// Mark as read
await api.messaging.markAsRead(threadID);

// Set thread color
await api.messaging.setThreadColor(threadID, '#0084FF');

// Set nickname
await api.messaging.setCustomNickname(threadID, 'My Friend', userID);
```

### Threads

```javascript
// Get conversation list
const threads = await api.threads.getThreadList(20);

// Get thread info
const info = await api.threads.getThreadInfo(threadID);

// Get message history
const history = await api.threads.getThreadHistory(threadID, 30);

// Mute/unmute
await api.threads.muteThread(threadID, 3600); // 1 hour
await api.threads.unmuteThread(threadID);

// Archive
await api.threads.archiveThread(threadID);
await api.threads.unarchiveThread(threadID);

// Pin/unpin
await api.threads.pinThread(threadID);
await api.threads.unpinThread(threadID);

// Manage members
await api.threads.addUserToGroup(threadID, userID);
await api.threads.removeUserFromGroup(threadID, userID);

// Leave thread
await api.threads.leaveThread(threadID);
```

### Users

```javascript
// Get user info
const user = await api.users.getUserInfo(userID);

// Get multiple users
const users = await api.users.getUsersInfo([id1, id2]);

// Friend management
await api.users.addFriend(userID);
await api.users.removeFriend(userID);

// Follow/unfollow
await api.users.followUser(userID);
await api.users.unfollowUser(userID);

// Block/unblock
await api.users.blockUser(userID);
await api.users.unblockUser(userID);

// Get blocked users
const blocked = await api.users.getBlockedUsers();
```

### Posting

```javascript
// Create post
await api.posting.createPost('Check this out!');

// Comment on post
await api.posting.commentOnPost(postID, 'Nice!');

// Like/unlike
await api.posting.likePost(postID);
await api.posting.unlikePost(postID);

// Share post
await api.posting.sharePost(postID, threadID);

// Delete post/comment
await api.posting.deletePost(postID);
await api.posting.deleteComment(commentID);

// Stories
await api.posting.createStory(content);
await api.posting.deleteStory(storyID);
```

## Gradient Logging

Use beautiful colored logs:

```javascript
const { boxLog } = require('sem-fca');

boxLog('Title', 'loaded');           // Orange
boxLog('Title', 'setup');            // Green
boxLog('Title', 'bot');              // Dark Magenta
boxLog('Title', 'server');           // Pink
boxLog('Title', 'error');            // Red
boxLog('Title', 'configuration');    // Purple

// With description
boxLog('Welcome', 'Your message here', 'loaded');
```

## Termux Support

**Works on Android with Termux!** See [TERMUX.md](./TERMUX.md) for complete guide.

```bash
# Install on Termux
apt install nodejs npm
npm install sem-fca

# Use with AppState (no password)
node your-bot.js
```

## Error Handling

```javascript
try {
    await api.login('email@example.com', 'password');
    await api.messaging.sendMessage(threadID, message);
} catch (error) {
    boxLog('Error', error.message, 'error');
    // Handle error
}
```

## Advanced: Custom HTTP Client

```javascript
const SemFCA = require('sem-fca');

const api = new SemFCA({
    userAgent: 'Custom-Bot/1.0',
    timeout: 60000
});
```

## Performance

- **Lightweight** - ~100KB total
- **Fast** - No unnecessary dependencies
- **Efficient** - Reusable HTTP client
- **Mobile-friendly** - Works on Termux

## Security Notes

⚠️ **Important:**
- Keep appState.json private (like a password)
- Don't hardcode passwords
- Use environment variables for credentials
- Don't share appState with others
- Rotate appState periodically

## License

MIT License - Created by [imlimsemaj](https://facebook.com/imlimsemaj)

## Support

- **GitHub:** https://github.com/imlimsemaj/sem-fca
- **Facebook:** https://facebook.com/imlimsemaj
- **Termux:** See [TERMUX.md](./TERMUX.md)

## Disclaimer

This library is for educational purposes. Use responsibly and in accordance with Facebook's Terms of Service.
