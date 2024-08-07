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
        margin: 0,  // Remove default margin
        padding: 0,  // Remove default padding
        height: '100vh',  // Ensure it covers the full viewport height
        width: '100vw',  // Ensure it covers the full viewport width
        backgroundImage: 'url("/best.jpg")',  // Correct path to the image
        backgroundSize: 'cover',  // Ensure the image covers the entire area
        backgroundPosition: 'center',  // Center the image
        backgroundRepeat: 'no-repeat',  // Prevent the image from repeating
        overflow: 'hidden',  // Hide any overflow
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack
        sx={{
          flexGrow: 1,  // Allow the chat box to grow
          overflow: 'hidden',  // Hide scrollbars
          padding: 2,  // Add padding for a better layout
          backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent background for readability
          borderRadius: '8px',  // Rounded corners
          height: 'calc(100vh - 80px)',  // Adjust height to avoid bottom scrollbar
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack
          sx={{
            flexGrow: 1,
            overflowY: 'auto',  // Allow vertical scrolling within the chat area
            marginBottom: 2,  // Add margin to avoid overlapping with input area
          }}
        >
          {messages.map((message, index) => (
            <div key={index} style={{
              marginBottom: '8px',
              padding: '8px',
              borderRadius: '4px',
              backgroundColor: message.role === 'assistant' ? '#000000' : '#000000',  // Black background
              border: 'none',  // No border
              color: message.role === 'assistant' ? '#00FF00' : '#00FF00', // Green text color
              wordBreak: 'break-word',  // Break long words
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
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#000000',  // Black background
                '& fieldset': {
                  borderColor: '#00FF00',  // Green border
                },
                '&:hover fieldset': {
                  borderColor: '#00FF00',  // Green border on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00FF00',  // Green border when focused
                },
                '& input': {
                  color: '#00FF00',  // Green text color
                },
              },
              '& .MuiInputLabel-root': {
                color: '#00FF00',  // Green label color
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
