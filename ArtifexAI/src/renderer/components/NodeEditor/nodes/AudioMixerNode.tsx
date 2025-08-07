/**
 * Professional Multi-track Audio Mixer Node
 */

import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Paper, Typography, Slider, IconButton, Chip, Grid, ToggleButton } from '@mui/material';
import { 
  GraphicEq,
  VolumeUp,
  VolumeOff,
  Headphones,
  Mic,
  RadioButtonChecked,
  FiberManualRecord,
  PlayArrow,
  Pause,
  Loop,
  Settings,
  Speed,
  Tune,
  WavingHand,
  SurroundSound,
  Speaker
} from '@mui/icons-material';

interface AudioMixerNodeData {
  label: string;
  tracks: Array<{
    id: string;
    name: string;
    type: 'audio' | 'music' | 'voice' | 'sfx' | 'ambience' | 'master';
    
    // Level Controls
    volume: number;
    pan: number;
    mute: boolean;
    solo: boolean;
    armed: boolean;
    
    // EQ
    eq: {
      enabled: boolean;
      highShelf: { freq: number; gain: number; q: number; };
      highMid: { freq: number; gain: number; q: number; };
      mid: { freq: number; gain: number; q: number; };
      lowMid: { freq: number; gain: number; q: number; };
      lowShelf: { freq: number; gain: number; q: number; };
      highPass: { freq: number; slope: number; };
      lowPass: { freq: number; slope: number; };
    };
    
    // Dynamics
    compressor: {
      enabled: boolean;
      threshold: number;
      ratio: number;
      attack: number;
      release: number;
      knee: number;
      makeup: number;
    };
    
    gate: {
      enabled: boolean;
      threshold: number;
      range: number;
      attack: number;
      hold: number;
      release: number;
    };
    
    limiter: {
      enabled: boolean;
      ceiling: number;
      release: number;
      lookahead: number;
    };
    
    // Effects Sends
    sends: Array<{
      id: string;
      destination: string;
      level: number;
      prePost: 'pre' | 'post';
    }>;
    
    // Automation
    automation: {
      enabled: boolean;
      parameter: string;
      points: Array<{ time: number; value: number; curve: string; }>;
    };
    
    // Metering
    meter: {
      peak: number;
      rms: number;
      lufs: number;
      correlation: number;
    };
  }>;
  
  // Buses
  buses: Array<{
    id: string;
    name: string;
    type: 'aux' | 'group' | 'fx';
    volume: number;
    pan: number;
    mute: boolean;
    processing: {
      reverb?: { type: string; size: number; decay: number; mix: number; };
      delay?: { time: number; feedback: number; mix: number; sync: boolean; };
      chorus?: { rate: number; depth: number; mix: number; };
      distortion?: { drive: number; tone: number; mix: number; };
    };
  }>;
  
  // Master Section
  master: {
    volume: number;
    limiter: boolean;
    ceiling: number;
    
    // Master EQ
    eq: {
      enabled: boolean;
      bands: Array<{ freq: number; gain: number; q: number; }>;
    };
    
    // Master Dynamics
    compressor: {
      enabled: boolean;
      threshold: number;
      ratio: number;
      attack: number;
      release: number;
    };
    
    // Monitoring
    monitoring: {
      source: 'input' | 'tape' | 'mix';
      dim: boolean;
      dimLevel: number;
      mono: boolean;
      phase: boolean;
    };
  };
  
  // Spatial Audio
  spatial: {
    enabled: boolean;
    format: 'stereo' | '5.1' | '7.1' | 'atmos' | 'binaural' | 'ambisonic';
    renderer: 'panner' | 'vbap' | 'hrtf' | 'ambisonics';
    speakers: Array<{ x: number; y: number; z: number; }>;
  };
  
  // VST/AU Plugins
  plugins: Array<{
    id: string;
    name: string;
    type: 'vst' | 'vst3' | 'au' | 'lv2';
    preset: string;
    bypass: boolean;
    parameters: Record<string, number>;
  }>;
  
