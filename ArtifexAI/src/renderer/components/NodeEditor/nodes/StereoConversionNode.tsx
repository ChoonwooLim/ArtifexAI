/**
 * Stereo 3D Conversion Node - 2D to 3D conversion and stereo processing
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Paper, Typography, Select, MenuItem, Chip, Switch, FormControlLabel } from '@mui/material';
import { 
  ThreeDRotation,
  Panorama,
  ViewInAr,
  Visibility,
  RemoveRedEye,
  Tune
} from '@mui/icons-material';

interface StereoConversionNodeData {
  label: string;
  mode: '2d_to_3d' | 'stereo_adjust' | 'anaglyph' | 'side_by_side' | 'top_bottom' | 'interlaced';
  conversionMethod: 'ai_depth' | 'motion_parallax' | 'manual_depth' | 'depth_map';
  stereoFormat: {
    input: 'mono' | 'sbs' | 'tab' | 'sequential';
    output: 'sbs' | 'tab' | 'anaglyph' | 'interlaced' | 'sequential' | 'vr180' | 'vr360';
  };
  depthSettings: {
    nearPlane: number;
    farPlane: number;
    convergence: number;
    interocular: number;
    depthBudget: number;
  };
  anaglyphMode?: 'red_cyan' | 'green_magenta' | 'amber_blue';
  aiDepthModel?: 'midas' | 'dpt' | 'zoe' | 'custom';
  temporalConsistency: boolean;
  edgePreservation: boolean;
  occlusionFilling: boolean;
  preview3D: boolean;
}

const StereoConversionNode: React.FC<NodeProps<StereoConversionNodeData>> = ({ data, selected }) => {
  const getModeIcon = () => {
    switch (data.mode) {
      case '2d_to_3d': return <ThreeDRotation sx={{ fontSize: 16 }} />;
      case 'anaglyph': return <RemoveRedEye sx={{ fontSize: 16 }} />;
      case 'side_by_side': return <Panorama sx={{ fontSize: 16 }} />;
      default: return <ViewInAr sx={{ fontSize: 16 }} />;
    }
  };

  const getConversionColor = () => {
    switch (data.conversionMethod) {
      case 'ai_depth': return '#4caf50';
      case 'motion_parallax': return '#2196f3';
      case 'manual_depth': return '#ff9800';
      default: return '#9c27b0';
    }
  };

  return (
    <Paper
      sx={{
        p: 1.5,
        minWidth: 260,
        bgcolor: selected ? '#e91e63' : '#2d2d2d',
        border: selected ? '2px solid #f50057' : '1px solid #c2185b',
        borderRadius: 2,
        background: selected
          ? 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)'
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
        id="depth"
        style={{
          background: '#2196f3',
          width: 10,
          height: 10,
          top: '45%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left_eye"
        style={{
          background: '#ff5722',
          width: 10,
          height: 10,
          top: '65%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="right_eye"
        style={{
          background: '#00bcd4',
          width: 10,
          height: 10,
          top: '85%',
        }}
      />

      {/* Node header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {getModeIcon()}
        <Typography variant="subtitle2" fontWeight={600}>
          {data.label || 'Stereo 3D Converter'}
        </Typography>
      </Box>

      {/* Conversion mode */}
      <Select
        value={data.mode}
        size="small"
        fullWidth
        sx={{
          fontSize: 11,
          height: 24,
          mb: 1,
          '& .MuiSelect-select': {
            py: 0.5,
          },
        }}
      >
        <MenuItem value="2d_to_3d" sx={{ fontSize: 11 }}>2D to 3D</MenuItem>
        <MenuItem value="stereo_adjust" sx={{ fontSize: 11 }}>Stereo Adjust</MenuItem>
        <MenuItem value="anaglyph" sx={{ fontSize: 11 }}>Anaglyph</MenuItem>
        <MenuItem value="side_by_side" sx={{ fontSize: 11 }}>Side by Side</MenuItem>
        <MenuItem value="top_bottom" sx={{ fontSize: 11 }}>Top/Bottom</MenuItem>
        <MenuItem value="interlaced" sx={{ fontSize: 11 }}>Interlaced</MenuItem>
      </Select>

      {/* Conversion method for 2D to 3D */}
      {data.mode === '2d_to_3d' && (
        <Box sx={{ mb: 1 }}>
          <Chip
            label={data.conversionMethod || 'ai_depth'}
            size="small"
            sx={{
              fontSize: 10,
              bgcolor: getConversionColor(),
              color: '#fff',
            }}
          />
          {data.aiDepthModel && (
            <Chip
              label={data.aiDepthModel}
              size="small"
              variant="outlined"
              sx={{ fontSize: 9, ml: 0.5 }}
            />
          )}
        </Box>
      )}

      {/* Format conversion */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Chip
          label={data.stereoFormat?.input || 'mono'}
          size="small"
          sx={{ fontSize: 9, height: 16 }}
        />
        <Typography variant="caption" sx={{ fontSize: 10 }}>→</Typography>
        <Chip
          label={data.stereoFormat?.output || 'sbs'}
          size="small"
          color="primary"
          sx={{ fontSize: 9, height: 16 }}
        />
      </Box>

      {/* Depth settings */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
          Depth Budget: {data.depthSettings?.depthBudget || 50}%
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
          <Chip
            label={`Conv: ${data.depthSettings?.convergence || 0}`}
            size="small"
            sx={{ fontSize: 9, height: 16 }}
          />
          <Chip
            label={`IOD: ${data.depthSettings?.interocular || 65}mm`}
            size="small"
            sx={{ fontSize: 9, height: 16 }}
          />
        </Box>
      </Box>

      {/* Processing options */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
        {data.temporalConsistency && (
          <Chip
            icon={<Visibility sx={{ fontSize: 10 }} />}
            label="Temporal"
            size="small"
            sx={{ fontSize: 9, height: 18 }}
          />
        )}
        {data.edgePreservation && (
          <Chip
            label="Edge"
            size="small"
            sx={{ fontSize: 9, height: 18 }}
          />
        )}
        {data.occlusionFilling && (
          <Chip
            label="Fill"
            size="small"
            sx={{ fontSize: 9, height: 18 }}
          />
        )}
      </Box>

      {/* Anaglyph mode */}
      {data.mode === 'anaglyph' && data.anaglyphMode && (
        <Chip
          icon={<RemoveRedEye sx={{ fontSize: 12 }} />}
          label={data.anaglyphMode.replace('_', '/')}
          size="small"
          color="secondary"
          sx={{ fontSize: 9 }}
        />
      )}

      {/* Preview toggle */}
      <FormControlLabel
        control={
          <Switch
            checked={data.preview3D || false}
            size="small"
          />
        }
        label="3D Preview"
        sx={{
          '& .MuiFormControlLabel-label': {
            fontSize: 10,
          },
        }}
      />

      {/* Output handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="stereo_output"
        style={{
          background: '#f50057',
          width: 12,
          height: 12,
          top: '25%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="left_output"
        style={{
          background: '#ff5722',
          width: 10,
          height: 10,
          top: '45%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right_output"
        style={{
          background: '#00bcd4',
          width: 10,
          height: 10,
          top: '65%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="depth_output"
        style={{
          background: '#9c27b0',
          width: 10,
          height: 10,
          top: '85%',
        }}
      />
    </Paper>
  );
};

export default memo(StereoConversionNode);