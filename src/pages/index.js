import { Box, Button, Stack, TextField } from '@mui/material';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi, I'm your assistant today! How can I help you?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    const userMessage = { role: 'user', content: message };
    setMessages([...messages, userMessage]);
    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: data.message },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: '#d0f0c0',  // Light green background
        minHeight: '100vh',  // Ensure it covers the full height
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack
        sx={{
          height: '80vh',
          overflowY: 'scroll',
          padding: 2,  // Add padding for a better layout
        }}
      >
        <Stack sx={{ flexGrow: 1 }}>
          {messages.map((message, index) => (
            <div key={index} style={{
              marginBottom: '8px',
              padding: '8px',
              borderRadius: '4px',
              backgroundColor: message.role === 'assistant' ? '#ffffff' : '#f0f0f0',
              border: '1px solid #ccc',
              color: message.role === 'assistant' ? '#000000' : '#000000', // Black text color
            }}>
              {message.role === 'assistant' ? (
                <div><b>Assistant:</b> {message.content}</div>
              ) : (
                <div><b>User:</b> {message.content}</div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            sx={{
              borderColor: '#ffffff',  // White border
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#ffffff',  // White border
                },
                '&:hover fieldset': {
                  borderColor: '#ffffff',  // White border on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ffffff',  // White border when focused
                },
              },
              '& input': {
                color: '#000000',  // Black text color
              },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
            sx={{
              backgroundColor: '#4caf50',  // Green background
              '&:hover': {
                backgroundColor: '#388e3c',  // Darker green on hover
              },
            }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
