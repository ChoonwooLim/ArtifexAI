/**
 * Anamorphic Display Node - For anamorphic and forced perspective content
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Paper, Typography, Slider, Chip, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { 
  AspectRatio, 
  CropFree,
  ThreeDRotation,
  Visibility,
  GridView,
  Architecture
} from '@mui/icons-material';

interface AnamorphicNodeData {
  label: string;
  displayType: 'led_wall' | 'corner_display' | 'cylinder' | 'custom_3d';
  perspective: {
    fov: number;
    viewpointX: number;
    viewpointY: number;
    viewpointZ: number;
    targetX: number;
    targetY: number;
    targetZ: number;
  };
  distortion: {
    type: 'linear' | 'radial' | 'polynomial' | 'mesh';
    k1: number;
    k2: number;
    k3: number;
    p1: number;
    p2: number;
  };
  display: {
    width: number;
    height: number;
    pixelPitch: number;
    viewingAngle: number;
    curvature: number;
  };
  gridCorrection: boolean;
  depthLayers: number;
  parallaxIntensity: number;
  previewAngle: number;
}

const AnamorphicNode: React.FC<NodeProps<AnamorphicNodeData>> = ({ data, selected }) => {
  const getDisplayIcon = () => {
    switch (data.displayType) {
      case 'led_wall': return <GridView sx={{ fontSize: 16 }} />;
      case 'corner_display': return <Architecture sx={{ fontSize: 16 }} />;
      case 'cylinder': return <CropFree sx={{ fontSize: 16 }} />;
      default: return <ThreeDRotation sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <Paper
      sx={{
        p: 1.5,
        minWidth: 240,
        bgcolor: selected ? '#00acc1' : '#2d2d2d',
        border: selected ? '2px solid #00e5ff' : '1px solid #0097a7',
        borderRadius: 2,
        background: selected
          ? 'linear-gradient(135deg, #00acc1 0%, #0097a7 100%)'
          : 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
      }}
      elevation={selected ? 8 : 2}
    >
      {/* Input handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{
          background: '#4caf50',
          width: 12,
          height: 12,
          top: '30%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="depth"
        style={{
          background: '#2196f3',
          width: 10,
          height: 10,
          top: '50%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="camera"
        style={{
          background: '#ff9800',
          width: 10,
          height: 10,
          top: '70%',
        }}
      />

      {/* Node header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <AspectRatio sx={{ fontSize: 18, color: '#00e5ff' }} />
        <Typography variant="subtitle2" fontWeight={600}>
          {data.label || 'Anamorphic Display'}
        </Typography>
      </Box>

      {/* Display type */}
      <Box sx={{ mb: 1 }}>
        <ToggleButtonGroup
          value={data.displayType}
          exclusive
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              py: 0.25,
              px: 0.75,
              fontSize: 10,
            },
          }}
        >
          <ToggleButton value="led_wall">
            LED Wall
          </ToggleButton>
          <ToggleButton value="corner_display">
            Corner
          </ToggleButton>
          <ToggleButton value="cylinder">
            Cylinder
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Perspective controls */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
          FOV: {data.perspective?.fov || 60}°
        </Typography>
        <Slider
          value={data.perspective?.fov || 60}
          min={30}
          max={120}
          size="small"
          sx={{ py: 0.5 }}
        />
      </Box>

      {/* Depth layers */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
          Depth Layers
        </Typography>
        <Chip
          label={data.depthLayers || 5}
          size="small"
          sx={{ fontSize: 9, height: 16 }}
        />
      </Box>

      {/* Parallax control */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
          Parallax: {Math.round((data.parallaxIntensity || 0.5) * 100)}%
        </Typography>
        <Slider
          value={data.parallaxIntensity || 0.5}
          min={0}
          max={1}
          step={0.1}
          size="small"
          sx={{ py: 0.5 }}
        />
      </Box>

      {/* Display specs */}
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
        <Chip
          label={`${data.display?.width || 1920}×${data.display?.height || 1080}`}
          size="small"
          sx={{ fontSize: 9, height: 16 }}
        />
        <Chip
          label={`${data.display?.pixelPitch || 2.5}mm`}
          size="small"
          sx={{ fontSize: 9, height: 16 }}
        />
      </Box>

      {/* Features */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {data.gridCorrection && (
          <Chip
            icon={<GridView sx={{ fontSize: 10 }} />}
            label="Grid"
            size="small"
            color="primary"
            sx={{ fontSize: 9, height: 18 }}
          />
        )}
        <Chip
          icon={<Visibility sx={{ fontSize: 10 }} />}
          label={`${data.previewAngle || 0}°`}
          size="small"
          sx={{ fontSize: 9, height: 18 }}
        />
      </Box>

      {/* Output handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          background: '#00e5ff',
          width: 12,
          height: 12,
          top: '30%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="preview"
        style={{
          background: '#00acc1',
          width: 10,
          height: 10,
          top: '50%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="depth_map"
        style={{
          background: '#0097a7',
          width: 10,
          height: 10,
          top: '70%',
        }}
      />
    </Paper>
  );
};

export default memo(AnamorphicNode);