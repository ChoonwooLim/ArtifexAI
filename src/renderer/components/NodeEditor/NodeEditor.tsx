import React from 'react';
import { Box, Typography } from '@mui/material';

const NodeEditor: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        color: '#808080',
        flexDirection: 'column',
        gap: 2,
        overflow: 'hidden',
      }}
    >
      <Typography variant="h6">Node Editor</Typography>
      <Typography variant="body2" color="text.secondary">
        Node-based compositing workspace
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Coming soon: Full node graph implementation
      </Typography>
    </Box>
  );
};

export default NodeEditor;