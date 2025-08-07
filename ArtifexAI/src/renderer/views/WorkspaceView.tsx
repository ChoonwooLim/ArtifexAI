/**
 * Artifex.AI - Main Workspace View
 * Supports both Timeline and Node-based workflows
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip,
  Divider,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  AccountTree,
  ViewQuilt,
  Fullscreen,
  FullscreenExit,
  Settings,
  PlayArrow,
  Stop,
} from '@mui/icons-material';

import NodeEditor from '../components/NodeEditor/NodeEditor';
import Timeline from '../components/Timeline/Timeline';
import PreviewPanel from '../components/Preview/PreviewPanel';
import AssetBrowser from '../components/AssetBrowser/AssetBrowser';
import PropertiesPanel from '../components/Properties/PropertiesPanel';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';

interface WorkspaceViewProps {
  mode?: 'timeline' | 'node' | 'hybrid';
}

const WorkspaceView: React.FC<WorkspaceViewProps> = ({ mode: initialMode = 'node' }) => {
  const dispatch = useDispatch();
  const [workflowMode, setWorkflowMode] = useState<'timeline' | 'node' | 'hybrid'>(initialMode);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentProject = useSelector((state: RootState) => state.project.currentProject);

  const handleModeChange = (event: React.MouseEvent<HTMLElement>, newMode: string | null) => {
    if (newMode) {
      setWorkflowMode(newMode as 'timeline' | 'node' | 'hybrid');
    }
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handlePlayStop = () => {
    setIsPlaying(!isPlaying);
    // Trigger processing based on current mode
    if (workflowMode === 'node' || workflowMode === 'hybrid') {
      // Execute node graph
      dispatch({ type: 'nodeGraph/execute' });
    } else {
      // Play timeline
      dispatch({ type: 'timeline/play' });
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {/* Left Sidebar - Asset Browser */}
      <Paper
        sx={{
          width: 280,
          height: '100%',
          borderRadius: 0,
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
        }}
        elevation={0}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Artifex.AI
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Neural Creative Engine v1.0
          </Typography>
        </Box>
        
        <AssetBrowser />
      </Paper>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Toolbar */}
        <Paper
          sx={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            px: 2,
            borderRadius: 0,
            borderBottom: '1px solid',
            borderColor: 'divider',
            gap: 2,
          }}
          elevation={0}
        >
          {/* Workflow Mode Switcher */}
          <ToggleButtonGroup
            value={workflowMode}
            exclusive
            onChange={handleModeChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                px: 2,
                py: 0.5,
                border: '1px solid #2a2a2a',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'background.default',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                },
              },
            }}
          >
            <ToggleButton value="timeline">
              <Tooltip title="Timeline Mode">
                <TimelineIcon sx={{ fontSize: 20, mr: 1 }} />
              </Tooltip>
              Timeline
            </ToggleButton>
            <ToggleButton value="node">
              <Tooltip title="Node Mode">
                <AccountTree sx={{ fontSize: 20, mr: 1 }} />
              </Tooltip>
              Node
            </ToggleButton>
            <ToggleButton value="hybrid">
              <Tooltip title="Hybrid Mode">
                <ViewQuilt sx={{ fontSize: 20, mr: 1 }} />
              </Tooltip>
              Hybrid
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider orientation="vertical" flexItem />

          {/* Playback Controls */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              color={isPlaying ? 'error' : 'primary'}
              onClick={handlePlayStop}
              sx={{
                bgcolor: isPlaying ? 'error.main' : 'primary.main',
                color: 'background.default',
                '&:hover': {
                  bgcolor: isPlaying ? 'error.dark' : 'primary.dark',
                },
              }}
            >
              {isPlaying ? <Stop /> : <PlayArrow />}
            </IconButton>
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Project Name */}
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {currentProject?.name || 'Untitled Project'}
          </Typography>

          <Divider orientation="vertical" flexItem />

          {/* View Controls */}
          <IconButton onClick={handleFullscreen} size="small">
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
          <IconButton size="small">
            <Settings />
          </IconButton>
        </Paper>

        {/* Workspace Content */}
        <Box sx={{ flex: 1, display: 'flex', position: 'relative' }}>
          {/* Main Editor Area */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {workflowMode === 'timeline' && (
              <Box sx={{ height: '100%' }}>
                <Timeline />
              </Box>
            )}

            {workflowMode === 'node' && (
              <Box sx={{ height: '100%' }}>
                <NodeEditor projectId={currentProject?.id || 'default'} />
              </Box>
            )}

            {workflowMode === 'hybrid' && (
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Tabs for switching between views */}
                <Paper sx={{ borderRadius: 0 }} elevation={0}>
                  <Tabs
                    value={activeTab}
                    onChange={(e, v) => setActiveTab(v)}
                    sx={{
                      minHeight: 36,
                      '& .MuiTab-root': {
                        minHeight: 36,
                        py: 1,
                      },
                    }}
                  >
                    <Tab label="Node Graph" icon={<AccountTree sx={{ fontSize: 16 }} />} iconPosition="start" />
                    <Tab label="Timeline" icon={<TimelineIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
                  </Tabs>
                </Paper>
                
                {/* Tab Panels */}
                <Box sx={{ flex: 1, position: 'relative' }}>
                  {activeTab === 0 && (
                    <Box sx={{ height: '100%' }}>
                      <NodeEditor projectId={currentProject?.id || 'default'} />
                    </Box>
                  )}
                  {activeTab === 1 && (
                    <Box sx={{ height: '100%' }}>
                      <Timeline />
                    </Box>
                  )}
                </Box>

                {/* Preview Panel at bottom in hybrid mode */}
                <Box sx={{ height: 240, borderTop: '1px solid', borderColor: 'divider' }}>
                  <PreviewPanel />
                </Box>
              </Box>
            )}
          </Box>

          {/* Right Sidebar - Properties & Preview */}
          <Paper
            sx={{
              width: 320,
              height: '100%',
              borderRadius: 0,
              borderLeft: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
            }}
            elevation={0}
          >
            {/* Preview Panel (except in hybrid mode) */}
            {workflowMode !== 'hybrid' && (
              <Box sx={{ height: 240, borderBottom: '1px solid', borderColor: 'divider' }}>
                <PreviewPanel />
              </Box>
            )}

            {/* Properties Panel */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <PropertiesPanel />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default WorkspaceView;