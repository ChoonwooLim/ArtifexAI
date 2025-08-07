/**
 * Artifex.AI - Main Application
 * Professional Node-Based AI Video Production Suite
 */

import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import { store } from './store';
import MainLayout from './layouts/MainLayout';
import WorkspaceView from './views/WorkspaceView';
import SplashScreen from './components/SplashScreen';
import { initializeApp } from './services/appService';

// Create Artifex.AI dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff',
      light: '#6effff',
      dark: '#00acc1',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff79b0',
      dark: '#c60055',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    divider: '#2a2a2a',
    success: {
      main: '#00e676',
    },
    warning: {
      main: '#ffc400',
    },
    error: {
      main: '#ff1744',
    },
    info: {
      main: '#00b0ff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '0.875rem',
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.75rem',
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.6875rem',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 4,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1a1a1a',
          border: '1px solid #2a2a2a',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0a0a0a',
          borderBottom: '1px solid #2a2a2a',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a1a',
          borderRight: '1px solid #2a2a2a',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#2a2a2a',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          margin: '2px 8px',
          '&:hover': {
            backgroundColor: '#2a2a2a',
          },
          '&.Mui-selected': {
            backgroundColor: '#00e5ff20',
            borderLeft: '3px solid #00e5ff',
            '&:hover': {
              backgroundColor: '#00e5ff30',
            },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#2a2a2a',
          fontSize: '0.75rem',
          border: '1px solid #3a3a3a',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 36,
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initializing Artifex.AI...');

  useEffect(() => {
    // Initialize application
    const init = async () => {
      try {
        setLoadingMessage('Loading Neural Engine...');
        await new Promise(resolve => setTimeout(resolve, 800));

        setLoadingMessage('Initializing Node System...');
        await new Promise(resolve => setTimeout(resolve, 600));

        setLoadingMessage('Loading AI Models...');
        await initializeApp();
        await new Promise(resolve => setTimeout(resolve, 1000));

        setLoadingMessage('Connecting to GPU...');
        await new Promise(resolve => setTimeout(resolve, 500));

        setLoadingMessage('Ready to Create!');
        await new Promise(resolve => setTimeout(resolve, 300));

        setIsLoading(false);
      } catch (error) {
        console.error('Initialization error:', error);
        setLoadingMessage('Error initializing Artifex.AI');
      }
    };

    init();

    // Setup menu action listeners
    window.electronAPI.onMenuAction((action) => {
      console.log('Menu action:', action);
      // Dispatch Redux actions based on menu selection
      switch (action) {
        case 'menu-new-project':
          store.dispatch({ type: 'project/newProject' });
          break;
        case 'menu-open-project':
          store.dispatch({ type: 'project/openProject' });
          break;
        case 'menu-save-project':
          store.dispatch({ type: 'project/saveProject' });
          break;
        case 'menu-import-media':
          store.dispatch({ type: 'media/importMedia' });
          break;
        case 'menu-export-video':
          store.dispatch({ type: 'export/showExportDialog' });
          break;
        case 'menu-generate-t2v':
          store.dispatch({ type: 'generation/showT2VDialog' });
          break;
        case 'menu-generate-i2v':
          store.dispatch({ type: 'generation/showI2VDialog' });
          break;
        case 'menu-generate-music':
          store.dispatch({ type: 'generation/showMusicDialog' });
          break;
        case 'menu-generate-voice':
          store.dispatch({ type: 'generation/showVoiceDialog' });
          break;
        case 'menu-generate-sfx':
          store.dispatch({ type: 'generation/showSFXDialog' });
          break;
      }
    });

    // Set window title
    document.title = 'Artifex.AI - Professional AI Video Production';

    return () => {
      window.electronAPI.removeAllListeners();
    };
  }, []);

  if (isLoading) {
    return <SplashScreen message={loadingMessage} appName="Artifex.AI" />;
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <SnackbarProvider 
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          autoHideDuration={4000}
        >
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<WorkspaceView />} />
                <Route path="project/:id" element={<WorkspaceView />} />
                <Route path="node-editor" element={<WorkspaceView mode="node" />} />
                <Route path="timeline" element={<WorkspaceView mode="timeline" />} />
                <Route path="hybrid" element={<WorkspaceView mode="hybrid" />} />
              </Route>
            </Routes>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;