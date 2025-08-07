/**
 * AI Generator Node - Wan 2.2 and other AI model nodes
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Paper, Typography, Chip, LinearProgress } from '@mui/material';
import { AutoAwesome, VideoLibrary, MusicNote, RecordVoiceOver } from '@mui/icons-material';

interface AIGeneratorNodeData {
  label: string;
  model: string;
  prompt?: string;
  status?: 'idle' | 'processing' | 'complete' | 'error';
  progress?: number;
  settings?: any;
}

const AIGeneratorNode: React.FC<NodeProps<AIGeneratorNodeData>> = ({ data, selected }) => {
  const getIcon = () => {
    if (data.model?.includes('t2v') || data.model?.includes('i2v')) {
      return <VideoLibrary sx={{ fontSize: 16 }} />;
    }
    if (data.model?.includes('music')) {
      return <MusicNote sx={{ fontSize: 16 }} />;
    }
    if (data.model?.includes('voice')) {
      return <RecordVoiceOver sx={{ fontSize: 16 }} />;
    }
    return <AutoAwesome sx={{ fontSize: 16 }} />;
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'processing': return 'warning';
      case 'complete': return 'success';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  return (
    <Paper
      sx={{
        p: 1.5,
        minWidth: 200,
        bgcolor: selected ? '#0d7377' : '#2d2d2d',
        border: selected ? '2px solid #14a1a5' : '1px solid #4a90e2',
        borderRadius: 2,
        position: 'relative',
      }}
      elevation={selected ? 8 : 2}
    >
      {/* Input handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="prompt"
        style={{
          background: '#9c27b0',
          width: 10,
          height: 10,
          top: '30%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="image"
        style={{
          background: '#ff9800',
          width: 10,
          height: 10,
          top: '50%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="settings"
        style={{
          background: '#666',
          width: 10,
          height: 10,
          top: '70%',
        }}
      />

      {/* Node content */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {getIcon()}
        <Typography variant="subtitle2" fontWeight={600}>
          {data.label || 'AI Generator'}
        </Typography>
      </Box>

      <Box sx={{ mb: 1 }}>
        <Chip
          label={data.model || 'wan2.2-t2v'}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontSize: 10 }}
        />
      </Box>

      {data.prompt && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: '#b0b0b0',
            fontSize: 10,
            mb: 1,
            maxWidth: 180,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          "{data.prompt}"
        </Typography>
      )}

      {data.status === 'processing' && (
        <Box sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={data.progress || 0}
            sx={{ height: 2, borderRadius: 1 }}
          />
          <Typography variant="caption" sx={{ fontSize: 9, color: '#b0b0b0' }}>
            {data.progress || 0}%
          </Typography>
        </Box>
      )}

      {data.status && data.status !== 'idle' && (
        <Chip
          label={data.status}
          size="small"
          color={getStatusColor()}
          sx={{ fontSize: 9, height: 16, mt: 0.5 }}
        />
      )}

      {/* Settings preview */}
      {data.settings && (
        <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {data.settings.resolution && (
            <Chip label={data.settings.resolution} size="small" sx={{ fontSize: 9, height: 16 }} />
          )}
          {data.settings.fps && (
            <Chip label={`${data.settings.fps}fps`} size="small" sx={{ fontSize: 9, height: 16 }} />
          )}
          {data.settings.duration && (
            <Chip label={`${data.settings.duration}s`} size="small" sx={{ fontSize: 9, height: 16 }} />
          )}
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

export default memo(AIGeneratorNode);