import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const location = useLocation();
  const navigate = useNavigate();

  const chat = location.state?.chat;

  useEffect(() => {
    if (!chat) {
      navigate('/chat');
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await API.get(`/message/${chat._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Chat load failed:", err);
        setError('Failed to load messages');
      }
    };

    fetchMessages();
  }, [chat, token, navigate]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    try {
      const res = await API.post(
        '/message',
        {
          content: newMsg,
          chatId: chat._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages((prev) => [...prev, res.data]);
      setNewMsg('');
    } catch (err) {
      console.error("ChatBox fetch failed:", err);
      setError('Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-semibold mb-2">
        Chat with {chat.users.find((u) => u._id !== user._id)?.name}
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white shadow rounded p-4 h-96 overflow-y-scroll mb-4">
        {messages.map((m) => (
          <div key={m._id} className="mb-2">
            <span className="font-semibold">
              {m.sender.name === user.name ? 'You' : m.sender.name}:
            </span>{' '}
            {m.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
