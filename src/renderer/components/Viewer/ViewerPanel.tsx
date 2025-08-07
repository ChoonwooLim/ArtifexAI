import React, { useRef, useEffect, useState } from 'react';
import { Box, IconButton, Typography, Slider, styled } from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Fullscreen as FullscreenIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  CenterFocusStrong as FitIcon,
} from '@mui/icons-material';

const ViewerContainer = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#0a0a0a',
  position: 'relative',
  overflow: 'hidden',
}));

const Canvas = styled('canvas')({
  width: '100%',
  height: '100%',
  backgroundColor: '#000000',
  objectFit: 'contain',
});

const ControlBar = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(10px)',
  gap: theme.spacing(1),
}));

const InfoOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  pointerEvents: 'none',
}));

const ViewerPanel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [totalFrames] = useState(250);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 샘플 렌더링
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 그리드 그리기
        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 50) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 50) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }
        
        // 중앙 텍스트
        ctx.fillStyle = '#606060';
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Viewer Preview', canvas.width / 2, canvas.height / 2);
      }
    }
  }, []);

  const handleFrameChange = (event: Event, value: number | number[]) => {
    setCurrentFrame(value as number);
  };

  return (
    <ViewerContainer>
      <Canvas ref={canvasRef} />
      
      <InfoOverlay>
        <Typography variant="caption" sx={{ color: '#00e5ff' }}>
          {`${zoom}% | 1920x1080 | 24fps`}
        </Typography>
        <Typography variant="caption" sx={{ color: '#606060' }}>
          {`Frame ${currentFrame} / ${totalFrames}`}
        </Typography>
      </InfoOverlay>
      
      <ControlBar>
        <IconButton 
          size="small" 
          onClick={() => setPlaying(!playing)}
          sx={{ color: '#fff' }}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
        
        <Slider
          value={currentFrame}
          onChange={handleFrameChange}
          min={1}
          max={totalFrames}
          sx={{ 
            flex: 1,
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
            },
            '& .MuiSlider-rail': {
              height: 2,
            },
            '& .MuiSlider-track': {
              height: 2,
            }
          }}
        />
        
        <Typography variant="caption" sx={{ minWidth: 60, color: '#808080' }}>
          {`${currentFrame}/${totalFrames}`}
        </Typography>
        
        <IconButton size="small" sx={{ color: '#fff' }}>
          <FitIcon fontSize="small" />
        </IconButton>
        
        <IconButton size="small" sx={{ color: '#fff' }}>
          <RefreshIcon fontSize="small" />
        </IconButton>
        
        <IconButton size="small" sx={{ color: '#fff' }}>
          <SettingsIcon fontSize="small" />
        </IconButton>
        
        <IconButton size="small" sx={{ color: '#fff' }}>
          <FullscreenIcon fontSize="small" />
        </IconButton>
      </ControlBar>
    </ViewerContainer>
  );
};

export default ViewerPanel;