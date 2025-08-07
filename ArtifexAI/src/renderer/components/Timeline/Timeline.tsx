/**
 * Timeline Component - Professional video editing timeline
 * Similar to Adobe Premiere/DaVinci Resolve timeline
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, Paper, IconButton, Slider, Typography, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  SkipPrevious,
  SkipNext,
  ZoomIn,
  ZoomOut,
  ContentCut,
  VolumeUp,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import TimelineRuler from './TimelineRuler';
import TimelineTrack from './TimelineTrack';
import TimelineClip from './TimelineClip';
import { setCurrentTime, setZoom, addClip, removeClip, moveClip } from '../../store/slices/timelineSlice';

export interface TimelineClipData {
  id: string;
  trackId: string;
  mediaId: string;
  startTime: number;
  duration: number;
  inPoint: number;
  outPoint: number;
  type: 'video' | 'audio' | 'image' | 'text' | 'effect';
  name: string;
  thumbnail?: string;
  effects?: any[];
  transitions?: any[];
  locked?: boolean;
  muted?: boolean;
}

export interface TimelineTrackData {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'text' | 'effect';
  height: number;
  locked: boolean;
  visible: boolean;
  muted?: boolean;
  clips: TimelineClipData[];
}

const Timeline: React.FC = () => {
  const dispatch = useDispatch();
  const timelineState = useSelector((state: RootState) => state.timeline);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTimeLocal] = useState(0);
  const [duration, setDuration] = useState(300); // 5 minutes default
  const [zoom, setZoomLocal] = useState(1);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playbackRef = useRef<number | null>(null);

  // Sample tracks data
  const [tracks, setTracks] = useState<TimelineTrackData[]>([
    {
      id: 'v1',
      name: 'Video 1',
      type: 'video',
      height: 80,
      locked: false,
      visible: true,
      clips: [],
    },
    {
      id: 'v2',
      name: 'Video 2',
      type: 'video',
      height: 80,
      locked: false,
      visible: true,
      clips: [],
    },
    {
      id: 'a1',
      name: 'Audio 1',
      type: 'audio',
      height: 60,
      locked: false,
      visible: true,
      muted: false,
      clips: [],
    },
    {
      id: 'a2',
      name: 'Audio 2',
      type: 'audio',
      height: 60,
      locked: false,
      visible: true,
      muted: false,
      clips: [],
    },
    {
      id: 't1',
      name: 'Text',
      type: 'text',
      height: 50,
      locked: false,
      visible: true,
      clips: [],
    },
    {
      id: 'fx1',
      name: 'Effects',
      type: 'effect',
      height: 50,
      locked: false,
      visible: true,
      clips: [],
    },
  ]);

  // Playback control
  const handlePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    const startTime = performance.now();
    const startPosition = currentTime;

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000; // Convert to seconds
      const newTime = startPosition + elapsed;

      if (newTime >= duration) {
        setCurrentTimeLocal(duration);
        handleStop();
      } else {
        setCurrentTimeLocal(newTime);
        dispatch(setCurrentTime(newTime));
        playbackRef.current = requestAnimationFrame(animate);
      }
    };

    playbackRef.current = requestAnimationFrame(animate);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (playbackRef.current) {
      cancelAnimationFrame(playbackRef.current);
      playbackRef.current = null;
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTimeLocal(0);
    dispatch(setCurrentTime(0));
    if (playbackRef.current) {
      cancelAnimationFrame(playbackRef.current);
      playbackRef.current = null;
    }
  };

  // Zoom control
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.5, 10);
    setZoomLocal(newZoom);
    dispatch(setZoom(newZoom));
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom / 1.5, 0.1);
    setZoomLocal(newZoom);
    dispatch(setZoom(newZoom));
  };

  const handleZoomSlider = (event: Event, value: number | number[]) => {
    const newZoom = value as number;
    setZoomLocal(newZoom);
    dispatch(setZoom(newZoom));
  };

  // Track controls
  const toggleTrackLock = (trackId: string) => {
    setTracks(tracks.map(track =>
      track.id === trackId ? { ...track, locked: !track.locked } : track
    ));
  };

  const toggleTrackVisibility = (trackId: string) => {
    setTracks(tracks.map(track =>
      track.id === trackId ? { ...track, visible: !track.visible } : track
    ));
  };

  const toggleTrackMute = (trackId: string) => {
    setTracks(tracks.map(track =>
      track.id === trackId ? { ...track, muted: !track.muted } : track
    ));
  };

  // Clip operations
  const handleAddClip = (trackId: string, mediaId: string, position: number) => {
    const newClip: TimelineClipData = {
      id: `clip-${Date.now()}`,
      trackId,
      mediaId,
      startTime: snapToGrid ? Math.round(position) : position,
      duration: 5, // Default 5 seconds
      inPoint: 0,
      outPoint: 5,
      type: 'video',
      name: 'New Clip',
    };

    setTracks(tracks.map(track =>
      track.id === trackId
        ? { ...track, clips: [...track.clips, newClip] }
        : track
    ));

    dispatch(addClip(newClip));
  };

  const handleMoveClip = (clipId: string, newTrackId: string, newStartTime: number) => {
    setTracks(tracks.map(track => {
      // Remove from old track
      const filteredClips = track.clips.filter(clip => clip.id !== clipId);
      
      // Add to new track if this is the target
      if (track.id === newTrackId) {
        const movedClip = tracks
          .flatMap(t => t.clips)
          .find(c => c.id === clipId);
        
        if (movedClip) {
          return {
            ...track,
            clips: [...filteredClips, {
              ...movedClip,
              trackId: newTrackId,
              startTime: snapToGrid ? Math.round(newStartTime) : newStartTime,
            }],
          };
        }
      }
      
      return { ...track, clips: filteredClips };
    }));

    dispatch(moveClip({ clipId, trackId: newTrackId, startTime: newStartTime }));
  };

  const handleDeleteClip = (clipId: string) => {
    setTracks(tracks.map(track => ({
      ...track,
      clips: track.clips.filter(clip => clip.id !== clipId),
    })));

    dispatch(removeClip(clipId));
  };

  // Time formatting
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 30); // Assuming 30fps

    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames
      .toString()
      .padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playbackRef.current) {
        cancelAnimationFrame(playbackRef.current);
      }
    };
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0a0a0a' }}>
      {/* Timeline Controls */}
      <Paper sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 0 }}>
        {/* Playback Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={() => setCurrentTimeLocal(0)}>
            <SkipPrevious />
          </IconButton>
          <IconButton size="small" onClick={handlePlayPause} color={isPlaying ? 'primary' : 'default'}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton size="small" onClick={handleStop}>
            <Stop />
          </IconButton>
          <IconButton size="small" onClick={() => setCurrentTimeLocal(duration)}>
            <SkipNext />
          </IconButton>
        </Box>

        {/* Timecode Display */}
        <Box sx={{ 
          backgroundColor: '#000', 
          px: 2, 
          py: 0.5, 
          borderRadius: 1,
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#00D9FF',
          minWidth: 120,
          textAlign: 'center',
        }}>
          {formatTime(currentTime)}
        </Box>

        {/* Zoom Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
          <IconButton size="small" onClick={handleZoomOut}>
            <ZoomOut />
          </IconButton>
          <Slider
            value={zoom}
            onChange={handleZoomSlider}
            min={0.1}
            max={10}
            step={0.1}
            sx={{ width: 100 }}
          />
          <IconButton size="small" onClick={handleZoomIn}>
            <ZoomIn />
          </IconButton>
        </Box>

        {/* Snap Controls */}
        <ToggleButton
          value="snap"
          selected={snapToGrid}
          onChange={() => setSnapToGrid(!snapToGrid)}
          size="small"
        >
          Snap
        </ToggleButton>

        {/* Tools */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
          <Tooltip title="Razor Tool">
            <IconButton size="small">
              <ContentCut />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Timeline Area */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Track Headers */}
        <Box sx={{ width: 150, backgroundColor: '#1a1a1a', borderRight: '1px solid #2a2a2a' }}>
          <Box sx={{ height: 30, borderBottom: '1px solid #2a2a2a' }} />
          {tracks.map(track => (
            <Box
              key={track.id}
              sx={{
                height: track.height,
                borderBottom: '1px solid #2a2a2a',
                display: 'flex',
                alignItems: 'center',
                px: 1,
                gap: 0.5,
              }}
            >
              <Typography variant="caption" sx={{ flex: 1 }}>
                {track.name}
              </Typography>
              <IconButton
                size="small"
                onClick={() => toggleTrackLock(track.id)}
                sx={{ p: 0.25 }}
              >
                <Lock sx={{ fontSize: 14, color: track.locked ? '#ff4081' : '#666' }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => toggleTrackVisibility(track.id)}
                sx={{ p: 0.25 }}
              >
                {track.visible ? (
                  <Visibility sx={{ fontSize: 14 }} />
                ) : (
                  <VisibilityOff sx={{ fontSize: 14, color: '#666' }} />
                )}
              </IconButton>
              {track.type === 'audio' && (
                <IconButton
                  size="small"
                  onClick={() => toggleTrackMute(track.id)}
                  sx={{ p: 0.25 }}
                >
                  <VolumeUp sx={{ fontSize: 14, color: track.muted ? '#ff4081' : '#666' }} />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>

        {/* Timeline Content */}
        <Box sx={{ flex: 1, overflow: 'auto', position: 'relative' }} ref={timelineRef}>
          {/* Ruler */}
          <TimelineRuler
            duration={duration}
            zoom={zoom}
            currentTime={currentTime}
            height={30}
          />
          
          {/* Tracks */}
          <Box sx={{ position: 'relative' }}>
            {tracks.map(track => (
              <TimelineTrack
                key={track.id}
                track={track}
                zoom={zoom}
                currentTime={currentTime}
                onAddClip={handleAddClip}
                onMoveClip={handleMoveClip}
                onDeleteClip={handleDeleteClip}
                selectedClip={selectedClip}
                onSelectClip={setSelectedClip}
              />
            ))}
            
            {/* Playhead */}
            <Box
              sx={{
                position: 'absolute',
                left: currentTime * zoom * 10,
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: '#ff4081',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Timeline;