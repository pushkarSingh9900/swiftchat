import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';



const Chat = () => {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  if (!token) navigate('/login');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await API.get('/chat', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setChats(res.data);
      } catch (err) {
        console.error("Chat fetch failed:", err);
        setError('Failed to load chats');
      }
    };

    fetchChats();
  }, [token]);

  const getOtherUser = (chat) => {
    const userId = user._id || user.id;
    return chat.users.find((u) => u._id !== userId)?.name || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="space-y-4">
        {chats.map((chat) => (
          <div
          key={chat._id}
          onClick={() => navigate('/chatbox', { state: { chat } })}
          className="cursor-pointer bg-white rounded-lg shadow p-4 hover:bg-indigo-50 transition"
        >
          <h2 className="text-lg font-semibold">{getOtherUser(chat)}</h2>
          {chat.latestMessage && (
            <p className="text-sm text-gray-600">{chat.latestMessage.content}</p>
          )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
