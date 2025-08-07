import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, CardContent, Grid } from '@mui/material';
import {
  AccountTree as NodeGraphIcon,
  Videocam as ViewerIcon,
  Settings as PropertiesIcon,
  Timeline as TimelineIcon,
  Folder as AssetIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import MenuBar from '../MenuBar/MenuBar';
import ToolBar from '../ToolBar/ToolBar';
import SplashScreen from '../SplashScreen/SplashScreen';

declare global {
  interface Window {
    electronAPI?: any;
  }
}

const MainWindow: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // 초기화 프로세스
    const initialize = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setInitialized(true);
      } catch (error) {
        console.error('Initialization failed:', error);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (initialized) {
      setTimeout(() => {
        setShowSplash(false);
      }, 500);
    }
  }, [initialized]);

  const handleCreatePanel = async (panelType: string) => {
    try {
      if (window.electronAPI?.createPanelWindow) {
        await window.electronAPI.createPanelWindow(panelType);
      } else {
        console.log(`Would create ${panelType} panel`);
      }
    } catch (error) {
      console.error('Failed to create panel:', error);
    }
  };

  const panels = [
    {
      type: 'nodeGraph',
      title: 'Node Graph',
      description: 'Node-based compositing workspace',
      icon: <NodeGraphIcon sx={{ fontSize: 48 }} />,
      color: '#00e5ff',
    },
    {
      type: 'viewer',
      title: 'Viewer',
      description: 'Real-time preview window',
      icon: <ViewerIcon sx={{ fontSize: 48 }} />,
      color: '#4caf50',
    },
    {
      type: 'properties',
      title: 'Properties',
      description: 'Node and project properties',
      icon: <PropertiesIcon sx={{ fontSize: 48 }} />,
      color: '#ff9800',
    },
    {
      type: 'timeline',
      title: 'Timeline',
      description: 'Timeline and curve editor',
      icon: <TimelineIcon sx={{ fontSize: 48 }} />,
      color: '#e91e63',
    },
    {
      type: 'asset',
      title: 'Asset Browser',
      description: 'Media and asset management',
      icon: <AssetIcon sx={{ fontSize: 48 }} />,
      color: '#9c27b0',
    },
  ];

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 메뉴바 */}
      <MenuBar />
      
      {/* 툴바 */}
      <ToolBar />
      
      {/* 메인 컨텐츠 */}
      <Box sx={{ 
        flex: 1, 
        p: 4, 
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}>
        {/* 헤더 */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 900,
              background: 'linear-gradient(45deg, #00e5ff 30%, #ff4081 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Artifex.AI
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Professional Video Creation Suite
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Create new panels by clicking the buttons below or using the Workspace menu
          </Typography>
        </Box>

        {/* 패널 생성 버튼들 */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Grid container spacing={3} sx={{ maxWidth: 800 }}>
            {panels.map((panel) => (
              <Grid item xs={12} sm={6} md={4} key={panel.type}>
                <Card
                  sx={{
                    height: 200,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                      '& .panel-icon': {
                        color: panel.color,
                      },
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: 2,
                  }}
                  onClick={() => handleCreatePanel(panel.type)}
                >
                  <Box className="panel-icon" sx={{ color: 'text.secondary', mb: 2 }}>
                    {panel.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {panel.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {panel.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
            
            {/* Create All 버튼 */}
            <Grid item xs={12}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                }}
                onClick={() => {
                  panels.forEach(panel => {
                    setTimeout(() => handleCreatePanel(panel.type), 100);
                  });
                }}
              >
                <AddIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Create Default Workspace
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* 푸터 정보 */}
        <Box sx={{ textAlign: 'center', pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Each panel opens in its own window - drag, resize, and dock as needed
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MainWindow;