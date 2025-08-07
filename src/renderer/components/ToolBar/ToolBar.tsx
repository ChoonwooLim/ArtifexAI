import React from 'react';
import {
  Box,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Divider,
  styled,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  SkipPrevious as PreviousIcon,
  SkipNext as NextIcon,
  FastRewind as RewindIcon,
  FastForward as ForwardIcon,
  Loop as LoopIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
  Layers as LayersIcon,
  Timeline as TimelineIcon,
  AccountTree as NodeIcon,
  ViewInAr as View3DIcon,
  Brush as BrushIcon,
  ColorLens as ColorIcon,
  Transform as TransformIcon,
  CropFree as SelectIcon,
  PanTool as PanIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  CenterFocusStrong as FitIcon,
  GridOn as GridIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';

const StyledToolBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  backgroundColor: '#1a1a1a',
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1),
  minHeight: 40,
}));

const ToolGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: 4,
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
  },
  '&.active': {
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
  }
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  padding: 4,
  border: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
  },
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    '&:hover': {
      backgroundColor: 'rgba(0, 229, 255, 0.16)',
    }
  }
}));

const VerticalDivider = styled(Divider)(({ theme }) => ({
  height: 24,
  margin: '0 8px',
  borderColor: theme.palette.divider,
}));

const ToolBar: React.FC = () => {
  const [viewMode, setViewMode] = React.useState('node');
  const [tool, setTool] = React.useState('select');
  const [playing, setPlaying] = React.useState(false);
  const [fps, setFps] = React.useState('24');

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newMode: string | null) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleToolChange = (event: React.MouseEvent<HTMLElement>, newTool: string | null) => {
    if (newTool !== null) {
      setTool(newTool);
    }
  };

  return (
    <StyledToolBar>
      {/* View Mode Switcher */}
      <ToolGroup>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
        >
          <StyledToggleButton value="node">
            <Tooltip title="Node Graph">
              <NodeIcon fontSize="small" />
            </Tooltip>
          </StyledToggleButton>
          <StyledToggleButton value="timeline">
            <Tooltip title="Timeline">
              <TimelineIcon fontSize="small" />
            </Tooltip>
          </StyledToggleButton>
          <StyledToggleButton value="3d">
            <Tooltip title="3D View">
              <View3DIcon fontSize="small" />
            </Tooltip>
          </StyledToggleButton>
          <StyledToggleButton value="layers">
            <Tooltip title="Layers">
              <LayersIcon fontSize="small" />
            </Tooltip>
          </StyledToggleButton>
        </ToggleButtonGroup>
      </ToolGroup>

      <VerticalDivider orientation="vertical" />

      {/* Tool Selection */}
      <ToolGroup>
        <ToggleButtonGroup
          value={tool}
          exclusive
          onChange={handleToolChange}
          size="small"
        >
          <StyledToggleButton value="select">
            <Tooltip title="Select Tool (V)">
              <SelectIcon fontSize="small" />
            </Tooltip>
          </StyledToggleButton>
          <StyledToggleButton value="pan">
            <Tooltip title="Pan Tool (H)">
              <PanIcon fontSize="small" />
            </Tooltip>
          </StyledToggleButton>
          <StyledToggleButton value="transform">
            <Tooltip title="Transform Tool (T)">
              <TransformIcon fontSize="small" />
            </Tooltip>
          </StyledToggleButton>
          <StyledToggleButton value="brush">
            <Tooltip title="Brush Tool (B)">
              <BrushIcon fontSize="small" />
            </Tooltip>
          </StyledToggleButton>
          <StyledToggleButton value="color">
            <Tooltip title="Color Tool (C)">
              <ColorIcon fontSize="small" />
            </Tooltip>
          </StyledToggleButton>
        </ToggleButtonGroup>
      </ToolGroup>

      <VerticalDivider orientation="vertical" />

      {/* Playback Controls */}
      <ToolGroup>
        <Tooltip title="Previous Frame">
          <StyledIconButton size="small">
            <PreviousIcon fontSize="small" />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Rewind">
          <StyledIconButton size="small">
            <RewindIcon fontSize="small" />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title={playing ? "Pause" : "Play"}>
          <StyledIconButton 
            size="small" 
            onClick={() => setPlaying(!playing)}
            className={playing ? 'active' : ''}
          >
            {playing ? <PauseIcon fontSize="small" /> : <PlayIcon fontSize="small" />}
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Stop">
          <StyledIconButton size="small">
            <StopIcon fontSize="small" />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Forward">
          <StyledIconButton size="small">
            <ForwardIcon fontSize="small" />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Next Frame">
          <StyledIconButton size="small">
            <NextIcon fontSize="small" />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Loop">
          <StyledIconButton size="small">
            <LoopIcon fontSize="small" />
          </StyledIconButton>
        </Tooltip>
      </ToolGroup>

      <VerticalDivider orientation="vertical" />

      {/* View Controls */}
      <ToolGroup>
        <Tooltip title="Zoom In">
          <StyledIconButton size="small">
            <ZoomInIcon fontSize="small" />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Zoom Out">
          <StyledIconButton size="small">
            <ZoomOutIcon fontSize="small" />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Fit to View">
          <StyledIconButton size="small">
            <FitIcon fontSize="small" />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Toggle Grid">
          <StyledIconButton size="small">
            <GridIcon fontSize="small" />
          </StyledIconButton>
        </Tooltip>
      </ToolGroup>

      <VerticalDivider orientation="vertical" />

      {/* FPS Selector */}
      <FormControl size="small" sx={{ minWidth: 80 }}>
        <Select
          value={fps}
          onChange={(e) => setFps(e.target.value)}
          sx={{
            height: 28,
            fontSize: '0.875rem',
            '& .MuiSelect-select': {
              py: 0.5,
            }
          }}
        >
          <MenuItem value="24">24 fps</MenuItem>
          <MenuItem value="25">25 fps</MenuItem>
          <MenuItem value="30">30 fps</MenuItem>
          <MenuItem value="60">60 fps</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ flex: 1 }} />

      {/* AI Tools */}
      <ToolGroup>
        <Tooltip title="AI Generate">
          <StyledIconButton 
            size="small"
            sx={{ 
              color: '#ff4081',
              '&:hover': {
                color: '#ff79b0',
                backgroundColor: 'rgba(255, 64, 129, 0.08)',
              }
            }}
          >
            <AIIcon fontSize="small" />
          </StyledIconButton>
        </Tooltip>
      </ToolGroup>

      <VerticalDivider orientation="vertical" />

      {/* Visibility Toggle */}
      <ToolGroup>
        <Tooltip title="Toggle Visibility">
          <StyledIconButton size="small">
            <ViewIcon fontSize="small" />
          </StyledIconButton>
        </Tooltip>
      </ToolGroup>
    </StyledToolBar>
  );
};

export default ToolBar;