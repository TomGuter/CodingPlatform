import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Chat.css'; 

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

interface ChatProps {
  roomId: string;
  role: 'mentor' | 'student';
}

const Chat: React.FC<ChatProps> = ({ roomId, role }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.emit('joinChatRoom', roomId);

    socket.on('newMessage', (message: { sender: string; text: string }) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.emit('leaveChatRoom', roomId);
      socket.off('newMessage');
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = { sender: role, text: newMessage };
      socket.emit('sendMessage', { room: roomId, message });
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === role ? 'sent' : 'received'}`}>
            <strong>{msg.sender}: </strong>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;