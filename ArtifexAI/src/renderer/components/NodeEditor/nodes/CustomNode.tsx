import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography, Paper } from '@mui/material';

const CustomNode = ({ data, selected }: any) => {
  return (
    <Paper
      elevation={selected ? 8 : 2}
      sx={{
        minWidth: 200,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: selected ? '2px solid #00D9FF' : '1px solid #444',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 1.5 }}>
        <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
          {data.label || 'Custom Node'}
        </Typography>
        {data.description && (
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {data.description}
          </Typography>
        )}
      </Box>
      
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#00D9FF' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#00D9FF' }}
      />
    </Paper>
  );
};

export default CustomNode;