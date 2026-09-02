require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins a specific conversation room
  socket.on('join_chat', (conversationId) => {
    socket.join(conversationId);
  });

  // Handle incoming messages
  socket.on('send_message', async (data) => {
    try {
      const { conversationId, senderId, text } = data;
      
      // Save to database
      const newMessage = new Message({
        conversation: conversationId,
        sender: senderId,
        text
      });
      await newMessage.save();

      // Update conversation last message
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: newMessage._id,
        lastMessageAt: Date.now()
      });

      // Populate sender before broadcasting
      await newMessage.populate('sender', 'name avatar');

      // Broadcast to room
      io.to(conversationId).emit('receive_message', newMessage);
    } catch (error) {
      console.error('Socket message error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Expose io to the app for use in controllers
app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
