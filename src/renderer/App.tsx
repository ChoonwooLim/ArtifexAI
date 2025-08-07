import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { store } from './store';
import NodeEditor from './components/NodeEditor/NodeEditor';
import ViewerPanel from './components/Viewer/ViewerPanel';
import PropertiesPanel from './components/Properties/PropertiesPanel';
import TimelinePanel from './components/Timeline/TimelinePanel';
import AssetBrowser from './components/AssetBrowser/AssetBrowser';
import MainWindow from './components/MainWindow/MainWindow';
import { Box } from '@mui/material';

// 모던한 다크 테마 정의
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
    error: {
      main: '#ff5252',
    },
    warning: {
      main: '#ffc107',
    },
    info: {
      main: '#00b0ff',
    },
    success: {
      main: '#00e676',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
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
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
    caption: {
      fontSize: '0.75rem',
      color: '#808080',
    },
  },
  shape: {
    borderRadius: 4,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.6)',
    '0px 3px 6px rgba(0, 0, 0, 0.6)',
    '0px 4px 8px rgba(0, 0, 0, 0.6)',
    '0px 5px 10px rgba(0, 0, 0, 0.6)',
    '0px 6px 12px rgba(0, 0, 0, 0.6)',
    '0px 7px 14px rgba(0, 0, 0, 0.6)',
    '0px 8px 16px rgba(0, 0, 0, 0.6)',
    '0px 9px 18px rgba(0, 0, 0, 0.6)',
    '0px 10px 20px rgba(0, 0, 0, 0.6)',
    '0px 11px 22px rgba(0, 0, 0, 0.6)',
    '0px 12px 24px rgba(0, 0, 0, 0.6)',
    '0px 13px 26px rgba(0, 0, 0, 0.6)',
    '0px 14px 28px rgba(0, 0, 0, 0.6)',
    '0px 15px 30px rgba(0, 0, 0, 0.6)',
    '0px 16px 32px rgba(0, 0, 0, 0.6)',
    '0px 17px 34px rgba(0, 0, 0, 0.6)',
    '0px 18px 36px rgba(0, 0, 0, 0.6)',
    '0px 19px 38px rgba(0, 0, 0, 0.6)',
    '0px 20px 40px rgba(0, 0, 0, 0.6)',
    '0px 21px 42px rgba(0, 0, 0, 0.6)',
    '0px 22px 44px rgba(0, 0, 0, 0.6)',
    '0px 23px 46px rgba(0, 0, 0, 0.6)',
    '0px 24px 48px rgba(0, 0, 0, 0.6)',
    '0px 25px 50px rgba(0, 0, 0, 0.6)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#151515',
        },
      },
    },
  },
});

const App: React.FC = () => {
  // URL에서 창 타입과 ID 파라미터 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const windowType = urlParams.get('window') || 'main';
  const windowId = urlParams.get('id');

  // 각 창 타입별로 적절한 컴포넌트 렌더링
  const renderWindowContent = () => {
    switch (windowType) {
      case 'main':
        return <MainWindow />;
      case 'nodeGraph':
        return <NodeEditor />;
      case 'viewer':
        return <ViewerPanel />;
      case 'properties':
        return <PropertiesPanel />;
      case 'timeline':
        return <TimelinePanel />;
      case 'asset':
        return <AssetBrowser />;
      default:
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              bgcolor: 'background.default',
            }}
          >
            Unknown window type: {windowType}
          </Box>
        );
    }
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            bgcolor: 'background.default',
            overflow: 'hidden',
          }}
        >
          {renderWindowContent()}
        </Box>
      </ThemeProvider>
    </Provider>
  );
};

export default App;