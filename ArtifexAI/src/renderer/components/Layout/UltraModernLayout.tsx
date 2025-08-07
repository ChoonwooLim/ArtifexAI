/**
 * Ultra-Modern Layout System for Artifex.AI
 * World-class professional design inspired by DaVinci Resolve, Nuke, and modern AI tools
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, styled, IconButton, Tooltip, Zoom, Fade, Badge } from '@mui/material';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  Menu as MenuIcon,
  Dashboard,
  Timeline,
  AccountTree,
  ViewInAr,
  Palette,
  MusicNote,
  SmartToy,
  Settings,
  Notifications,
  Search,
  Add,
  FiberManualRecord,
  PlayArrow,
  Stop,
  CloudSync,
  AutoAwesome,
  ViewQuilt,
  Layers,
  ThreeDRotation,
  BrushOutlined,
  VideoLibrary,
  Rocket,
} from '@mui/icons-material';

// Custom styled components with glassmorphism and advanced effects
const LayoutContainer = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: `
    linear-gradient(135deg, #0A0A0F 0%, #0F0F1A 25%, #0A0A0F 50%, #151521 75%, #0A0A0F 100%)
  `,
  position: 'relative',
  overflow: 'hidden',
  
  // Animated gradient background
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `
      radial-gradient(circle at 30% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(0, 217, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 50% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 50%)
    `,
    animation: 'rotate 30s linear infinite',
    pointerEvents: 'none',
  },
  
  '@keyframes rotate': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
}));

const TopBar = styled(Box)(({ theme }) => ({
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  background: 'rgba(10, 10, 15, 0.8)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  position: 'relative',
  zIndex: 1000,
  
  // Subtle glow effect
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.5), transparent)',
    animation: 'shimmer 3s ease-in-out infinite',
  },
  
  '@keyframes shimmer': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
}));

const NavSidebar = styled(motion.div)(({ theme }) => ({
  width: 72,
  height: '100%',
  background: 'rgba(21, 21, 33, 0.6)',
  backdropFilter: 'blur(30px)',
  borderRight: '1px solid rgba(255, 255, 255, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px 0',
  gap: 8,
  position: 'relative',
  zIndex: 100,
  
  // Inner glow
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.05) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
}));

const WorkspaceButton = styled(motion.div)<{ active?: boolean }>(({ theme, active }) => ({
  width: 56,
  height: 56,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: active 
    ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(0, 217, 255, 0.3) 100%)'
    : 'rgba(255, 255, 255, 0.02)',
  border: active
    ? '1px solid rgba(124, 58, 237, 0.5)'
    : '1px solid rgba(255, 255, 255, 0.05)',
  
  '&:hover': {
    background: active
      ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.4) 0%, rgba(0, 217, 255, 0.4) 100%)'
      : 'rgba(255, 255, 255, 0.05)',
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)',
  },
  
  '& .MuiSvgIcon-root': {
    fontSize: 28,
    color: active ? '#fff' : 'rgba(255, 255, 255, 0.6)',
    filter: active ? 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.8))' : 'none',
  },
  
  // Active indicator
  ...(active && {
    '&::before': {
      content: '""',
      position: 'absolute',
      left: -12,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 4,
      height: 24,
      borderRadius: 2,
      background: 'linear-gradient(180deg, #7C3AED 0%, #00D9FF 100%)',
      boxShadow: '0 0 12px rgba(124, 58, 237, 0.8)',
    },
  }),
}));

const MainContent = styled(Box)({
  flex: 1,
  display: 'flex',
  position: 'relative',
  overflow: 'hidden',
});

const WorkspaceArea = styled(Box)(({ theme }) => ({
  flex: 1,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(10, 10, 15, 0.3)',
  margin: 8,
  borderRadius: 16,
  border: '1px solid rgba(255, 255, 255, 0.05)',
  overflow: 'hidden',
  backdropFilter: 'blur(10px)',
}));

const RightPanel = styled(motion.div)(({ theme }) => ({
  width: 360,
  height: '100%',
  background: 'rgba(21, 21, 33, 0.5)',
  backdropFilter: 'blur(20px)',
  borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  padding: 16,
  gap: 16,
}));

const FloatingActionButton = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  bottom: 32,
  right: 32,
  width: 64,
  height: 64,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #7C3AED 0%, #00D9FF 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 8px 32px rgba(124, 58, 237, 0.5)',
  zIndex: 1000,
  
  '&:hover': {
    transform: 'scale(1.1) rotate(90deg)',
    boxShadow: '0 12px 48px rgba(124, 58, 237, 0.7)',
  },
  
  '& .MuiSvgIcon-root': {
    fontSize: 32,
    color: '#fff',
  },
}));

const StatusBar = styled(Box)(({ theme }) => ({
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  background: 'rgba(10, 10, 15, 0.9)',
  backdropFilter: 'blur(20px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  fontSize: 11,
  color: 'rgba(255, 255, 255, 0.6)',
  
  '& .status-item': {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    
    '& .MuiSvgIcon-root': {
      fontSize: 14,
    },
  },
}));

// Workspace configurations
const workspaces = [
  { id: 'dashboard', icon: Dashboard, label: 'Dashboard', color: '#7C3AED' },
  { id: 'timeline', icon: Timeline, label: 'Timeline Editor', color: '#00D9FF' },
  { id: 'nodes', icon: AccountTree, label: 'Node Graph', color: '#00FF88' },
  { id: '3d', icon: ThreeDRotation, label: '3D Viewport', color: '#FF6B6B' },
  { id: 'color', icon: Palette, label: 'Color Suite', color: '#FFD93D' },
  { id: 'audio', icon: MusicNote, label: 'Audio Mixer', color: '#FF00FF' },
  { id: 'ai', icon: AutoAwesome, label: 'AI Studio', color: '#00FFF0' },
  { id: 'render', icon: Rocket, label: 'Render Queue', color: '#FF4081' },
];

interface UltraModernLayoutProps {
  children?: React.ReactNode;
  onWorkspaceChange?: (workspace: string) => void;
}

const UltraModernLayout: React.FC<UltraModernLayoutProps> = ({ children, onWorkspaceChange }) => {
  const [activeWorkspace, setActiveWorkspace] = useState('dashboard');
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [recording, setRecording] = useState(false);
  const [aiAssistantActive, setAiAssistantActive] = useState(false);
  const controls = useAnimation();

  const handleWorkspaceChange = (workspace: string) => {
    setActiveWorkspace(workspace);
    onWorkspaceChange?.(workspace);
    
    // Animate workspace transition
    controls.start({
      opacity: [0, 1],
      scale: [0.95, 1],
      transition: { duration: 0.3 },
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Workspace switching (Alt + 1-8)
      if (e.altKey && e.key >= '1' && e.key <= '8') {
        const index = parseInt(e.key) - 1;
        if (index < workspaces.length) {
          handleWorkspaceChange(workspaces[index].id);
        }
      }
      
      // Toggle AI Assistant (Ctrl + Space)
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        setAiAssistantActive(!aiAssistantActive);
      }
      
      // Toggle Recording (Ctrl + R)
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        setRecording(!recording);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [aiAssistantActive, recording]);

  return (
    <LayoutContainer>
      {/* Top Bar */}
      <TopBar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton size="small">
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesome sx={{ fontSize: 20, color: '#7C3AED' }} />
            <Box sx={{ fontWeight: 600, fontSize: 16 }}>Artifex.AI</Box>
          </Box>
          <Box sx={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            Professional Suite v2.0
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small">
            <Search />
          </IconButton>
          <Badge 
            badgeContent={3} 
            color="primary"
            sx={{ '& .MuiBadge-badge': { fontSize: 10 } }}
          >
            <IconButton size="small">
              <Notifications />
            </IconButton>
          </Badge>
          <IconButton 
            size="small"
            onClick={() => setRecording(!recording)}
            sx={{ color: recording ? '#ff1744' : 'inherit' }}
          >
            {recording ? <Stop /> : <FiberManualRecord />}
          </IconButton>
          <IconButton size="small">
            <CloudSync />
          </IconButton>
          <IconButton size="small">
            <Settings />
          </IconButton>
        </Box>
      </TopBar>
      
      {/* Main Content Area */}
      <MainContent>
        {/* Navigation Sidebar */}
        <NavSidebar
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {workspaces.map((workspace, index) => (
            <Tooltip
              key={workspace.id}
              title={workspace.label}
              placement="right"
              arrow
              TransitionComponent={Zoom}
            >
              <WorkspaceButton
                active={activeWorkspace === workspace.id}
                onClick={() => handleWorkspaceChange(workspace.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <workspace.icon />
              </WorkspaceButton>
            </Tooltip>
          ))}
        </NavSidebar>
        
        {/* Workspace Area */}
        <WorkspaceArea>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeWorkspace}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              {/* Workspace Header */}
              <Box sx={{
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {React.createElement(
                    workspaces.find(w => w.id === activeWorkspace)?.icon || Dashboard,
                    { sx: { fontSize: 20, color: workspaces.find(w => w.id === activeWorkspace)?.color } }
                  )}
                  <Box sx={{ fontWeight: 500 }}>
                    {workspaces.find(w => w.id === activeWorkspace)?.label}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small">
                    <ViewQuilt />
                  </IconButton>
                  <IconButton size="small">
                    <Layers />
                  </IconButton>
                </Box>
              </Box>
              
              {/* Workspace Content */}
              <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
                {children}
              </Box>
            </motion.div>
          </AnimatePresence>
        </WorkspaceArea>
        
        {/* Right Panel */}
        <AnimatePresence>
          {rightPanelOpen && (
            <RightPanel
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* AI Assistant Section */}
              <Box sx={{
                p: 2,
                borderRadius: 2,
                background: aiAssistantActive 
                  ? 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(0,217,255,0.2) 100%)'
                  : 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <SmartToy sx={{ fontSize: 20, color: '#00D9FF' }} />
                  <Box sx={{ fontWeight: 500 }}>AI Assistant</Box>
                  <Box sx={{ 
                    ml: 'auto',
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    background: aiAssistantActive ? '#00D9FF' : '#666',
                    fontSize: 10,
                    fontWeight: 600,
                  }}>
                    {aiAssistantActive ? 'ACTIVE' : 'STANDBY'}
                  </Box>
                </Box>
                <Box sx={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                  {aiAssistantActive 
                    ? 'AI is analyzing your workflow...'
                    : 'Press Ctrl+Space to activate'}
                </Box>
              </Box>
              
              {/* Properties Panel */}
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                {/* Dynamic properties based on workspace */}
              </Box>
            </RightPanel>
          )}
        </AnimatePresence>
      </MainContent>
      
      {/* Status Bar */}
      <StatusBar>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box className="status-item">
            <PlayArrow />
            <span>Ready</span>
          </Box>
          <Box className="status-item">
            <span>GPU: RTX 4090</span>
          </Box>
          <Box className="status-item">
            <span>RAM: 32GB</span>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box className="status-item">
            <span>FPS: 60</span>
          </Box>
          <Box className="status-item">
            <span>4K HDR</span>
          </Box>
          <Box className="status-item">
            <CloudSync sx={{ color: '#00D9FF' }} />
            <span>Synced</span>
          </Box>
        </Box>
      </StatusBar>
      
      {/* Floating Action Button */}
      <FloatingActionButton
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <Add />
      </FloatingActionButton>
    </LayoutContainer>
  );
};

export default UltraModernLayout;