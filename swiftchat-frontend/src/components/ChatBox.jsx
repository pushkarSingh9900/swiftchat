import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import API from '../api/axios';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const socket = io('http://localhost:8080');

const ChatBox = ({ chat, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  const chatId = chat?._id;

  useEffect(() => {
    if (!chatId) return;

    socket.emit('join_chat', chatId);

    const handleReceive = (msg) => {
      if (msg.chat._id === chatId) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socket.on('receive_message', handleReceive);

    return () => {
      socket.off('receive_message', handleReceive);
    };
  }, [chatId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.get(`/message/${chatId}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load messages');
      }
    };

    if (chatId) fetchMessages();
  }, [chatId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div className="flex flex-col h-full p-4">
      <ScrollArea className="flex-1 overflow-y-auto pr-2">
        {messages.map((msg, index) => {
          const senderId =
            typeof msg.sender === 'object' && msg.sender !== null
              ? msg.sender._id
              : msg.sender;
          const isSender = senderId === user._id;

          return (
            <div
              key={index}
              className={`flex flex-col my-2 max-w-xs ${
                isSender ? 'ml-auto items-end' : 'items-start'
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg text-sm shadow-md ${
                  isSender ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="font-semibold">{msg.sender?.name || 'You'}</p>
                <p>{msg.content}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {format(new Date(msg.createdAt), 'hh:mm a')}
              </span>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </ScrollArea>

      <div className="mt-4 flex items-center gap-2">
        <Input
          placeholder="Type a message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

export default ChatBox;
