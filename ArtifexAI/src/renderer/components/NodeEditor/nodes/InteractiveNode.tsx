/**
 * Interactive Content Node - For sensor input and interactive installations
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Paper, Typography, Chip, LinearProgress, Grid } from '@mui/material';
import { 
  TouchApp,
  Sensors,
  CameraAlt,
  Mic,
  Gamepad,
  Mouse,
  GpsFixed,
  BluetoothConnected,
  WifiTethering,
  Speed
} from '@mui/icons-material';

interface InteractiveNodeData {
  label: string;
  inputType: 'kinect' | 'leap_motion' | 'touch' | 'midi' | 'osc' | 'arduino' | 'webcam' | 'microphone' | 'mobile';
  protocol: 'osc' | 'midi' | 'websocket' | 'serial' | 'http' | 'tcp' | 'udp';
  mapping: {
    source: string;
    target: string;
    range: [number, number];
    smooth: number;
    curve: 'linear' | 'exponential' | 'logarithmic' | 'sigmoid';
  }[];
  sensors: {
    motion?: boolean;
    depth?: boolean;
    skeleton?: boolean;
    gesture?: boolean;
    audio?: boolean;
    touch?: boolean;
    acceleration?: boolean;
    gyroscope?: boolean;
  };
  tracking: {
    enabled: boolean;
    maxUsers: number;
    confidence: number;
    smoothing: number;
  };
  calibration: {
    isCalibrated: boolean;
    offset: {x: number, y: number, z: number};
    scale: {x: number, y: number, z: number};
  };
  latency: number;
  isConnected: boolean;
  dataRate: number;
}

const InteractiveNode: React.FC<NodeProps<InteractiveNodeData>> = ({ data, selected }) => {
  const getInputIcon = () => {
    switch (data.inputType) {
      case 'kinect': return <Sensors sx={{ fontSize: 16 }} />;
      case 'leap_motion': return <TouchApp sx={{ fontSize: 16 }} />;
      case 'touch': return <TouchApp sx={{ fontSize: 16 }} />;
      case 'webcam': return <CameraAlt sx={{ fontSize: 16 }} />;
      case 'microphone': return <Mic sx={{ fontSize: 16 }} />;
      case 'midi': return <Gamepad sx={{ fontSize: 16 }} />;
      case 'arduino': return <BluetoothConnected sx={{ fontSize: 16 }} />;
      case 'mobile': return <GpsFixed sx={{ fontSize: 16 }} />;
      default: return <Mouse sx={{ fontSize: 16 }} />;
    }
  };

  const getConnectionColor = () => {
    if (!data.isConnected) return '#f44336';
    if (data.latency > 50) return '#ff9800';
    return '#4caf50';
  };

  return (
    <Paper
      sx={{
        p: 1.5,
        minWidth: 240,
        bgcolor: selected ? '#ff6f00' : '#2d2d2d',
        border: selected ? '2px solid #ffab00' : '1px solid #ff8f00',
        borderRadius: 2,
        background: selected
          ? 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%)'
          : 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
      }}
      elevation={selected ? 8 : 2}
    >
      {/* Input handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="config"
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
        id="calibration"
        style={{
          background: '#ff9800',
          width: 10,
          height: 10,
          top: '60%',
        }}
      />

      {/* Node header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {getInputIcon()}
        <Typography variant="subtitle2" fontWeight={600}>
          {data.label || 'Interactive Input'}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: getConnectionColor(),
            animation: data.isConnected ? 'pulse 2s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.5 },
              '100%': { opacity: 1 },
            },
          }}
        />
      </Box>

      {/* Input type and protocol */}
      <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
        <Chip
          label={data.inputType}
          size="small"
          color="primary"
          sx={{ fontSize: 10 }}
        />
        <Chip
          label={data.protocol}
          size="small"
          variant="outlined"
          sx={{ fontSize: 10 }}
        />
      </Box>

      {/* Connection status */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
            {data.isConnected ? 'Connected' : 'Disconnected'}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 10 }}>
            {data.latency || 0}ms
          </Typography>
        </Box>
        {data.isConnected && (
          <LinearProgress
            variant="determinate"
            value={Math.min(100, (data.dataRate || 0) / 10)}
            sx={{ height: 2, borderRadius: 1 }}
          />
        )}
      </Box>

      {/* Active sensors */}
      <Grid container spacing={0.3} sx={{ mb: 1 }}>
        {data.sensors?.motion && (
          <Grid item>
            <Chip
              icon={<WifiTethering sx={{ fontSize: 10 }} />}
              label="Motion"
              size="small"
              sx={{ fontSize: 9, height: 18 }}
            />
          </Grid>
        )}
        {data.sensors?.depth && (
          <Grid item>
            <Chip
              label="Depth"
              size="small"
              sx={{ fontSize: 9, height: 18 }}
            />
          </Grid>
        )}
        {data.sensors?.skeleton && (
          <Grid item>
            <Chip
              label="Skeleton"
              size="small"
              sx={{ fontSize: 9, height: 18 }}
            />
          </Grid>
        )}
        {data.sensors?.gesture && (
          <Grid item>
            <Chip
              label="Gesture"
              size="small"
              sx={{ fontSize: 9, height: 18 }}
            />
          </Grid>
        )}
        {data.sensors?.audio && (
          <Grid item>
            <Chip
              icon={<Mic sx={{ fontSize: 10 }} />}
              label="Audio"
              size="small"
              sx={{ fontSize: 9, height: 18 }}
            />
          </Grid>
        )}
      </Grid>

      {/* Tracking info */}
      {data.tracking?.enabled && (
        <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
          <Chip
            label={`Users: ${data.tracking.maxUsers || 1}`}
            size="small"
            sx={{ fontSize: 9, height: 16 }}
          />
          <Chip
            label={`Conf: ${Math.round((data.tracking.confidence || 0) * 100)}%`}
            size="small"
            sx={{ fontSize: 9, height: 16 }}
          />
        </Box>
      )}

      {/* Calibration status */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
          Calibration:
        </Typography>
        <Chip
          label={data.calibration?.isCalibrated ? 'OK' : 'Needed'}
          size="small"
          color={data.calibration?.isCalibrated ? 'success' : 'warning'}
          sx={{ fontSize: 9, height: 16 }}
        />
      </Box>

      {/* Mapping count */}
      {data.mapping && data.mapping.length > 0 && (
        <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0', mt: 0.5 }}>
          {data.mapping.length} parameter mappings
        </Typography>
      )}

      {/* Output handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="data"
        style={{
          background: '#ffab00',
          width: 12,
          height: 12,
          top: '25%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="position"
        style={{
          background: '#4caf50',
          width: 10,
          height: 10,
          top: '45%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="gesture"
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
        id="trigger"
        style={{
          background: '#f44336',
          width: 10,
          height: 10,
          top: '85%',
        }}
      />
    </Paper>
  );
};

export default memo(InteractiveNode);