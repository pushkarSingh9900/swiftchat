const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

const messageRoutes = require('./routes/messageRoutes');
app.use('/api/message', messageRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Create HTTP server and bind Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  }
});

// Socket.IO events
io.on('connection', (socket) => {
    console.log("New socket connected:", socket.id);
  
    socket.on('join_chat', (room) => {
        socket.join(room);
        console.log(`User joined chat room: ${room}`);
      });
      
      socket.on('send_message', (message) => {
        try {
          const chatId = message.chat?._id || message.chat;
          if (!chatId) return;
      
          io.in(chatId).emit('receive_message', message);
        } catch (err) {
          console.error('Socket emit error:', err);
        }
      });
  });

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
