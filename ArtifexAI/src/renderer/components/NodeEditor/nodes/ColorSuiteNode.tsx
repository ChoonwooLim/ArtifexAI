/**
 * Professional Color Suite Node - DaVinci Resolve-level color grading
 */

import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Paper, Typography, Tabs, Tab, Slider, Chip, Grid, IconButton } from '@mui/material';
import { 
  Palette,
  Tune,
  Gradient,
  Contrast,
  WbSunny,
  ShowChart,
  ViewInAr,
  CompareArrows,
  AutoFixHigh,
  Visibility,
  Timeline,
  ColorLens,
  FilterBAndW,
  Exposure
} from '@mui/icons-material';

interface ColorSuiteNodeData {
  label: string;
  mode: 'primary' | 'log' | 'hdr' | 'secondary' | 'curves' | 'qualifier';
  colorSpace: 'rec709' | 'rec2020' | 'p3' | 'aces' | 'srgb' | 'raw';
  
  // Primary Corrections
  primary: {
    lift: { r: number; g: number; b: number; };
    gamma: { r: number; g: number; b: number; };
    gain: { r: number; g: number; b: number; };
    offset: { r: number; g: number; b: number; };
    exposure: number;
    contrast: number;
    pivot: number;
    saturation: number;
    hue: number;
    temperature: number;
    tint: number;
    vibrance: number;
  };
  
  // Log Wheels
  logWheels: {
    shadows: { r: number; g: number; b: number; };
    midtones: { r: number; g: number; b: number; };
    highlights: { r: number; g: number; b: number; };
    shadowsRange: [number, number];
    highlightsRange: [number, number];
  };
  
  // HDR Controls
  hdr: {
    mode: 'hlg' | 'pq' | 'dolby_vision' | 'hdr10' | 'hdr10plus';
    maxNits: number;
    minNits: number;
    colorVolume: number;
    rolloff: number;
    specularHighlights: number;
    zoneSystem: {
      zones: Array<{ start: number; end: number; exposure: number; }>;
    };
  };
  
  // Curves
  curves: {
    master: Array<[number, number]>;
    red: Array<[number, number]>;
    green: Array<[number, number]>;
    blue: Array<[number, number]>;
    hueSat: Array<[number, number]>;
    hueLum: Array<[number, number]>;
    satLum: Array<[number, number]>;
    hueHue: Array<[number, number]>;
  };
  
  // Qualifier/Secondary
  qualifier: {
    hsl: {
      hueCenter: number;
      hueRange: number;
      hueSoftness: number;
      satLow: number;
      satHigh: number;
      lumLow: number;
      lumHigh: number;
    };
    mask: {
      type: 'window' | 'gradient' | 'curve' | 'magic';
      feather: number;
      denoise: number;
      blur: number;
      invert: boolean;
    };
    tracking: {
      enabled: boolean;
      points: Array<{ x: number; y: number; frame: number; }>;
    };
  };
  
  // PowerWindows
  windows: Array<{
    type: 'circle' | 'rectangle' | 'polygon' | 'curve' | 'gradient';
    position: { x: number; y: number; };
    size: { width: number; height: number; };
    rotation: number;
    softness: number;
    inside: boolean;
  }>;
  
  // Scopes
  scopes: {
    waveform: boolean;
    vectorscope: boolean;
    histogram: boolean;
    parade: boolean;
    falseColor: boolean;
  };
  
  // LUT Management
  luts: {
    input: string;
    creative: string;
    output: string;
    custom: Array<{ name: string; path: string; mix: number; }>;
  };
  
  // Node Graph (for complex grades)
  nodeGraph: {
    parallel: boolean;
    layer: boolean;
    serial: boolean;
    nodes: Array<{
      id: string;
      type: string;
      mix: number;
    }>;
  };
  
  activeTab: number;
  bypass: boolean;
  comparison: 'none' | 'split' | 'wipe' | 'diff';
}

