import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography, Paper, Slider, Select, MenuItem } from '@mui/material';
import { Settings } from '@mui/icons-material';

const ProcessNode = ({ data, selected }: any) => {
  return (
    <Paper
      elevation={selected ? 8 : 2}
      sx={{
        minWidth: 200,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: selected ? '2px solid #00D9FF' : '1px solid #544b63',
        borderRadius: 2,
      }}
    >
      <Box sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Settings sx={{ fontSize: 16, color: 'white' }} />
          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
            {data.label || 'Process'}
          </Typography>
        </Box>
        
        {data.processType && (
          <Select
            size="small"
            value={data.processType}
            sx={{
              width: '100%',
              height: 24,
              fontSize: 12,
              mb: 1,
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              '& .MuiSelect-icon': { color: 'white' },
            }}
          >
            <MenuItem value="blur">Blur</MenuItem>
            <MenuItem value="sharpen">Sharpen</MenuItem>
            <MenuItem value="denoise">Denoise</MenuItem>
            <MenuItem value="stabilize">Stabilize</MenuItem>
            <MenuItem value="resize">Resize</MenuItem>
          </Select>
        )}
        
        {data.intensity !== undefined && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Intensity: {data.intensity}%
            </Typography>
            <Slider
              size="small"
              value={data.intensity}
              sx={{
                color: '#00D9FF',
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                },
              }}
            />
          </Box>
        )}
      </Box>
      
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: '#00D9FF' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ background: '#00D9FF' }}
      />
    </Paper>
  );
};

export default ProcessNode;