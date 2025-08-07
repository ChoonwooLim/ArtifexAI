/**
 * Media Facade Node - For building-scale LED displays and architectural media
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Paper, Typography, Chip, Grid, LinearProgress } from '@mui/material';
import { 
  Apartment,
  GridOn,
  Brightness7,
  Speed,
  Router,
  Cable,
  Memory,
  WbSunny
} from '@mui/icons-material';

interface MediaFacadeNodeData {
  label: string;
  facadeType: 'led_mesh' | 'pixel_tubes' | 'matrix_panels' | 'dmx_lights' | 'projection';
  configuration: {
    width: number;
    height: number;
    pixelCount: number;
    panelCount: number;
    pixelPitch: number;
    refreshRate: number;
  };
  mapping: {
    type: 'grid' | 'custom' | 'architectural';
    file?: string;
    segments: Array<{
      id: string;
      startX: number;
      startY: number;
      width: number;
      height: number;
      rotation: number;
    }>;
  };
  protocol: 'artnet' | 'sacn' | 'kinet' | 'dmx' | 'spi' | 'custom';
  network: {
    controllers: number;
    universes: number;
    channels: number;
    dataRate: number;
    latency: number;
  };
  colorSpace: 'rgb' | 'rgbw' | 'rgba';
  brightness: number;
  gamma: number;
  colorTemperature: number;
  weatherCompensation: boolean;
  diagnostics: {
    temperature: number;
    powerConsumption: number;
    failedPixels: number;
    uptime: number;
  };
}

const MediaFacadeNode: React.FC<NodeProps<MediaFacadeNodeData>> = ({ data, selected }) => {
  const getFacadeIcon = () => {
    switch (data.facadeType) {
      case 'led_mesh': return <GridOn sx={{ fontSize: 16 }} />;
      case 'matrix_panels': return <Memory sx={{ fontSize: 16 }} />;
      case 'dmx_lights': return <Brightness7 sx={{ fontSize: 16 }} />;
      default: return <Apartment sx={{ fontSize: 16 }} />;
    }
  };

  const getProtocolColor = () => {
    switch (data.protocol) {
      case 'artnet': return '#4caf50';
      case 'sacn': return '#2196f3';
      case 'dmx': return '#ff9800';
      default: return '#9c27b0';
    }
  };

  return (
    <Paper
      sx={{
        p: 1.5,
        minWidth: 260,
        bgcolor: selected ? '#1976d2' : '#2d2d2d',
        border: selected ? '2px solid #42a5f5' : '1px solid #1565c0',
        borderRadius: 2,
        background: selected
          ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
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
        id="mapping"
        style={{
          background: '#ff9800',
          width: 10,
          height: 10,
          top: '40%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="brightness"
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
        id="control"
        style={{
          background: '#9c27b0',
          width: 10,
          height: 10,
          top: '80%',
        }}
      />

      {/* Node header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Apartment sx={{ fontSize: 18, color: '#42a5f5' }} />
        <Typography variant="subtitle2" fontWeight={600}>
          {data.label || 'Media Facade'}
        </Typography>
      </Box>

      {/* Facade type and protocol */}
      <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
        <Chip
          icon={getFacadeIcon()}
          label={data.facadeType?.replace('_', ' ')}
          size="small"
          sx={{ fontSize: 10 }}
        />
        <Chip
          label={data.protocol?.toUpperCase()}
          size="small"
          sx={{
            fontSize: 10,
            bgcolor: getProtocolColor(),
            color: '#fff',
          }}
        />
      </Box>

      {/* Configuration */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
          Resolution: {data.configuration?.width}×{data.configuration?.height}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
          <Chip
            label={`${(data.configuration?.pixelCount || 0).toLocaleString()} pixels`}
            size="small"
            sx={{ fontSize: 9, height: 16 }}
          />
          <Chip
            label={`${data.configuration?.refreshRate || 60}Hz`}
            size="small"
            sx={{ fontSize: 9, height: 16 }}
          />
        </Box>
      </Box>

      {/* Network info */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <Router sx={{ fontSize: 12, color: '#b0b0b0' }} />
          <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
            Network: {data.network?.controllers || 0} controllers
          </Typography>
        </Box>
        <Grid container spacing={0.3}>
          <Grid item>
            <Chip
              label={`${data.network?.universes || 0} univ`}
              size="small"
              sx={{ fontSize: 9, height: 16 }}
            />
          </Grid>
          <Grid item>
            <Chip
              label={`${data.network?.channels || 0} ch`}
              size="small"
              sx={{ fontSize: 9, height: 16 }}
            />
          </Grid>
          <Grid item>
            <Chip
              icon={<Speed sx={{ fontSize: 10 }} />}
              label={`${data.network?.dataRate || 0}Mbps`}
              size="small"
              sx={{ fontSize: 9, height: 16 }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Color and brightness */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
            Brightness: {Math.round((data.brightness || 1) * 100)}%
          </Typography>
          <Chip
            label={data.colorSpace?.toUpperCase()}
            size="small"
            sx={{ fontSize: 9, height: 16 }}
          />
        </Box>
        {data.weatherCompensation && (
          <Chip
            icon={<WbSunny sx={{ fontSize: 10 }} />}
            label="Weather Comp"
            size="small"
            color="primary"
            sx={{ fontSize: 9, height: 18 }}
          />
        )}
      </Box>

      {/* Diagnostics */}
      {data.diagnostics && (
        <Box>
          <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
            System Status
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
            <Chip
              label={`${data.diagnostics.temperature || 0}°C`}
              size="small"
              color={data.diagnostics.temperature > 70 ? 'error' : 'default'}
              sx={{ fontSize: 9, height: 16 }}
            />
            <Chip
              label={`${data.diagnostics.powerConsumption || 0}kW`}
              size="small"
              sx={{ fontSize: 9, height: 16 }}
            />
            {data.diagnostics.failedPixels > 0 && (
              <Chip
                label={`${data.diagnostics.failedPixels} failed`}
                size="small"
                color="warning"
                sx={{ fontSize: 9, height: 16 }}
              />
            )}
          </Box>
        </Box>
      )}

      {/* Data rate indicator */}
      <LinearProgress
        variant="determinate"
        value={Math.min(100, ((data.network?.dataRate || 0) / 1000) * 100)}
        sx={{ height: 2, borderRadius: 1, mt: 1 }}
      />

      {/* Output handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          background: '#42a5f5',
          width: 12,
          height: 12,
          top: '30%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="status"
        style={{
          background: '#4caf50',
          width: 10,
          height: 10,
          top: '50%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="diagnostics"
        style={{
          background: '#ff9800',
          width: 10,
          height: 10,
          top: '70%',
        }}
      />
    </Paper>
  );
};

export default memo(MediaFacadeNode);