const ColorSuiteNode: React.FC<NodeProps<ColorSuiteNodeData>> = ({ data, selected }) => {
  const [activeTab, setActiveTab] = useState(data.activeTab || 0);
  const [showScopes, setShowScopes] = useState(false);

  const getModeIcon = () => {
    switch (data.mode) {
      case 'primary': return <Palette sx={{ fontSize: 14 }} />;
      case 'log': return <Timeline sx={{ fontSize: 14 }} />;
      case 'hdr': return <WbSunny sx={{ fontSize: 14 }} />;
      case 'curves': return <ShowChart sx={{ fontSize: 14 }} />;
      case 'qualifier': return <FilterBAndW sx={{ fontSize: 14 }} />;
      default: return <ColorLens sx={{ fontSize: 14 }} />;
    }
  };

  const getColorSpaceColor = () => {
    const colors: Record<string, string> = {
      'rec709': '#4caf50',
      'rec2020': '#2196f3',
      'p3': '#ff9800',
      'aces': '#9c27b0',
      'raw': '#e91e63'
    };
    return colors[data.colorSpace] || '#666';
  };

  return (
    <Paper
      sx={{
        p: 1.5,
        minWidth: 360,
        bgcolor: selected ? '#d84315' : '#2d2d2d',
        border: selected ? '2px solid #ff5722' : '1px solid #bf360c',
        borderRadius: 2,
        background: selected
          ? 'linear-gradient(135deg, #d84315 0%, #bf360c 100%)'
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
          top: '20%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="reference"
        style={{
          background: '#2196f3',
          width: 10,
          height: 10,
          top: '35%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="lut"
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
        id="mask"
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
        id="key"
        style={{
          background: '#e91e63',
          width: 10,
          height: 10,
          top: '80%',
        }}
      />

      {/* Node header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Palette sx={{ fontSize: 18, color: '#ff5722' }} />
        <Typography variant="subtitle2" fontWeight={600}>
          {data.label || 'Color Suite'}
        </Typography>
        <Box sx={{ flex: 1 }} />
        {getModeIcon()}
        <IconButton size="small" sx={{ p: 0.5 }} onClick={() => setShowScopes(!showScopes)}>
          <ShowChart sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      {/* Color space and mode */}
      <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
        <Chip
          label={data.colorSpace?.toUpperCase()}
          size="small"
          sx={{
            fontSize: 10,
            bgcolor: getColorSpaceColor(),
            color: '#fff',
          }}
        />
        <Chip
          label={data.mode}
          size="small"
          variant="outlined"
          sx={{ fontSize: 10 }}
        />
        {data.hdr?.mode && (
          <Chip
            label={data.hdr.mode.toUpperCase()}
            size="small"
            sx={{ fontSize: 10, bgcolor: '#ffeb3b', color: '#000' }}
          />
        )}
      </Box>

      {/* Tabs for different controls */}
      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        variant="scrollable"
        scrollButtons={false}
        sx={{
          minHeight: 28,
          mb: 1,
          '& .MuiTab-root': {
            minHeight: 28,
            fontSize: 10,
            p: 1,
            minWidth: 50,
          },
        }}
      >
        <Tab label="Wheels" />
        <Tab label="Curves" />
        <Tab label="HSL" />
        <Tab label="Windows" />
        <Tab label="LUT" />
      </Tabs>

      {/* Tab content */}
      <Box sx={{ minHeight: 120 }}>
        {activeTab === 0 && (
          // Primary Color Wheels
          <Box>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ fontSize: 9, color: '#b0b0b0' }}>
                    Lift
                  </Typography>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: `rgb(${Math.round((data.primary?.lift?.r || 0) * 255)}, 
                                     ${Math.round((data.primary?.lift?.g || 0) * 255)}, 
                                     ${Math.round((data.primary?.lift?.b || 0) * 255)})`,
                      border: '2px solid #333',
                      mx: 'auto',
                      mt: 0.5,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ fontSize: 9, color: '#b0b0b0' }}>
                    Gamma
                  </Typography>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: `rgb(${Math.round((data.primary?.gamma?.r || 0.5) * 255)}, 
                                     ${Math.round((data.primary?.gamma?.g || 0.5) * 255)}, 
                                     ${Math.round((data.primary?.gamma?.b || 0.5) * 255)})`,
                      border: '2px solid #333',
                      mx: 'auto',
                      mt: 0.5,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ fontSize: 9, color: '#b0b0b0' }}>
                    Gain
                  </Typography>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: `rgb(${Math.round((data.primary?.gain?.r || 1) * 255)}, 
                                     ${Math.round((data.primary?.gain?.g || 1) * 255)}, 
                                     ${Math.round((data.primary?.gain?.b || 1) * 255)})`,
                      border: '2px solid #333',
                      mx: 'auto',
                      mt: 0.5,
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
            
            {/* Adjustment sliders */}
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Contrast sx={{ fontSize: 12, color: '#b0b0b0' }} />
                <Slider
                  size="small"
                  value={data.primary?.contrast || 1}
                  min={0}
                  max={2}
                  step={0.01}
                  sx={{ flex: 1, height: 4 }}
                />
                <Typography variant="caption" sx={{ fontSize: 9, minWidth: 25 }}>
                  {(data.primary?.contrast || 1).toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Exposure sx={{ fontSize: 12, color: '#b0b0b0' }} />
                <Slider
                  size="small"
                  value={data.primary?.exposure || 0}
                  min={-5}
                  max={5}
                  step={0.1}
                  sx={{ flex: 1, height: 4 }}
                />
                <Typography variant="caption" sx={{ fontSize: 9, minWidth: 25 }}>
                  {(data.primary?.exposure || 0).toFixed(1)}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {activeTab === 1 && (
          // Curves
          <Box>
            <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
              Custom Curves
            </Typography>
            <Box sx={{ height: 80, mt: 1, border: '1px solid #333', borderRadius: 1, position: 'relative' }}>
              {/* Curve visualization would go here */}
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <path
                  d="M 0,100 Q 25,75 50,50 T 100,0"
                  stroke="#ff5722"
                  strokeWidth="2"
                  fill="none"
                />
                <circle cx="25" cy="75" r="3" fill="#fff" />
                <circle cx="50" cy="50" r="3" fill="#fff" />
                <circle cx="75" cy="25" r="3" fill="#fff" />
              </svg>
            </Box>
            <Grid container spacing={0.5} sx={{ mt: 0.5 }}>
              <Grid item xs={3}>
                <Chip label="RGB" size="small" sx={{ fontSize: 9, height: 16, width: '100%' }} />
              </Grid>
              <Grid item xs={3}>
                <Chip label="Hue" size="small" sx={{ fontSize: 9, height: 16, width: '100%' }} />
              </Grid>
              <Grid item xs={3}>
                <Chip label="Sat" size="small" sx={{ fontSize: 9, height: 16, width: '100%' }} />
              </Grid>
              <Grid item xs={3}>
                <Chip label="Lum" size="small" sx={{ fontSize: 9, height: 16, width: '100%' }} />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 2 && (
          // HSL Qualifier
          <Box>
            <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
              HSL Qualifier
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: 9, minWidth: 20 }}>H</Typography>
                <Slider
                  size="small"
                  value={data.qualifier?.hsl?.hueCenter || 0}
                  min={0}
                  max={360}
                  sx={{ flex: 1, height: 4 }}
                />
                <Typography variant="caption" sx={{ fontSize: 9, minWidth: 25 }}>
                  {data.qualifier?.hsl?.hueCenter || 0}°
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: 9, minWidth: 20 }}>S</Typography>
                <Slider
                  size="small"
                  value={[data.qualifier?.hsl?.satLow || 0, data.qualifier?.hsl?.satHigh || 100]}
                  min={0}
                  max={100}
                  sx={{ flex: 1, height: 4 }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ fontSize: 9, minWidth: 20 }}>L</Typography>
                <Slider
                  size="small"
                  value={[data.qualifier?.hsl?.lumLow || 0, data.qualifier?.hsl?.lumHigh || 100]}
                  min={0}
                  max={100}
                  sx={{ flex: 1, height: 4 }}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.3, mt: 1 }}>
              {data.qualifier?.mask?.invert && (
                <Chip label="Inverted" size="small" sx={{ fontSize: 9, height: 16 }} />
              )}
              {data.qualifier?.tracking?.enabled && (
                <Chip label="Tracked" size="small" color="primary" sx={{ fontSize: 9, height: 16 }} />
              )}
            </Box>
          </Box>
        )}

        {activeTab === 3 && (
          // Power Windows
          <Box>
            <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
              Power Windows
            </Typography>
            <Grid container spacing={0.5} sx={{ mt: 0.5 }}>
              {data.windows?.map((window, index) => (
                <Grid item xs={6} key={index}>
                  <Chip
                    icon={<ViewInAr sx={{ fontSize: 10 }} />}
                    label={window.type}
                    size="small"
                    sx={{ fontSize: 9, height: 20, width: '100%' }}
                  />
                </Grid>
              ))}
              <Grid item xs={6}>
                <Chip
                  label="+ Add Window"
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: 9, height: 20, width: '100%' }}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 4 && (
          // LUT Management
          <Box>
            <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
              LUT Chain
            </Typography>
            <Box sx={{ mt: 1 }}>
              {data.luts?.input && (
                <Chip
                  label={`Input: ${data.luts.input}`}
                  size="small"
                  sx={{ fontSize: 9, height: 18, mb: 0.5, display: 'block' }}
                />
              )}
              {data.luts?.creative && (
                <Chip
                  label={`Creative: ${data.luts.creative}`}
                  size="small"
                  color="primary"
                  sx={{ fontSize: 9, height: 18, mb: 0.5, display: 'block' }}
                />
              )}
              {data.luts?.output && (
                <Chip
                  label={`Output: ${data.luts.output}`}
                  size="small"
                  sx={{ fontSize: 9, height: 18, mb: 0.5, display: 'block' }}
                />
              )}
            </Box>
            {data.luts?.custom && data.luts.custom.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ fontSize: 9, color: '#b0b0b0' }}>
                  Custom LUTs: {data.luts.custom.length}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Scopes display */}
      {showScopes && (
        <Box sx={{ mt: 1, p: 0.5, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 1 }}>
          <Grid container spacing={0.3}>
            {data.scopes?.waveform && (
              <Grid item xs={4}>
                <Chip label="Wave" size="small" sx={{ fontSize: 8, height: 14 }} />
              </Grid>
            )}
            {data.scopes?.vectorscope && (
              <Grid item xs={4}>
                <Chip label="Vector" size="small" sx={{ fontSize: 8, height: 14 }} />
              </Grid>
            )}
            {data.scopes?.histogram && (
              <Grid item xs={4}>
                <Chip label="Hist" size="small" sx={{ fontSize: 8, height: 14 }} />
              </Grid>
            )}
            {data.scopes?.parade && (
              <Grid item xs={4}>
                <Chip label="Parade" size="small" sx={{ fontSize: 8, height: 14 }} />
              </Grid>
            )}
            {data.scopes?.falseColor && (
              <Grid item xs={4}>
                <Chip label="False" size="small" sx={{ fontSize: 8, height: 14 }} />
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Node graph indicator */}
      {data.nodeGraph && (
        <Box sx={{ display: 'flex', gap: 0.3, mt: 1 }}>
          {data.nodeGraph.parallel && (
            <Chip label="Parallel" size="small" sx={{ fontSize: 9, height: 16 }} />
          )}
          {data.nodeGraph.layer && (
            <Chip label="Layer" size="small" sx={{ fontSize: 9, height: 16 }} />
          )}
          {data.nodeGraph.serial && (
            <Chip label="Serial" size="small" sx={{ fontSize: 9, height: 16 }} />
          )}
        </Box>
      )}

      {/* Comparison mode */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
          Compare: {data.comparison || 'none'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {data.bypass && (
            <Chip label="Bypass" size="small" color="warning" sx={{ fontSize: 9, height: 16 }} />
          )}
          <IconButton size="small" sx={{ p: 0.25 }}>
            <CompareArrows sx={{ fontSize: 12 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Output handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="graded"
        style={{
          background: '#ff5722',
          width: 12,
          height: 12,
          top: '20%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="matte"
        style={{
          background: '#9c27b0',
          width: 10,
          height: 10,
          top: '35%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="scopes_out"
        style={{
          background: '#2196f3',
          width: 10,
          height: 10,
          top: '50%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="lut_out"
        style={{
          background: '#ff9800',
          width: 10,
          height: 10,
          top: '65%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="reference_out"
        style={{
          background: '#4caf50',
          width: 10,
          height: 10,
          top: '80%',
        }}
      />
    </Paper>
  );
};

export default memo(ColorSuiteNode);