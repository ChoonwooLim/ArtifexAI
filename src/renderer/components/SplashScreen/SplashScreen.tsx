import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress, styled, keyframes } from '@mui/material';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const glow = keyframes`
  0% {
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(0, 229, 255, 0.8), 0 0 30px rgba(255, 64, 129, 0.6);
  }
  100% {
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  }
`;

const SplashContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
  zIndex: 9999,
  animation: `${fadeIn} 0.5s ease-out`,
});

const Logo = styled(Typography)({
  fontSize: '4rem',
  fontWeight: 900,
  background: 'linear-gradient(45deg, #00e5ff 30%, #ff4081 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '1rem',
  animation: `${glow} 2s ease-in-out infinite`,
  letterSpacing: '0.05em',
});

const Subtitle = styled(Typography)({
  fontSize: '1.2rem',
  color: '#808080',
  marginBottom: '3rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
});

const Version = styled(Typography)({
  fontSize: '0.875rem',
  color: '#606060',
  position: 'absolute',
  bottom: '2rem',
});

const StyledProgress = styled(LinearProgress)({
  width: '300px',
  height: '2px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '& .MuiLinearProgress-bar': {
    background: 'linear-gradient(90deg, #00e5ff 0%, #ff4081 100%)',
  },
});

const LoadingText = styled(Typography)({
  fontSize: '0.75rem',
  color: '#606060',
  marginTop: '1rem',
  minHeight: '1rem',
});

const SplashScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');

  useEffect(() => {
    const messages = [
      'Initializing core systems...',
      'Loading AI models...',
      'Connecting to Wan 2.2...',
      'Setting up workspace...',
      'Loading node library...',
      'Preparing render engine...',
      'Configuring GPU acceleration...',
      'Starting services...',
      'Almost ready...',
      'Welcome to Artifex.AI!'
    ];

    let currentMessage = 0;
    const messageInterval = setInterval(() => {
      if (currentMessage < messages.length) {
        setLoadingMessage(messages[currentMessage]);
        currentMessage++;
      }
    }, 200);

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          clearInterval(messageInterval);
          return 100;
        }
        return prevProgress + 5;
      });
    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <SplashContainer>
      <Logo>Artifex.AI</Logo>
      <Subtitle>Professional Video Creation Suite</Subtitle>
      <StyledProgress variant="determinate" value={progress} />
      <LoadingText>{loadingMessage}</LoadingText>
      <Version>Version 2.0.0 | Powered by Wan 2.2</Version>
    </SplashContainer>
  );
};

export default SplashScreen;