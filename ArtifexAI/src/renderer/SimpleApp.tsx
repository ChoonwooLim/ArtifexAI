/**
 * Artifex.AI - Simple App for Testing
 */

import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import darkTheme from './styles/theme';
import UltraModernLayout from './components/Layout/UltraModernLayout';

function SimpleApp() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <UltraModernLayout>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          fontSize: 24,
          color: '#fff',
          background: 'linear-gradient(135deg, #7C3AED 0%, #00D9FF 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Welcome to Artifex.AI
        </Box>
      </UltraModernLayout>
    </ThemeProvider>
  );
}

export default SimpleApp;