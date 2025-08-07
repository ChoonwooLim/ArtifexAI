import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography, Paper, Slider, IconButton, Chip, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { VolumeUp, Equalizer, MicNone, GraphicEq, PlayArrow, Pause } from '@mui/icons-material';

const AudioNode = ({ data, selected }: any) => {
  return (
    <Paper
      elevation={selected ? 8 : 2}
      sx={{
        minWidth: 200,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: selected ? '2px solid #00D9FF' : '1px solid #544b63',
        borderRadius: 2,
      }}
    >
      <Box sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <VolumeUp sx={{ fontSize: 16, color: 'white' }} />
          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
            {data.label || 'Audio Mixer'}
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <IconButton size="small" sx={{ color: 'white', p: 0.5 }}>
              {data.playing ? <Pause sx={{ fontSize: 14 }} /> : <PlayArrow sx={{ fontSize: 14 }} />}
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <VolumeUp sx={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>
              Volume: {Math.round((data.volume || 1) * 100)}%
            </Typography>
          </Box>
          <Slider
            size="small"
            value={data.volume || 1}
            min={0}
            max={1}
            step={0.01}
            sx={{
              color: '#00D9FF',
              height: 4,
              '& .MuiSlider-thumb': {
                width: 10,
                height: 10,
              },
            }}
          />
        </Box>
        
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <GraphicEq sx={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>
              EQ Bands
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.25, height: 20 }}>
            {[60, 250, 1000, 4000, 16000].map((freq, i) => (
              <Box
                key={freq}
                sx={{
                  flex: 1,
                  background: 'rgba(0,217,255,0.3)',
                  borderRadius: 0.5,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    height: `${50 + (data.eq?.[i] || 0) * 50}%`,
                    background: '#00D9FF',
                    borderRadius: 0.5,
                  }}
                />
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.25 }}>
            {['60', '250', '1k', '4k', '16k'].map(label => (
              <Typography key={label} variant="caption" sx={{ fontSize: 8, color: 'rgba(255,255,255,0.5)' }}>
                {label}
              </Typography>
            ))}
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {data.effects?.map((effect: string) => (
            <Chip
              key={effect}
              label={effect}
              size="small"
              sx={{
                height: 16,
                fontSize: 9,
                backgroundColor: 'rgba(0,217,255,0.2)',
                color: '#00D9FF',
              }}
            />
          ))}
        </Box>
        
        <ToggleButtonGroup
          size="small"
          value={data.mode || 'stereo'}
          exclusive
          sx={{ mt: 1, width: '100%' }}
        >
          <ToggleButton 
            value="mono" 
            sx={{ 
              fontSize: 10, 
              py: 0.25,
              color: 'rgba(255,255,255,0.7)',
              '&.Mui-selected': { 
                backgroundColor: 'rgba(0,217,255,0.2)',
                color: '#00D9FF',
              }
            }}
          >
            Mono
          </ToggleButton>
          <ToggleButton 
            value="stereo"
            sx={{ 
              fontSize: 10, 
              py: 0.25,
              color: 'rgba(255,255,255,0.7)',
              '&.Mui-selected': { 
                backgroundColor: 'rgba(0,217,255,0.2)',
                color: '#00D9FF',
              }
            }}
          >
            Stereo
          </ToggleButton>
          <ToggleButton 
            value="surround"
            sx={{ 
              fontSize: 10, 
              py: 0.25,
              color: 'rgba(255,255,255,0.7)',
              '&.Mui-selected': { 
                backgroundColor: 'rgba(0,217,255,0.2)',
                color: '#00D9FF',
              }
            }}
          >
            5.1
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: '#00D9FF' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ background: '#00D9FF' }}
      />
    </Paper>
  );
};

export default AudioNode;