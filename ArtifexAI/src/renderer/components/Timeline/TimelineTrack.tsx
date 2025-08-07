import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useDrop } from 'react-dnd';
import TimelineClip from './TimelineClip';
import { TimelineTrackData, TimelineClipData } from './Timeline';

interface TimelineTrackProps {
  track: TimelineTrackData;
  zoom: number;
  currentTime: number;
  onAddClip: (trackId: string, mediaId: string, position: number) => void;
  onMoveClip: (clipId: string, trackId: string, startTime: number) => void;
  onDeleteClip: (clipId: string) => void;
  selectedClip: string | null;
  onSelectClip: (clipId: string | null) => void;
}

const TimelineTrack: React.FC<TimelineTrackProps> = ({
  track,
  zoom,
  currentTime,
  onAddClip,
  onMoveClip,
  onDeleteClip,
  selectedClip,
  onSelectClip,
}) => {
  const pixelsPerSecond = zoom * 10;

  // Setup drag and drop
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['media', 'clip'],
    drop: (item: any, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const position = (delta.x + (item.startTime || 0) * pixelsPerSecond) / pixelsPerSecond;
        
        if (item.type === 'media') {
          onAddClip(track.id, item.mediaId, position);
        } else if (item.type === 'clip') {
          onMoveClip(item.clipId, track.id, position);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [track.id, pixelsPerSecond, onAddClip, onMoveClip]);

  const getTrackBackground = () => {
    if (track.type === 'video') return '#0d1117';
    if (track.type === 'audio') return '#0d1117';
    if (track.type === 'text') return '#0a0d11';
    if (track.type === 'effect') return '#0a0d11';
    return '#0d1117';
  };

  return (
    <Box
      ref={drop}
      sx={{
        height: track.height,
        backgroundColor: getTrackBackground(),
        borderBottom: '1px solid #2a2a2a',
        position: 'relative',
        opacity: track.visible ? 1 : 0.3,
        pointerEvents: track.locked ? 'none' : 'auto',
        transition: 'background-color 0.2s',
        '&:hover': {
          backgroundColor: isOver ? '#1a1d24' : '#12151a',
        },
      }}
    >
      {/* Grid lines */}
      {Array.from({ length: Math.floor(300 * zoom) }, (_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            left: i * 10 * zoom,
            top: 0,
            bottom: 0,
            width: 1,
            backgroundColor: '#1a1a1a',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Clips */}
      {track.clips.map((clip) => (
        <TimelineClip
          key={clip.id}
          clip={clip}
          zoom={zoom}
          isSelected={selectedClip === clip.id}
          onSelect={() => onSelectClip(clip.id)}
          onMove={(newStartTime) => onMoveClip(clip.id, track.id, newStartTime)}
          onDelete={() => onDeleteClip(clip.id)}
          trackHeight={track.height}
        />
      ))}
    </Box>
  );
};

export default TimelineTrack;