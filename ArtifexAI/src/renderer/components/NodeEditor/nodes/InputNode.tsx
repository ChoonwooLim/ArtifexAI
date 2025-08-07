import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { VideoFile, Image, AudioFile } from '@mui/icons-material';

const InputNode = ({ data, selected }: any) => {
  const getIcon = () => {
    switch (data.type) {
      case 'video': return <VideoFile sx={{ fontSize: 16 }} />;
      case 'image': return <Image sx={{ fontSize: 16 }} />;
      case 'audio': return <AudioFile sx={{ fontSize: 16 }} />;
      default: return null;
    }
  };

  return (
    <Paper
      elevation={selected ? 8 : 2}
      sx={{
        minWidth: 180,
        background: '#0d7377',
        border: selected ? '2px solid #00D9FF' : '1px solid #0a5d61',
        borderRadius: 2,
      }}
    >
      <Box sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {getIcon()}
          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
            {data.label || 'Input'}
          </Typography>
        </Box>
        
        {data.path && (
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }} noWrap>
            {data.path.split('/').pop()}
          </Typography>
        )}
        
        {data.type && (
          <Chip 
            label={data.type} 
            size="small" 
            sx={{ 
              mt: 0.5,
              height: 18,
              backgroundColor: 'rgba(0,217,255,0.2)',
              color: '#00D9FF',
            }} 
          />
        )}
      </Box>
      
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ background: '#00D9FF' }}
      />
    </Paper>
  );
};

export default InputNode;