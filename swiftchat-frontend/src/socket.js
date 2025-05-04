import { io } from 'socket.io-client';

// Set up the socket connection (adjust URL as needed)
const socket = io('http://localhost:8080', {
  transports: ['websocket'],
  withCredentials: true,
});

export default socket;
