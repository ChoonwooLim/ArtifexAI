/**
 * Composite Node - Combines multiple inputs like Nuke's Merge node
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Paper, Typography, Select, MenuItem, FormControl } from '@mui/material';
import { Layers, BlendingMode } from '@mui/icons-material';

interface CompositeNodeData {
  label: string;
  mode: 'over' | 'add' | 'multiply' | 'screen' | 'overlay' | 'difference' | 'subtract';
  opacity: number;
  mixRatio?: number;
}

const CompositeNode: React.FC<NodeProps<CompositeNodeData>> = ({ data, selected }) => {
  const blendModes = [
    { value: 'over', label: 'Over' },
    { value: 'add', label: 'Add' },
    { value: 'multiply', label: 'Multiply' },
    { value: 'screen', label: 'Screen' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'difference', label: 'Difference' },
    { value: 'subtract', label: 'Subtract' },
  ];

  return (
    <Paper
      sx={{
        p: 1.5,
        minWidth: 160,
        bgcolor: selected ? '#0d7377' : '#2d2d2d',
        border: selected ? '2px solid #14a1a5' : '1px solid #666',
        borderRadius: 2,
      }}
      elevation={selected ? 8 : 2}
    >
      {/* Multiple input handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="input1"
        style={{
          background: '#ff6b6b',
          width: 10,
          height: 10,
          top: '30%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="input2"
        style={{
          background: '#4caf50',
          width: 10,
          height: 10,
          top: '50%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="mask"
        style={{
          background: '#fff',
          width: 10,
          height: 10,
          top: '70%',
        }}
      />

      {/* Node content */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Layers sx={{ fontSize: 16, color: '#9c27b0' }} />
        <Typography variant="subtitle2" fontWeight={600}>
          {data.label || 'Composite'}
        </Typography>
      </Box>

      {/* Blend mode selector */}
      <FormControl size="small" fullWidth sx={{ mb: 1 }}>
        <Select
          value={data.mode || 'over'}
          sx={{
            fontSize: 11,
            height: 24,
            '& .MuiSelect-select': {
              py: 0.5,
            },
          }}
        >
          {blendModes.map((mode) => (
            <MenuItem key={mode.value} value={mode.value} sx={{ fontSize: 11 }}>
              {mode.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Opacity indicator */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
          Opacity
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 10 }}>
          {Math.round((data.opacity || 1) * 100)}%
        </Typography>
      </Box>

      {/* Mix ratio if applicable */}
      {data.mixRatio !== undefined && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
          <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
            Mix
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 10 }}>
            {Math.round(data.mixRatio * 100)}%
          </Typography>
        </Box>
      )}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          background: '#4caf50',
          width: 10,
          height: 10,
        }}
      />
    </Paper>
  );
};

export default memo(CompositeNode);