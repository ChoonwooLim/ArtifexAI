import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close, DragIndicator } from '@mui/icons-material';
import { useDrag } from 'react-dnd';
import { TimelineClipData } from './Timeline';

interface TimelineClipProps {
  clip: TimelineClipData;
  zoom: number;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (newStartTime: number) => void;
  onDelete: () => void;
  trackHeight: number;
}

const TimelineClip: React.FC<TimelineClipProps> = ({
  clip,
  zoom,
  isSelected,
  onSelect,
  onMove,
  onDelete,
  trackHeight,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const pixelsPerSecond = zoom * 10;
  const clipWidth = clip.duration * pixelsPerSecond;
  const clipLeft = clip.startTime * pixelsPerSecond;

  // Setup drag
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'clip',
    item: {
      type: 'clip',
      clipId: clip.id,
      startTime: clip.startTime,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [clip.id, clip.startTime]);

  const getClipColor = () => {
    if (clip.type === 'video') return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    if (clip.type === 'audio') return 'linear-gradient(135deg, #0d7377 0%, #14b8a6 100%)';
    if (clip.type === 'image') return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    if (clip.type === 'text') return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    if (clip.type === 'effect') return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
    return '#444';
  };

  // Handle resize
  const handleResizeStart = (e: React.MouseEvent, side: 'left' | 'right') => {
    e.stopPropagation();
    const startX = e.clientX;
    const startDuration = clip.duration;
    const startTime = clip.startTime;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaTime = deltaX / pixelsPerSecond;

      if (side === 'right') {
        const newDuration = Math.max(0.1, startDuration + deltaTime);
        // Update clip duration
        // This would need to be connected to state management
      } else {
        const newStartTime = Math.max(0, startTime + deltaTime);
        const newDuration = Math.max(0.1, startDuration - deltaTime);
        onMove(newStartTime);
        // Update duration as well
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <Box
      ref={preview}
      sx={{
        position: 'absolute',
        left: clipLeft,
        top: 4,
        width: clipWidth,
        height: trackHeight - 8,
        background: getClipColor(),
        borderRadius: 1,
        border: isSelected ? '2px solid #00D9FF' : '1px solid rgba(255,255,255,0.2)',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
        boxShadow: isSelected ? '0 0 20px rgba(0,217,255,0.5)' : 'none',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        },
      }}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle */}
      <Box
        ref={drag}
        sx={{
          position: 'absolute',
          top: 2,
          left: 2,
          cursor: 'move',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      >
        <DragIndicator sx={{ fontSize: 16, color: 'white' }} />
      </Box>

      {/* Clip Content */}
      <Box sx={{ p: 0.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Thumbnail */}
        {clip.thumbnail && clipWidth > 40 && (
          <Box
            sx={{
              flex: 1,
              backgroundImage: `url(${clip.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 0.5,
              mb: 0.5,
            }}
          />
        )}
        
        {/* Clip Name */}
        {clipWidth > 60 && (
          <Typography
            variant="caption"
            sx={{
              color: 'white',
              fontSize: 10,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {clip.name}
          </Typography>
        )}
      </Box>

      {/* Delete Button */}
      {isHovered && !isDragging && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          sx={{
            position: 'absolute',
            top: 2,
            right: 2,
            p: 0.25,
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,0,0,0.5)',
            },
          }}
        >
          <Close sx={{ fontSize: 14 }} />
        </IconButton>
      )}

      {/* Resize Handles */}
      {isSelected && !isDragging && (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              cursor: 'ew-resize',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(0,217,255,0.5)',
              },
            }}
            onMouseDown={(e) => handleResizeStart(e, 'left')}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 4,
              cursor: 'ew-resize',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(0,217,255,0.5)',
              },
            }}
            onMouseDown={(e) => handleResizeStart(e, 'right')}
          />
        </>
      )}

      {/* Transitions */}
      {clip.transitions && clip.transitions.length > 0 && (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 20,
              height: 20,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" sx={{ fontSize: 8, color: 'white' }}>
              T
            </Typography>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 20,
              height: 20,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" sx={{ fontSize: 8, color: 'white' }}>
              T
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default TimelineClip;