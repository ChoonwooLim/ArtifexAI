/**
 * Preview Panel - Real-time video preview component
 * Supports WebGL rendering, real-time effects, and playback control
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Paper, IconButton, Slider, Typography, Menu, MenuItem, Tooltip } from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Fullscreen,
  Settings,
  AspectRatio,
  HighQuality,
  Speed,
  Layers,
  Refresh,
  VolumeUp,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setPreviewQuality, setPreviewResolution } from '../../store/slices/previewSlice';

interface PreviewPanelProps {
  source?: 'timeline' | 'node' | 'file';
  mediaUrl?: string;
  onTimeUpdate?: (time: number) => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ 
  source = 'timeline', 
  mediaUrl,
  onTimeUpdate 
}) => {
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [qualityMenu, setQualityMenu] = useState<null | HTMLElement>(null);
  const [resolution, setResolution] = useState('1920x1080');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');
  const [showOverlay, setShowOverlay] = useState(false);
  const [fps, setFps] = useState(0);

  const timelineState = useSelector((state: RootState) => state.timeline);
  const nodeEditorState = useSelector((state: RootState) => state.nodeEditor);
  const previewState = useSelector((state: RootState) => state.preview);

  // Initialize WebGL context
  useEffect(() => {
    if (canvasRef.current) {
      const gl = canvasRef.current.getContext('webgl2') || canvasRef.current.getContext('webgl');
      if (gl) {
        // Setup WebGL for rendering
        gl.clearColor(0.05, 0.05, 0.05, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    }
  }, []);

  // Handle video source
  useEffect(() => {
    if (videoRef.current && mediaUrl) {
      videoRef.current.src = mediaUrl;
      videoRef.current.load();
    }
  }, [mediaUrl]);

  // Render frame
  const renderFrame = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render based on source
    if (source === 'file' && videoRef.current && videoRef.current.readyState >= 2) {
      // Render video frame
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    } else if (source === 'timeline') {
      // Render timeline composite
      renderTimelineFrame(ctx);
    } else if (source === 'node') {
      // Render node output
      renderNodeOutput(ctx);
    }

    // Apply preview effects
    applyPreviewEffects(ctx);

    // Update FPS counter
    updateFPS();
  }, [source]);

  // Render timeline frame
  const renderTimelineFrame = (ctx: CanvasRenderingContext2D) => {
    // This would composite all timeline tracks
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw placeholder
    ctx.fillStyle = '#00D9FF';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Timeline Preview', ctx.canvas.width / 2, ctx.canvas.height / 2);
  };

  // Render node output
  const renderNodeOutput = (ctx: CanvasRenderingContext2D) => {
    // This would render the node graph output
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw placeholder
    ctx.fillStyle = '#667eea';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Node Output', ctx.canvas.width / 2, ctx.canvas.height / 2);
  };

  // Apply preview effects
  const applyPreviewEffects = (ctx: CanvasRenderingContext2D) => {
    if (quality === 'low') {
      // Apply pixelation for low quality preview
      const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      const pixelSize = 4;
      
      for (let y = 0; y < ctx.canvas.height; y += pixelSize) {
        for (let x = 0; x < ctx.canvas.width; x += pixelSize) {
          const index = (y * ctx.canvas.width + x) * 4;
          const r = imageData.data[index];
          const g = imageData.data[index + 1];
          const b = imageData.data[index + 2];
          
          for (let py = 0; py < pixelSize; py++) {
            for (let px = 0; px < pixelSize; px++) {
              const targetIndex = ((y + py) * ctx.canvas.width + (x + px)) * 4;
              imageData.data[targetIndex] = r;
              imageData.data[targetIndex + 1] = g;
              imageData.data[targetIndex + 2] = b;
            }
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
  };

  // FPS counter
  const updateFPS = (() => {
    let lastTime = performance.now();
    let frameCount = 0;
    
    return () => {
      frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime;
      
      if (elapsed >= 1000) {
        setFps(Math.round(frameCount * 1000 / elapsed));
        frameCount = 0;
        lastTime = currentTime;
      }
    };
  })();

  // Animation loop
  const animate = useCallback(() => {
    renderFrame();
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isPlaying, renderFrame]);

  // Playback controls
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (event: Event, value: number | number[]) => {
    const time = value as number;
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    if (onTimeUpdate) {
      onTimeUpdate(time);
    }
  };

  const handleVolumeChange = (event: Event, value: number | number[]) => {
    const vol = value as number;
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  const handleFullscreen = () => {
    if (canvasRef.current) {
      if (canvasRef.current.requestFullscreen) {
        canvasRef.current.requestFullscreen();
      }
    }
  };

  const handleQualityChange = (newQuality: typeof quality) => {
    setQuality(newQuality);
    dispatch(setPreviewQuality(newQuality));
    setQualityMenu(null);
  };

  const handleResolutionChange = (newResolution: string) => {
    setResolution(newResolution);
    dispatch(setPreviewResolution(newResolution));
    
    // Update canvas size
    if (canvasRef.current) {
      const [width, height] = newResolution.split('x').map(Number);
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }
  };

  // Start animation loop
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [onTimeUpdate]);

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#0a0a0a' }}>
      {/* Preview Area */}
      <Box sx={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            backgroundColor: '#000',
          }}
        />
        
        <video
          ref={videoRef}
          style={{ display: 'none' }}
          playsInline
        />

        {/* Overlay Info */}
        {showOverlay && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: 1,
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" sx={{ color: '#00D9FF', display: 'block' }}>
              {resolution} @ {fps} FPS
            </Typography>
            <Typography variant="caption" sx={{ color: '#00D9FF', display: 'block' }}>
              Quality: {quality}
            </Typography>
            <Typography variant="caption" sx={{ color: '#00D9FF', display: 'block' }}>
              Source: {source}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Controls */}
      <Box sx={{ p: 1, borderTop: '1px solid #2a2a2a' }}>
        {/* Timeline */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="caption" sx={{ minWidth: 50, textAlign: 'right' }}>
            {formatTime(currentTime)}
          </Typography>
          <Slider
            value={currentTime}
            max={duration}
            onChange={handleSeek}
            sx={{ flex: 1 }}
          />
          <Typography variant="caption" sx={{ minWidth: 50 }}>
            {formatTime(duration)}
          </Typography>
        </Box>

        {/* Playback Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" onClick={handlePlayPause}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton size="small" onClick={handleStop}>
            <Stop />
          </IconButton>
          
          <Box sx={{ flex: 1 }} />
          
          {/* Volume */}
          <VolumeUp sx={{ fontSize: 18, color: '#666' }} />
          <Slider
            value={volume}
            max={1}
            step={0.01}
            onChange={handleVolumeChange}
            sx={{ width: 80 }}
          />
          
          {/* Speed */}
          <Tooltip title="Playback Speed">
            <IconButton size="small">
              <Speed />
            </IconButton>
          </Tooltip>
          
          {/* Quality */}
          <Tooltip title="Preview Quality">
            <IconButton
              size="small"
              onClick={(e) => setQualityMenu(e.currentTarget)}
            >
              <HighQuality />
            </IconButton>
          </Tooltip>
          
          {/* Overlay */}
          <Tooltip title="Show Info">
            <IconButton
              size="small"
              onClick={() => setShowOverlay(!showOverlay)}
              color={showOverlay ? 'primary' : 'default'}
            >
              <Layers />
            </IconButton>
          </Tooltip>
          
          {/* Fullscreen */}
          <Tooltip title="Fullscreen">
            <IconButton size="small" onClick={handleFullscreen}>
              <Fullscreen />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Quality Menu */}
      <Menu
        anchorEl={qualityMenu}
        open={Boolean(qualityMenu)}
        onClose={() => setQualityMenu(null)}
      >
        <MenuItem onClick={() => handleQualityChange('low')}>Low (Draft)</MenuItem>
        <MenuItem onClick={() => handleQualityChange('medium')}>Medium</MenuItem>
        <MenuItem onClick={() => handleQualityChange('high')}>High</MenuItem>
        <MenuItem onClick={() => handleQualityChange('ultra')}>Ultra</MenuItem>
      </Menu>
    </Paper>
  );
};

// Helper function
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default PreviewPanel;