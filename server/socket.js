const http = require('http');
const socketIO = require('socket.io');
const app = require('./index'); // your Express app
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('🟢 Client connected');
  socket.on('disconnect', () => console.log('🔴 Client disconnected'));
});

module.exports = { server, io }; 
