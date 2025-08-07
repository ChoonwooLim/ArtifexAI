/**
 * 3D Rendering Node - Real-time 3D rendering with Three.js/Babylon.js
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Paper, Typography, Select, MenuItem, Chip, Grid, Slider } from '@mui/material';
import { 
  ThreeSixty,
  WbSunny,
  CameraAlt,
  Gradient,
  BlurOn,
  AutoAwesome,
  Flare,
  Tonality,
  FilterDrama
} from '@mui/icons-material';

interface Render3DNodeData {
  label: string;
  renderer: 'three' | 'babylon' | 'filament' | 'unity' | 'unreal';
  renderMode: 'realtime' | 'pathtracing' | 'raytracing' | 'rasterization';
  camera: {
    type: 'perspective' | 'orthographic' | 'panoramic' | 'fisheye';
    fov: number;
    position: [number, number, number];
    target: [number, number, number];
    nearClip: number;
    farClip: number;
    dof: {
      enabled: boolean;
      focusDistance: number;
      aperture: number;
      bokehShape: string;
    };
  };
  lighting: {
    environment: string;
    hdri: string;
    intensity: number;
    rotation: number;
    lights: Array<{
      type: 'directional' | 'point' | 'spot' | 'area' | 'ambient';
      color: string;
      intensity: number;
      position?: [number, number, number];
      castShadows: boolean;
    }>;
  };
  shading: {
    model: 'pbr' | 'phong' | 'lambert' | 'toon' | 'matcap' | 'unlit';
    wireframe: boolean;
    vertexColors: boolean;
    flatShading: boolean;
  };
  shadows: {
    enabled: boolean;
    type: 'pcf' | 'pcfsoft' | 'vsm' | 'cascaded';
    resolution: number;
    bias: number;
    normalBias: number;
  };
  postProcessing: {
    bloom: { enabled: boolean; intensity: number; threshold: number };
    ssao: { enabled: boolean; radius: number; intensity: number };
    ssr: { enabled: boolean; maxDistance: number; thickness: number };
    motionBlur: { enabled: boolean; samples: number; shutter: number };
    chromaticAberration: { enabled: boolean; offset: number };
    vignette: { enabled: boolean; intensity: number };
    fog: { enabled: boolean; density: number; color: string };
    toneMapping: 'none' | 'linear' | 'reinhard' | 'aces' | 'uncharted2';
    exposure: number;
  };
  output: {
    resolution: string;
    antialiasing: 'none' | 'fxaa' | 'smaa' | 'taa' | 'msaa';
    msaaSamples: number;
    pixelRatio: number;
  };
  performance: {
    fps: number;
    drawCalls: number;
    triangles: number;
    gpu: number;
  };
}

const Render3DNode: React.FC<NodeProps<Render3DNodeData>> = ({ data, selected }) => {
  const getRendererColor = () => {
    const colors: Record<string, string> = {
      'three': '#049EF4',
      'babylon': '#BB464B',
      'filament': '#4285F4',
      'unity': '#000000',
      'unreal': '#313131'
    };
    return colors[data.renderer] || '#666';
  };

  const getRenderModeIcon = () => {
    switch (data.renderMode) {
      case 'pathtracing': return <AutoAwesome sx={{ fontSize: 14 }} />;
      case 'raytracing': return <Flare sx={{ fontSize: 14 }} />;
      default: return <ThreeSixty sx={{ fontSize: 14 }} />;
    }
  };

  return (
    <Paper
      sx={{
        p: 1.5,
        minWidth: 300,
        bgcolor: selected ? '#01579b' : '#2d2d2d',
        border: selected ? '2px solid #0277bd' : '1px solid #014c8c',
        borderRadius: 2,
        background: selected
          ? 'linear-gradient(135deg, #01579b 0%, #014c8c 100%)'
          : 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
      }}
      elevation={selected ? 8 : 2}
    >
      {/* Input handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="scene"
        style={{
          background: '#7e57c2',
          width: 12,
          height: 12,
          top: '15%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="geometry"
        style={{
          background: '#4caf50',
          width: 10,
          height: 10,
          top: '30%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="material"
        style={{
          background: '#ff9800',
          width: 10,
          height: 10,
          top: '45%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="lights"
        style={{
          background: '#ffeb3b',
          width: 10,
          height: 10,
          top: '60%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="camera_input"
        style={{
          background: '#2196f3',
          width: 10,
          height: 10,
          top: '75%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="environment"
        style={{
          background: '#00bcd4',
          width: 10,
          height: 10,
          top: '90%',
        }}
      />

      {/* Node header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <ThreeSixty sx={{ fontSize: 18, color: '#0277bd' }} />
        <Typography variant="subtitle2" fontWeight={600}>
          {data.label || '3D Renderer'}
        </Typography>
        <Box sx={{ flex: 1 }} />
        {getRenderModeIcon()}
      </Box>

      {/* Renderer selection */}
      <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
        <Chip
          label={data.renderer?.toUpperCase()}
          size="small"
          sx={{
            fontSize: 10,
            bgcolor: getRendererColor(),
            color: '#fff',
          }}
        />
        <Chip
          label={data.renderMode}
          size="small"
          variant="outlined"
          sx={{ fontSize: 10 }}
        />
      </Box>

      {/* Camera settings */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CameraAlt sx={{ fontSize: 12, color: '#b0b0b0' }} />
          <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
            Camera: {data.camera?.type}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.3, mt: 0.5 }}>
          <Chip
            label={`FOV ${data.camera?.fov || 60}°`}
            size="small"
            sx={{ fontSize: 9, height: 16 }}
          />
          {data.camera?.dof?.enabled && (
            <Chip
              label="DOF"
              size="small"
              color="primary"
              sx={{ fontSize: 9, height: 16 }}
            />
          )}
        </Box>
      </Box>

      {/* Lighting */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <WbSunny sx={{ fontSize: 12, color: '#b0b0b0' }} />
          <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
            Lights: {data.lighting?.lights?.length || 0}
          </Typography>
          {data.lighting?.hdri && (
            <Chip
              label="HDRI"
              size="small"
              sx={{ fontSize: 9, height: 16 }}
            />
          )}
        </Box>
      </Box>

      {/* Shading mode */}
      <Box sx={{ mb: 1 }}>
        <Select
          value={data.shading?.model || 'pbr'}
          size="small"
          fullWidth
          sx={{
            fontSize: 11,
            height: 24,
            '& .MuiSelect-select': {
              py: 0.5,
            },
          }}
        >
          <MenuItem value="pbr" sx={{ fontSize: 11 }}>PBR</MenuItem>
          <MenuItem value="phong" sx={{ fontSize: 11 }}>Phong</MenuItem>
          <MenuItem value="toon" sx={{ fontSize: 11 }}>Toon</MenuItem>
          <MenuItem value="matcap" sx={{ fontSize: 11 }}>MatCap</MenuItem>
          <MenuItem value="unlit" sx={{ fontSize: 11 }}>Unlit</MenuItem>
        </Select>
      </Box>

      {/* Shadows */}
      {data.shadows?.enabled && (
        <Box sx={{ display: 'flex', gap: 0.3, mb: 1 }}>
          <Chip
            label={`Shadows: ${data.shadows.type}`}
            size="small"
            sx={{ fontSize: 9, height: 16 }}
          />
          <Chip
            label={`${data.shadows.resolution}`}
            size="small"
            sx={{ fontSize: 9, height: 16 }}
          />
        </Box>
      )}

      {/* Post-processing effects */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
          Post Effects
        </Typography>
        <Grid container spacing={0.3} sx={{ mt: 0.5 }}>
          {data.postProcessing?.bloom?.enabled && (
            <Grid item>
              <Chip
                icon={<AutoAwesome sx={{ fontSize: 10 }} />}
                label="Bloom"
                size="small"
                sx={{ fontSize: 9, height: 18 }}
              />
            </Grid>
          )}
          {data.postProcessing?.ssao?.enabled && (
            <Grid item>
              <Chip
                label="SSAO"
                size="small"
                sx={{ fontSize: 9, height: 18 }}
              />
            </Grid>
          )}
          {data.postProcessing?.ssr?.enabled && (
            <Grid item>
              <Chip
                label="SSR"
                size="small"
                sx={{ fontSize: 9, height: 18 }}
              />
            </Grid>
          )}
          {data.postProcessing?.motionBlur?.enabled && (
            <Grid item>
              <Chip
                icon={<BlurOn sx={{ fontSize: 10 }} />}
                label="M.Blur"
                size="small"
                sx={{ fontSize: 9, height: 18 }}
              />
            </Grid>
          )}
          {data.postProcessing?.fog?.enabled && (
            <Grid item>
              <Chip
                icon={<FilterDrama sx={{ fontSize: 10 }} />}
                label="Fog"
                size="small"
                sx={{ fontSize: 9, height: 18 }}
              />
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Tone mapping and exposure */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
            Tone: {data.postProcessing?.toneMapping || 'linear'}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 10 }}>
            Exp: {data.postProcessing?.exposure || 1.0}
          </Typography>
        </Box>
      </Box>

      {/* Output settings */}
      <Box sx={{ display: 'flex', gap: 0.3, mb: 1 }}>
        <Chip
          label={data.output?.resolution || '1920x1080'}
          size="small"
          sx={{ fontSize: 9, height: 16 }}
        />
        <Chip
          label={data.output?.antialiasing?.toUpperCase() || 'TAA'}
          size="small"
          sx={{ fontSize: 9, height: 16 }}
        />
      </Box>

      {/* Performance metrics */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ fontSize: 9, color: '#4caf50' }}>
          {data.performance?.fps || 0} FPS
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 9, color: '#ff9800' }}>
          {data.performance?.drawCalls || 0} draws
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 9, color: '#2196f3' }}>
          GPU {data.performance?.gpu || 0}%
        </Typography>
      </Box>

      {/* Output handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="render"
        style={{
          background: '#0277bd',
          width: 12,
          height: 12,
          top: '25%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="depth"
        style={{
          background: '#9c27b0',
          width: 10,
          height: 10,
          top: '45%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="normal"
        style={{
          background: '#4caf50',
          width: 10,
          height: 10,
          top: '65%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="position_pass"
        style={{
          background: '#ff9800',
          width: 10,
          height: 10,
          top: '85%',
        }}
      />
    </Paper>
  );
};

export default memo(Render3DNode);