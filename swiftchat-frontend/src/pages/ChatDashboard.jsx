import React, { useState, useEffect } from 'react';
import ChatBox from '../components/ChatBox';
import API from '../api/axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ChatDashboard = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await API.get('/chat', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChats(res.data);
      } catch (err) {
        setError('Failed to load chats');
      }
    };
    fetchChats();
  }, [token]);

  const getOtherUser = (chat) => {
    return chat.users.find((u) => u._id !== user._id)?.name || 'Unknown';
  };

  const handleSearch = async () => {
    try {
      const res = await API.get(`/chat/search?email=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(res.data); // single user
    } catch (err) {
      setError('User not found');
    }
  };

  const handleStartChat = async (otherUser) => {
    try {
      const res = await API.post(
        '/chat',
        {
          userId: otherUser._id,
          currentUserId: user._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSelectedChat(res.data);
      setSearchResults([]);
      setSearchQuery('');

      const exists = chats.some((chat) => chat._id === res.data._id);
      if (!exists) {
        setChats([res.data, ...chats]);
      }
    } catch (err) {
      console.error('Failed to start chat:', err);
      setError('Failed to start chat');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-1/3 border-r p-4 space-y-4">
        <h2 className="text-xl font-bold mb-2">SwiftChat</h2>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Search Results:</p>
            {searchResults.map((result) => (
              <div
                key={result._id}
                className="p-2 cursor-pointer hover:bg-gray-100 rounded"
                onClick={() => handleStartChat(result)}
              >
                {result.name} ({result.email})
              </div>
            ))}
          </div>
        )}

        {/* Chat List */}
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Chats</h3>
          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`p-3 rounded cursor-pointer hover:bg-gray-100 ${
                selectedChat?._id === chat._id ? 'bg-indigo-100' : ''
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              <p className="font-medium">{getOtherUser(chat)}</p>
              <p className="text-xs text-gray-500">
                {chat.latestMessage?.content || 'No messages yet'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Box */}
      <div className="w-2/3">
        {selectedChat ? (
          <ChatBox chat={selectedChat} user={user} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat or search to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboard;
