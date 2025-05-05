import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import API from '../api/axios';

const socket = io('http://localhost:8080');

const ChatBox = ({ chat, user }) => {
  const chatId = chat?._id;
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!chatId || !user) return;

    socket.emit('join_chat', chatId);

    const handleReceive = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('receive_message', handleReceive);
    return () => socket.off('receive_message', handleReceive);
  }, [chatId, user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;
      try {
        const res = await API.get(`/message/${chatId}`);
        setMessages(res.data);
      } catch (err) {
        setError('Failed to load messages');
      }
    };

    fetchMessages();
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
      setMessages((prev) => [...prev, res.data]);
      setNewMsg('');
    } catch (err) {
      setError('Failed to send message');
    }
  };

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a chat to start messaging.
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-100 flex flex-col justify-between p-4">
      <div className="h-[75vh] overflow-y-auto border rounded p-3 bg-gray-50">
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

      <div className="mt-4 flex space-x-2">
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

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ChatBox;
