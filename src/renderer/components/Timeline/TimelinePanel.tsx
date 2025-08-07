import React, { useState, useRef } from 'react';
import {
  Box,
  IconButton,
  Typography,
  styled,
  Slider,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VolumeUp as VolumeIcon,
  KeyboardArrowRight as ExpandIcon,
  KeyboardArrowDown as CollapseIcon,
} from '@mui/icons-material';

const TimelineContainer = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  overflow: 'hidden',
}));

const TimelineHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
  minHeight: 32,
}));

const TrackList = styled(Box)(({ theme }) => ({
  width: 200,
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#151515' : '#fafafa',
}));

const TimeRuler = styled(Box)(({ theme }) => ({
  flex: 1,
  position: 'relative',
  height: 32,
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const TracksArea = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  overflow: 'auto',
}));

const TrackHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  height: 40,
  gap: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const TrackContent = styled(Box)(({ theme }) => ({
  flex: 1,
  position: 'relative',
  height: 40,
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#ffffff',
}));

const Clip = styled(Box)(({ theme }) => ({
  position: 'absolute',
  height: 32,
  top: 4,
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  cursor: 'move',
  userSelect: 'none',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    border: '1px solid',
    borderColor: theme.palette.primary.main,
  },
}));

const Playhead = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  width: 2,
  height: '100%',
  backgroundColor: theme.palette.error.main,
  pointerEvents: 'none',
  zIndex: 10,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -8,
    left: -4,
    width: 10,
    height: 10,
    backgroundColor: theme.palette.error.main,
    transform: 'rotate(45deg)',
  },
}));

interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'effect';
  locked: boolean;
  visible: boolean;
  clips: Clip[];
}

interface Clip {
  id: string;
  name: string;
  start: number;
  duration: number;
  color: string;
}

const TimelinePanel: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      name: 'Video 1',
      type: 'video',
      locked: false,
      visible: true,
      clips: [
        { id: 'c1', name: 'Clip 1', start: 50, duration: 100, color: '#00e5ff' },
        { id: 'c2', name: 'Clip 2', start: 200, duration: 150, color: '#00e5ff' },
      ],
    },
    {
      id: '2',
      name: 'Video 2',
      type: 'video',
      locked: false,
      visible: true,
      clips: [
        { id: 'c3', name: 'Clip 3', start: 100, duration: 120, color: '#00e5ff' },
      ],
    },
    {
      id: '3',
      name: 'Audio 1',
      type: 'audio',
      locked: false,
      visible: true,
      clips: [
        { id: 'c4', name: 'Audio', start: 0, duration: 400, color: '#4caf50' },
      ],
    },
    {
      id: '4',
      name: 'Effects',
      type: 'effect',
      locked: false,
      visible: true,
      clips: [
        { id: 'c5', name: 'ColorCorrect', start: 50, duration: 300, color: '#ff4081' },
      ],
    },
  ]);

  const [playheadPosition, setPlayheadPosition] = useState(150);
  const [zoom, setZoom] = useState(1);
  const timelineRef = useRef<HTMLDivElement>(null);

  const toggleTrackLock = (trackId: string) => {
    setTracks(prev => prev.map(track =>
      track.id === trackId ? { ...track, locked: !track.locked } : track
    ));
  };

  const toggleTrackVisibility = (trackId: string) => {
    setTracks(prev => prev.map(track =>
      track.id === trackId ? { ...track, visible: !track.visible } : track
    ));
  };

  const renderTimeMarkers = () => {
    const markers = [];
    const step = 50 * zoom;
    for (let i = 0; i < 20; i++) {
      const position = i * step;
      markers.push(
        <Box
          key={i}
          sx={{
            position: 'absolute',
            left: position,
            top: 0,
            height: '100%',
            borderLeft: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              left: 4,
              top: 8,
              fontSize: '0.7rem',
              color: 'text.secondary',
            }}
          >
            {i * 5}s
          </Typography>
        </Box>
      );
    }
    return markers;
  };

  return (
    <TimelineContainer>
      <TimelineHeader>
        <TrackList>
          <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small">
              <AddIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption" sx={{ ml: 'auto' }}>
              Tracks
            </Typography>
          </Box>
        </TrackList>
        <TimeRuler>
          {renderTimeMarkers()}
        </TimeRuler>
      </TimelineHeader>

      <TracksArea>
        <Box>
          {tracks.map(track => (
            <TrackHeader key={track.id}>
              <IconButton size="small" sx={{ p: 0 }}>
                <ExpandIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption" sx={{ flex: 1 }}>
                {track.name}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => toggleTrackLock(track.id)}
                sx={{ p: 0 }}
              >
                <LockIcon 
                  fontSize="small" 
                  sx={{ 
                    color: track.locked ? 'warning.main' : 'text.disabled' 
                  }} 
                />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => toggleTrackVisibility(track.id)}
                sx={{ p: 0 }}
              >
                <VisibilityIcon 
                  fontSize="small" 
                  sx={{ 
                    color: track.visible ? 'primary.main' : 'text.disabled' 
                  }} 
                />
              </IconButton>
              {track.type === 'audio' && (
                <IconButton size="small" sx={{ p: 0 }}>
                  <VolumeIcon fontSize="small" />
                </IconButton>
              )}
            </TrackHeader>
          ))}
        </Box>

        <Box sx={{ flex: 1, position: 'relative' }}>
          {tracks.map(track => (
            <TrackContent key={track.id}>
              {track.clips.map(clip => (
                <Clip
                  key={clip.id}
                  sx={{
                    left: clip.start * zoom,
                    width: clip.duration * zoom,
                    backgroundColor: clip.color + '40',
                    borderColor: clip.color,
                  }}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: '0.7rem',
                      color: 'white',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {clip.name}
                  </Typography>
                </Clip>
              ))}
            </TrackContent>
          ))}
          <Playhead sx={{ left: playheadPosition * zoom }} />
        </Box>
      </TracksArea>

      {/* Zoom Control */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 1, 
        borderTop: 1, 
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}>
        <Typography variant="caption" sx={{ mr: 1 }}>
          Zoom:
        </Typography>
        <Slider
          value={zoom}
          onChange={(e, v) => setZoom(v as number)}
          min={0.5}
          max={3}
          step={0.1}
          sx={{ width: 150 }}
        />
      </Box>
    </TimelineContainer>
  );
};

export default TimelinePanel;