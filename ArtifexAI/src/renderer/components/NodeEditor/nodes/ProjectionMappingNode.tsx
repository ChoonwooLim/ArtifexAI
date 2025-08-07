/**
 * Projection Mapping Node - For media art and architectural projection
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Paper, Typography, Chip, IconButton, Grid } from '@mui/material';
import { 
  ViewInAr, 
  GridOn, 
  Transform,
  Tune,
  Wallpaper,
  Architecture
} from '@mui/icons-material';

interface ProjectionMappingNodeData {
  label: string;
  mode: 'planar' | 'cylindrical' | 'spherical' | 'mesh' | 'architectural';
  surfaces: number;
  resolution: string;
  edgeBlending: boolean;
  cornerPinning: boolean;
  meshWarping: boolean;
  calibration: {
    points: Array<{x: number, y: number}>;
    homography: number[][];
  };
  projectors: Array<{
    id: string;
    position: {x: number, y: number, z: number};
    rotation: {x: number, y: number, z: number};
    fov: number;
    resolution: string;
    brightness: number;
    contrast: number;
  }>;
}

const ProjectionMappingNode: React.FC<NodeProps<ProjectionMappingNodeData>> = ({ data, selected }) => {
  const getModeIcon = () => {
    switch (data.mode) {
      case 'architectural': return <Architecture sx={{ fontSize: 16 }} />;
      case 'mesh': return <ViewInAr sx={{ fontSize: 16 }} />;
      case 'cylindrical': return <Wallpaper sx={{ fontSize: 16 }} />;
      default: return <GridOn sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <Paper
      sx={{
        p: 1.5,
        minWidth: 220,
        bgcolor: selected ? '#8e24aa' : '#2d2d2d',
        border: selected ? '2px solid #ab47bc' : '1px solid #7b1fa2',
        borderRadius: 2,
        background: selected 
          ? 'linear-gradient(135deg, #8e24aa 0%, #5e35b1 100%)'
          : 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
      }}
      elevation={selected ? 8 : 2}
    >
      {/* Input handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="video"
        style={{
          background: '#4caf50',
          width: 12,
          height: 12,
          top: '25%',
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
          top: '50%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="calibration"
        style={{
          background: '#ff9800',
          width: 10,
          height: 10,
          top: '75%',
        }}
      />

      {/* Node header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {getModeIcon()}
        <Typography variant="subtitle2" fontWeight={600}>
          {data.label || 'Projection Mapping'}
        </Typography>
      </Box>

      {/* Mode and surface info */}
      <Box sx={{ mb: 1 }}>
        <Chip
          label={data.mode}
          size="small"
          color="secondary"
          variant="outlined"
          sx={{ fontSize: 10, mr: 0.5 }}
        />
        <Chip
          label={`${data.surfaces || 1} surfaces`}
          size="small"
          sx={{ fontSize: 10 }}
        />
      </Box>

      {/* Resolution */}
      <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
        Output: {data.resolution || '1920x1080'}
      </Typography>

      {/* Features grid */}
      <Grid container spacing={0.5} sx={{ mt: 1 }}>
        {data.edgeBlending && (
          <Grid item>
            <Chip label="Edge Blend" size="small" sx={{ fontSize: 9, height: 18 }} />
          </Grid>
        )}
        {data.cornerPinning && (
          <Grid item>
            <Chip label="Corner Pin" size="small" sx={{ fontSize: 9, height: 18 }} />
          </Grid>
        )}
        {data.meshWarping && (
          <Grid item>
            <Chip label="Mesh Warp" size="small" sx={{ fontSize: 9, height: 18 }} />
          </Grid>
        )}
      </Grid>

      {/* Projector count */}
      {data.projectors && data.projectors.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
            Projectors: {data.projectors.length}
          </Typography>
        </Box>
      )}

      {/* Control buttons */}
      <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
        <IconButton size="small" sx={{ p: 0.5 }}>
          <GridOn sx={{ fontSize: 14 }} />
        </IconButton>
        <IconButton size="small" sx={{ p: 0.5 }}>
          <Transform sx={{ fontSize: 14 }} />
        </IconButton>
        <IconButton size="small" sx={{ p: 0.5 }}>
          <Tune sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      {/* Output handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          background: '#ab47bc',
          width: 12,
          height: 12,
          top: '33%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="preview"
        style={{
          background: '#7e57c2',
          width: 10,
          height: 10,
          top: '66%',
        }}
      />
    </Paper>
  );
};

export default memo(ProjectionMappingNode);