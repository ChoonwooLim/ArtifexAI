/**
 * 3D Model Import and Processing Node
 */

import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Paper, Typography, Chip, IconButton, LinearProgress, Grid } from '@mui/material';
import { 
  ViewInAr,
  Folder,
  Refresh,
  Settings,
  Texture,
  Animation,
  AutoFixHigh,
  Layers,
  CameraAlt,
  GridOn
} from '@mui/icons-material';

interface Model3DNodeData {
  label: string;
  modelPath?: string;
  format: 'fbx' | 'obj' | 'gltf' | 'glb' | 'usd' | 'usda' | 'usdc' | 'abc' | 'ply' | 'stl' | 'dae' | '3ds';
  stats: {
    vertices: number;
    faces: number;
    materials: number;
    textures: number;
    animations: number;
    bones: number;
    fileSize: number;
  };
  transform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
  materials: {
    pbr: boolean;
    transparency: boolean;
    subsurface: boolean;
    emission: boolean;
  };
  optimization: {
    decimation: number;
    textureResolution: number;
    normalRecalculation: boolean;
    uvUnwrap: boolean;
    retopology: boolean;
  };
  rendering: {
    shading: 'flat' | 'smooth' | 'wireframe' | 'solid';
    backfaceCulling: boolean;
    castShadows: boolean;
    receiveShadows: boolean;
  };
  animation: {
    currentFrame: number;
    totalFrames: number;
    fps: number;
    loop: boolean;
    playing: boolean;
  };
  isLoading: boolean;
  loadProgress: number;
}