  // Analysis
  analysis: {
    spectrum: boolean;
    correlation: boolean;
    loudness: boolean;
    phaseScope: boolean;
  };
  
  sampleRate: number;
  bitDepth: number;
  latency: number;
  cpuUsage: number;
}

const AudioMixerNode: React.FC<NodeProps<AudioMixerNodeData>> = ({ data, selected }) => {
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);
  const [showEq, setShowEq] = useState(false);
  const [showDynamics, setShowDynamics] = useState(false);

  const getTrackColor = (type: string) => {
    const colors: Record<string, string> = {
      'audio': '#2196f3',
      'music': '#4caf50',
      'voice': '#ff9800',
      'sfx': '#9c27b0',
      'ambience': '#00bcd4',
      'master': '#f44336'
    };
    return colors[type] || '#666';
  };

  const formatDb = (value: number) => {
    if (value === -Infinity) return '-∞';
    return value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1);
  };

  const getSpatialIcon = () => {
    switch (data.spatial?.format) {
      case 'atmos': return <SurroundSound sx={{ fontSize: 14 }} />;
      case 'binaural': return <Headphones sx={{ fontSize: 14 }} />;
      default: return <Speaker sx={{ fontSize: 14 }} />;
    }
  };

  return (
    <Paper
      sx={{
        p: 1.5,
        minWidth: 400,
        bgcolor: selected ? '#37474f' : '#2d2d2d',
        border: selected ? '2px solid #546e7a' : '1px solid #263238',
        borderRadius: 2,
        background: selected
          ? 'linear-gradient(135deg, #37474f 0%, #263238 100%)'
          : 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
      }}
      elevation={selected ? 8 : 2}
    >
      {/* Input handles - one for each track */}
      {data.tracks?.map((track, index) => (
        <Handle
          key={track.id}
          type="target"
          position={Position.Left}
          id={`track_${track.id}`}
          style={{
            background: getTrackColor(track.type),
            width: 10,
            height: 10,
            top: `${15 + (index * 12)}%`,
          }}
        />
      ))}

      {/* Node header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <GraphicEq sx={{ fontSize: 18, color: '#546e7a' }} />
        <Typography variant="subtitle2" fontWeight={600}>
          {data.label || 'Audio Mixer'}
        </Typography>
        <Box sx={{ flex: 1 }} />
        {getSpatialIcon()}
        <Chip
          label={`${data.sampleRate || 48}kHz/${data.bitDepth || 24}bit`}
          size="small"
          sx={{ fontSize: 9, height: 16 }}
        />
      </Box>

      {/* Spatial audio format */}
      {data.spatial?.enabled && (
        <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
          <Chip
            label={data.spatial.format.toUpperCase()}
            size="small"
            color="primary"
            sx={{ fontSize: 10 }}
          />
          <Chip
            label={data.spatial.renderer}
            size="small"
            variant="outlined"
            sx={{ fontSize: 10 }}
          />
        </Box>
      )}

      {/* Track faders */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
          Tracks ({data.tracks?.length || 0})
        </Typography>
        <Grid container spacing={0.5} sx={{ mt: 0.5 }}>
          {data.tracks?.slice(0, 8).map((track) => (
            <Grid item xs={1.5} key={track.id}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 0.5,
                  borderRadius: 1,
                  bgcolor: expandedTrack === track.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                  cursor: 'pointer',
                }}
                onClick={() => setExpandedTrack(expandedTrack === track.id ? null : track.id)}
              >
                {/* Track type indicator */}
                <Box
                  sx={{
                    width: 20,
                    height: 3,
                    bgcolor: getTrackColor(track.type),
                    borderRadius: 1,
                    mx: 'auto',
                    mb: 0.5,
                  }}
                />
                
                {/* Volume fader visualization */}
                <Box
                  sx={{
                    width: 4,
                    height: 40,
                    bgcolor: '#333',
                    borderRadius: 1,
                    mx: 'auto',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      width: '100%',
                      height: `${Math.max(0, (track.volume + 60) / 72 * 100)}%`,
                      bgcolor: track.mute ? '#666' : (track.solo ? '#ffeb3b' : '#4caf50'),
                      borderRadius: 1,
                    }}
                  />
                  {/* Fader cap */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: `${Math.max(0, (track.volume + 60) / 72 * 100)}%`,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 12,
                      height: 4,
                      bgcolor: '#fff',
                      borderRadius: 0.5,
                    }}
                  />
                </Box>
                
                {/* Track label */}
                <Typography variant="caption" sx={{ fontSize: 8, display: 'block', mt: 0.5 }}>
                  {track.name}
                </Typography>
                
                {/* Level display */}
                <Typography variant="caption" sx={{ fontSize: 8, color: '#b0b0b0' }}>
                  {formatDb(track.volume)}
                </Typography>
                
                {/* Mute/Solo indicators */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.25, mt: 0.25 }}>
                  {track.mute && (
                    <VolumeOff sx={{ fontSize: 10, color: '#f44336' }} />
                  )}
                  {track.solo && (
                    <Headphones sx={{ fontSize: 10, color: '#ffeb3b' }} />
                  )}
                  {track.armed && (
                    <FiberManualRecord sx={{ fontSize: 10, color: '#f44336' }} />
                  )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Expanded track controls */}
      {expandedTrack && (
        <Box sx={{ p: 1, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1, mb: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
            <IconButton size="small" sx={{ p: 0.5 }} onClick={() => setShowEq(!showEq)}>
              <GraphicEq sx={{ fontSize: 14 }} />
            </IconButton>
            <IconButton size="small" sx={{ p: 0.5 }} onClick={() => setShowDynamics(!showDynamics)}>
              <Speed sx={{ fontSize: 14 }} />
            </IconButton>
            <IconButton size="small" sx={{ p: 0.5 }}>
              <Tune sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
          
          {showEq && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ fontSize: 9, color: '#b0b0b0' }}>
                EQ Bands
              </Typography>
              <Grid container spacing={0.3} sx={{ mt: 0.5 }}>
                <Grid item xs={2.4}>
                  <Chip label="80Hz" size="small" sx={{ fontSize: 8, height: 14, width: '100%' }} />
                </Grid>
                <Grid item xs={2.4}>
                  <Chip label="250Hz" size="small" sx={{ fontSize: 8, height: 14, width: '100%' }} />
                </Grid>
                <Grid item xs={2.4}>
                  <Chip label="1kHz" size="small" sx={{ fontSize: 8, height: 14, width: '100%' }} />
                </Grid>
                <Grid item xs={2.4}>
                  <Chip label="4kHz" size="small" sx={{ fontSize: 8, height: 14, width: '100%' }} />
                </Grid>
                <Grid item xs={2.4}>
                  <Chip label="12kHz" size="small" sx={{ fontSize: 8, height: 14, width: '100%' }} />
                </Grid>
              </Grid>
            </Box>
          )}
          
          {showDynamics && (
            <Box>
              <Typography variant="caption" sx={{ fontSize: 9, color: '#b0b0b0' }}>
                Dynamics
              </Typography>
              <Grid container spacing={0.3} sx={{ mt: 0.5 }}>
                {data.tracks?.find(t => t.id === expandedTrack)?.compressor?.enabled && (
                  <Grid item xs={4}>
                    <Chip label="Comp" size="small" color="primary" sx={{ fontSize: 8, height: 14, width: '100%' }} />
                  </Grid>
                )}
                {data.tracks?.find(t => t.id === expandedTrack)?.gate?.enabled && (
                  <Grid item xs={4}>
                    <Chip label="Gate" size="small" sx={{ fontSize: 8, height: 14, width: '100%' }} />
                  </Grid>
                )}
                {data.tracks?.find(t => t.id === expandedTrack)?.limiter?.enabled && (
                  <Grid item xs={4}>
                    <Chip label="Limit" size="small" sx={{ fontSize: 8, height: 14, width: '100%' }} />
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </Box>
      )}

      {/* Buses */}
      {data.buses && data.buses.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
            Buses
          </Typography>
          <Grid container spacing={0.3} sx={{ mt: 0.5 }}>
            {data.buses.map((bus) => (
              <Grid item xs={4} key={bus.id}>
                <Chip
                  label={bus.name}
                  size="small"
                  color={bus.type === 'fx' ? 'secondary' : 'default'}
                  sx={{ fontSize: 9, height: 16, width: '100%' }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Master section */}
      <Box sx={{ p: 1, bgcolor: 'rgba(244,67,54,0.1)', borderRadius: 1, mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 600 }}>
            MASTER
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Typography variant="caption" sx={{ fontSize: 10 }}>
            {formatDb(data.master?.volume || 0)} dB
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.3, mt: 0.5 }}>
          {data.master?.limiter && (
            <Chip label="Limiter" size="small" color="error" sx={{ fontSize: 8, height: 14 }} />
          )}
          {data.master?.eq?.enabled && (
            <Chip label="EQ" size="small" sx={{ fontSize: 8, height: 14 }} />
          )}
          {data.master?.compressor?.enabled && (
            <Chip label="Comp" size="small" sx={{ fontSize: 8, height: 14 }} />
          )}
        </Box>
      </Box>

      {/* Plugins */}
      {data.plugins && data.plugins.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
            Plugins ({data.plugins.length})
          </Typography>
          <Grid container spacing={0.3} sx={{ mt: 0.5 }}>
            {data.plugins.slice(0, 4).map((plugin) => (
              <Grid item xs={6} key={plugin.id}>
                <Chip
                  label={plugin.name}
                  size="small"
                  variant={plugin.bypass ? 'outlined' : 'filled'}
                  sx={{ fontSize: 8, height: 14, width: '100%' }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Analysis tools */}
      <Box sx={{ display: 'flex', gap: 0.3, mb: 1 }}>
        {data.analysis?.spectrum && (
          <Chip label="Spectrum" size="small" sx={{ fontSize: 8, height: 14 }} />
        )}
        {data.analysis?.correlation && (
          <Chip label="Corr" size="small" sx={{ fontSize: 8, height: 14 }} />
        )}
        {data.analysis?.loudness && (
          <Chip label="LUFS" size="small" sx={{ fontSize: 8, height: 14 }} />
        )}
        {data.analysis?.phaseScope && (
          <Chip label="Phase" size="small" sx={{ fontSize: 8, height: 14 }} />
        )}
      </Box>

      {/* Performance metrics */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ fontSize: 9, color: '#4caf50' }}>
          CPU: {data.cpuUsage || 0}%
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 9, color: '#ff9800' }}>
          Latency: {data.latency || 0}ms
        </Typography>
      </Box>

      {/* Output handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="master_out"
        style={{
          background: '#f44336',
          width: 12,
          height: 12,
          top: '20%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="monitor"
        style={{
          background: '#2196f3',
          width: 10,
          height: 10,
          top: '35%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="cue"
        style={{
          background: '#ff9800',
          width: 10,
          height: 10,
          top: '50%',
        }}
      />
      {/* Bus outputs */}
      {data.buses?.map((bus, index) => (
        <Handle
          key={bus.id}
          type="source"
          position={Position.Right}
          id={`bus_${bus.id}`}
          style={{
            background: '#9c27b0',
            width: 8,
            height: 8,
            top: `${65 + (index * 10)}%`,
          }}
        />
      ))}
    </Paper>
  );
};

export default memo(AudioMixerNode);