import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import API from '../api/axios';
import { useLocation, useNavigate } from 'react-router-dom';

const socket = io('http://localhost:8080');

const ChatBox = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const chat = location.state?.chat;
  const chatId = chat?._id;
  const user = JSON.parse(localStorage.getItem('user'));

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!chatId || !user) {
      navigate('/chat');
      return;
    }

    socket.emit('join_chat', chatId);

    const handleReceive = (msg) => {
      console.log("Real-time message received:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('receive_message', handleReceive);

    return () => {
      socket.off('receive_message', handleReceive);
    };
  }, [chatId, user, navigate]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.get(`/message/${chatId}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
        setError('Failed to load messages');
      }
    };

    if (chatId) fetchMessages();
  }, [chatId]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    const payload = {
      senderId: user._id,
      content: newMsg,
      chatId,
    };

    try {
      const res = await API.post('/message', payload);
      socket.emit('send_message', res.data);
      setNewMsg('');
    } catch (err) {
      console.error(err);
      setError('Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Chat</h2>

        {error && <p className="text-red-500">{error}</p>}

        <div className="h-80 overflow-y-auto border rounded p-3 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 my-1 rounded text-sm ${
                msg.sender._id === user._id
                  ? 'bg-indigo-200 text-right'
                  : 'bg-gray-200 text-left'
              }`}
            >
              <p className="font-semibold">{msg.sender.name}</p>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-4 py-2"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
