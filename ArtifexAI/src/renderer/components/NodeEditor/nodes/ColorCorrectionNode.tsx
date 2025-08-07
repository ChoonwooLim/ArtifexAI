import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography, Paper, Slider, Grid } from '@mui/material';
import { ColorLens } from '@mui/icons-material';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
}

const SliderControl = ({ label, value, min, max, step = 0.01 }: SliderControlProps) => (
  <Box>
    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>
      {label}: {value.toFixed(2)}
    </Typography>
    <Slider
      size="small"
      value={value}
      min={min}
      max={max}
      step={step}
      sx={{
        color: '#00D9FF',
        height: 4,
        '& .MuiSlider-thumb': {
          width: 10,
          height: 10,
        },
        '& .MuiSlider-rail': {
          opacity: 0.3,
        },
      }}
    />
  </Box>
);

const ColorCorrectionNode = ({ data, selected }: any) => {
  return (
    <Paper
      elevation={selected ? 8 : 2}
      sx={{
        minWidth: 220,
        background: 'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)',
        border: selected ? '2px solid #00D9FF' : '1px solid #3a8fb7',
        borderRadius: 2,
      }}
    >
      <Box sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <ColorLens sx={{ fontSize: 16, color: 'white' }} />
          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
            {data.label || 'Color Correction'}
          </Typography>
        </Box>
        
        <Grid container spacing={0.5}>
          <Grid item xs={12}>
            <SliderControl
              label="Brightness"
              value={data.brightness || 0}
              min={-100}
              max={100}
            />
          </Grid>
          <Grid item xs={12}>
            <SliderControl
              label="Contrast"
              value={data.contrast || 1}
              min={0}
              max={2}
            />
          </Grid>
          <Grid item xs={12}>
            <SliderControl
              label="Saturation"
              value={data.saturation || 1}
              min={0}
              max={2}
            />
          </Grid>
          <Grid item xs={12}>
            <SliderControl
              label="Hue"
              value={data.hue || 0}
              min={-180}
              max={180}
            />
          </Grid>
          <Grid item xs={12}>
            <SliderControl
              label="Gamma"
              value={data.gamma || 1}
              min={0.1}
              max={3}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
          <Box sx={{ 
            width: 12, 
            height: 12, 
            borderRadius: '50%',
            background: `hsl(${data.hue || 0}, 100%, 50%)`,
            border: '1px solid white',
          }} />
          <Typography variant="caption" sx={{ color: 'white', fontSize: 10 }}>
            LUT: {data.lut || 'None'}
          </Typography>
        </Box>
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

export default ColorCorrectionNode;