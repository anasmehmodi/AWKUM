const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

// Static Files - Serve files from the current directory
app.use(express.static(__dirname));

// Socket.io for Chat
io.on('connection', (socket) => {
    console.log('A user connected');

    // Broadcast when a user connects
    io.emit('system-message', 'A user has joined the chat');

    // Handle chat messages
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
        io.emit('system-message', 'A user has left the chat');
    });
});

// Since we are using static HTML files, we don't need explicit routes for each file
// Express.static will handle serving index.html, about.html, etc. automatically.
// We just need to make sure the root route serves index.html explicitly if needed,
// though express.static usually does this for 'index.html' by default.

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
server.listen(port, () => {
    console.log(`AWKUM Portal running on http://localhost:${port}`);
    console.log(`Chat server active`);
});
