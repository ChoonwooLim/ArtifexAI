import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography, Paper, Select, MenuItem } from '@mui/material';
import { Save } from '@mui/icons-material';

const OutputNode = ({ data, selected }: any) => {
  return (
    <Paper
      elevation={selected ? 8 : 2}
      sx={{
        minWidth: 180,
        background: '#ff6b6b',
        border: selected ? '2px solid #00D9FF' : '1px solid #ff5252',
        borderRadius: 2,
      }}
    >
      <Box sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Save sx={{ fontSize: 16, color: 'white' }} />
          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
            {data.label || 'Output'}
          </Typography>
        </Box>
        
        <Select
          size="small"
          value={data.format || 'mp4'}
          sx={{
            width: '100%',
            height: 24,
            fontSize: 12,
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: 'white',
            '& .MuiSelect-icon': { color: 'white' },
          }}
        >
          <MenuItem value="mp4">MP4</MenuItem>
          <MenuItem value="avi">AVI</MenuItem>
          <MenuItem value="mov">MOV</MenuItem>
          <MenuItem value="webm">WebM</MenuItem>
        </Select>
        
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
          Quality: {data.quality || 'High'}
        </Typography>
      </Box>
      
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: '#00D9FF' }}
      />
    </Paper>
  );
};

export default OutputNode;