import React from 'react';
import { Box, Typography } from '@mui/material';

interface TimelineRulerProps {
  duration: number;
  zoom: number;
  currentTime: number;
  height: number;
}

const TimelineRuler: React.FC<TimelineRulerProps> = ({ duration, zoom, currentTime, height }) => {
  const pixelsPerSecond = zoom * 10;
  const totalWidth = duration * pixelsPerSecond;

  // Calculate ruler marks
  const getTimeMarks = () => {
    const marks = [];
    let interval = 1; // seconds

    if (zoom < 0.5) interval = 10;
    else if (zoom < 1) interval = 5;
    else if (zoom > 5) interval = 0.5;
    else if (zoom > 10) interval = 0.1;

    for (let time = 0; time <= duration; time += interval) {
      marks.push({
        time,
        position: time * pixelsPerSecond,
        label: formatTimeLabel(time),
        major: time % (interval * 10) === 0,
      });
    }

    return marks;
  };

  const formatTimeLabel = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      sx={{
        height,
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid #2a2a2a',
        position: 'relative',
        width: totalWidth,
        minWidth: '100%',
      }}
    >
      {getTimeMarks().map((mark) => (
        <Box
          key={mark.time}
          sx={{
            position: 'absolute',
            left: mark.position,
            top: 0,
            height: '100%',
          }}
        >
          <Box
            sx={{
              width: 1,
              height: mark.major ? '100%' : '50%',
              backgroundColor: mark.major ? '#666' : '#444',
              position: 'absolute',
              bottom: 0,
            }}
          />
          {(mark.major || zoom > 2) && (
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                top: 2,
                left: 2,
                fontSize: 10,
                color: '#888',
                userSelect: 'none',
              }}
            >
              {mark.label}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default TimelineRuler;