const Model3DNode: React.FC<NodeProps<Model3DNodeData>> = ({ data, selected }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getFormatColor = () => {
    const formatColors: Record<string, string> = {
      'gltf': '#4caf50',
      'glb': '#4caf50',
      'fbx': '#2196f3',
      'obj': '#ff9800',
      'usd': '#9c27b0',
      'usda': '#9c27b0',
      'usdc': '#9c27b0',
      'abc': '#e91e63',
      'ply': '#00bcd4',
      'stl': '#795548',
      'dae': '#607d8b',
      '3ds': '#ff5722'
    };
    return formatColors[data.format] || '#666';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const formatNumber = (num: number) => {
    if (num < 1000) return num.toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    return (num / 1000000).toFixed(1) + 'M';
  };

  return (
    <Paper
      sx={{
        p: 1.5,
        minWidth: 280,
        bgcolor: selected ? '#673ab7' : '#2d2d2d',
        border: selected ? '2px solid #7e57c2' : '1px solid #5e35b1',
        borderRadius: 2,
        background: selected
          ? 'linear-gradient(135deg, #673ab7 0%, #5e35b1 100%)'
          : 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
      }}
      elevation={selected ? 8 : 2}
    >
      {/* Input handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="texture"
        style={{
          background: '#ff9800',
          width: 10,
          height: 10,
          top: '20%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="material"
        style={{
          background: '#4caf50',
          width: 10,
          height: 10,
          top: '35%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="animation"
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
        id="transform"
        style={{
          background: '#9c27b0',
          width: 10,
          height: 10,
          top: '65%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="modifier"
        style={{
          background: '#e91e63',
          width: 10,
          height: 10,
          top: '80%',
        }}
      />

      {/* Node header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <ViewInAr sx={{ fontSize: 18, color: '#7e57c2' }} />
        <Typography variant="subtitle2" fontWeight={600}>
          {data.label || '3D Model'}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <IconButton size="small" sx={{ p: 0.5 }}>
          <Folder sx={{ fontSize: 14 }} />
        </IconButton>
        <IconButton size="small" sx={{ p: 0.5 }} onClick={() => setShowDetails(!showDetails)}>
          <Settings sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      {/* File info */}
      {data.modelPath && (
        <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0', display: 'block', mb: 1 }}>
          {data.modelPath.split('/').pop()}
        </Typography>
      )}

      {/* Format and size */}
      <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
        <Chip
          label={data.format?.toUpperCase()}
          size="small"
          sx={{
            fontSize: 10,
            bgcolor: getFormatColor(),
            color: '#fff',
          }}
        />
        <Chip
          label={formatFileSize(data.stats?.fileSize || 0)}
          size="small"
          variant="outlined"
          sx={{ fontSize: 10 }}
        />
      </Box>

      {/* Loading progress */}
      {data.isLoading && (
        <Box sx={{ mb: 1 }}>
          <LinearProgress
            variant="determinate"
            value={data.loadProgress || 0}
            sx={{ height: 3, borderRadius: 1 }}
          />
          <Typography variant="caption" sx={{ fontSize: 9, color: '#b0b0b0' }}>
            Loading... {data.loadProgress || 0}%
          </Typography>
        </Box>
      )}

      {/* Model statistics */}
      <Grid container spacing={0.5} sx={{ mb: 1 }}>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <GridOn sx={{ fontSize: 12, color: '#b0b0b0' }} />
            <Typography variant="caption" sx={{ fontSize: 10 }}>
              {formatNumber(data.stats?.vertices || 0)} verts
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Layers sx={{ fontSize: 12, color: '#b0b0b0' }} />
            <Typography variant="caption" sx={{ fontSize: 10 }}>
              {formatNumber(data.stats?.faces || 0)} faces
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Texture sx={{ fontSize: 12, color: '#b0b0b0' }} />
            <Typography variant="caption" sx={{ fontSize: 10 }}>
              {data.stats?.materials || 0} materials
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Animation sx={{ fontSize: 12, color: '#b0b0b0' }} />
            <Typography variant="caption" sx={{ fontSize: 10 }}>
              {data.stats?.animations || 0} anims
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Material features */}
      <Box sx={{ display: 'flex', gap: 0.3, flexWrap: 'wrap', mb: 1 }}>
        {data.materials?.pbr && (
          <Chip label="PBR" size="small" sx={{ fontSize: 9, height: 16 }} />
        )}
        {data.materials?.transparency && (
          <Chip label="Alpha" size="small" sx={{ fontSize: 9, height: 16 }} />
        )}
        {data.materials?.subsurface && (
          <Chip label="SSS" size="small" sx={{ fontSize: 9, height: 16 }} />
        )}
        {data.materials?.emission && (
          <Chip label="Emissive" size="small" sx={{ fontSize: 9, height: 16 }} />
        )}
      </Box>

      {/* Animation controls */}
      {data.stats?.animations > 0 && (
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Animation sx={{ fontSize: 12, color: data.animation?.playing ? '#4caf50' : '#b0b0b0' }} />
            <Typography variant="caption" sx={{ fontSize: 10 }}>
              Frame {data.animation?.currentFrame || 0}/{data.animation?.totalFrames || 0}
            </Typography>
            <Chip
              label={`${data.animation?.fps || 30}fps`}
              size="small"
              sx={{ fontSize: 9, height: 16 }}
            />
          </Box>
        </Box>
      )}

      {/* Optimization settings (shown when expanded) */}
      {showDetails && (
        <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0', display: 'block', mb: 0.5 }}>
            Optimization
          </Typography>
          <Grid container spacing={0.3}>
            {data.optimization?.decimation < 1 && (
              <Grid item>
                <Chip
                  label={`Decimate ${Math.round(data.optimization.decimation * 100)}%`}
                  size="small"
                  sx={{ fontSize: 9, height: 16 }}
                />
              </Grid>
            )}
            {data.optimization?.normalRecalculation && (
              <Grid item>
                <Chip label="Normals" size="small" sx={{ fontSize: 9, height: 16 }} />
              </Grid>
            )}
            {data.optimization?.uvUnwrap && (
              <Grid item>
                <Chip label="UV" size="small" sx={{ fontSize: 9, height: 16 }} />
              </Grid>
            )}
            {data.optimization?.retopology && (
              <Grid item>
                <Chip label="Retopo" size="small" sx={{ fontSize: 9, height: 16 }} />
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Transform info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
          Transform
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" sx={{ p: 0.25 }}>
            <AutoFixHigh sx={{ fontSize: 12 }} />
          </IconButton>
          <IconButton size="small" sx={{ p: 0.25 }}>
            <Refresh sx={{ fontSize: 12 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Output handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="geometry"
        style={{
          background: '#7e57c2',
          width: 12,
          height: 12,
          top: '20%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="material_out"
        style={{
          background: '#4caf50',
          width: 10,
          height: 10,
          top: '35%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="uv"
        style={{
          background: '#ff9800',
          width: 10,
          height: 10,
          top: '50%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="animation_out"
        style={{
          background: '#2196f3',
          width: 10,
          height: 10,
          top: '65%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="bounds"
        style={{
          background: '#e91e63',
          width: 10,
          height: 10,
          top: '80%',
        }}
      />
    </Paper>
  );
};

export default memo(Model3DNode);