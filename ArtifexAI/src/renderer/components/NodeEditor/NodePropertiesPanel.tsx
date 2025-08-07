import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  IconButton,
  Divider,
  Button,
} from '@mui/material';
import { Close, Settings } from '@mui/icons-material';
import { Node } from 'reactflow';

interface NodePropertiesPanelProps {
  node: Node;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const NodePropertiesPanel: React.FC<NodePropertiesPanelProps> = ({ node, onUpdate, onClose }) => {
  const renderProperties = () => {
    const { type, data } = node;

    switch (type) {
      case 'input':
        return (
          <>
            <TextField
              fullWidth
              label="Label"
              value={data.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              size="small"
              sx={{ mb: 2 }}
            />
            <Select
              fullWidth
              value={data.type}
              onChange={(e) => onUpdate({ type: e.target.value })}
              size="small"
              sx={{ mb: 2 }}
            >
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="image">Image</MenuItem>
              <MenuItem value="audio">Audio</MenuItem>
              <MenuItem value="sequence">Image Sequence</MenuItem>
            </Select>
            <TextField
              fullWidth
              label="File Path"
              value={data.path || ''}
              onChange={(e) => onUpdate({ path: e.target.value })}
              size="small"
              sx={{ mb: 2 }}
            />
            <Button variant="outlined" size="small" fullWidth>
              Browse Files
            </Button>
          </>
        );

      case 'aiGenerator':
        return (
          <>
            <TextField
              fullWidth
              label="Label"
              value={data.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              size="small"
              sx={{ mb: 2 }}
            />
            <Select
              fullWidth
              value={data.model}
              onChange={(e) => onUpdate({ model: e.target.value })}
              size="small"
              sx={{ mb: 2 }}
            >
              <MenuItem value="t2v">Text to Video (Wan 2.2)</MenuItem>
              <MenuItem value="i2v">Image to Video (Wan 2.2)</MenuItem>
              <MenuItem value="t2i">Text to Image</MenuItem>
              <MenuItem value="music">Music Generation</MenuItem>
              <MenuItem value="voice">Voice Synthesis</MenuItem>
            </Select>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Prompt"
              value={data.prompt || ''}
              onChange={(e) => onUpdate({ prompt: e.target.value })}
              size="small"
              sx={{ mb: 2 }}
            />
            <Typography variant="caption" sx={{ color: '#888' }}>
              Settings
            </Typography>
            <Divider sx={{ my: 1 }} />
            <TextField
              fullWidth
              label="Resolution"
              value={data.settings?.resolution || '1280x720'}
              onChange={(e) => onUpdate({ 
                settings: { ...data.settings, resolution: e.target.value }
              })}
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="number"
              label="FPS"
              value={data.settings?.fps || 24}
              onChange={(e) => onUpdate({ 
                settings: { ...data.settings, fps: parseInt(e.target.value) }
              })}
              size="small"
              sx={{ mb: 2 }}
            />
          </>
        );

      case 'colorCorrection':
        return (
          <>
            <TextField
              fullWidth
              label="Label"
              value={data.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              size="small"
              sx={{ mb: 2 }}
            />
            <Typography variant="caption">Brightness</Typography>
            <Slider
              value={data.brightness || 0}
              onChange={(e, v) => onUpdate({ brightness: v })}
              min={-100}
              max={100}
              sx={{ mb: 2 }}
            />
            <Typography variant="caption">Contrast</Typography>
            <Slider
              value={data.contrast || 1}
              onChange={(e, v) => onUpdate({ contrast: v })}
              min={0}
              max={2}
              step={0.01}
              sx={{ mb: 2 }}
            />
            <Typography variant="caption">Saturation</Typography>
            <Slider
              value={data.saturation || 1}
              onChange={(e, v) => onUpdate({ saturation: v })}
              min={0}
              max={2}
              step={0.01}
              sx={{ mb: 2 }}
            />
            <Typography variant="caption">Hue Shift</Typography>
            <Slider
              value={data.hue || 0}
              onChange={(e, v) => onUpdate({ hue: v })}
              min={-180}
              max={180}
              sx={{ mb: 2 }}
            />
            <Typography variant="caption">Gamma</Typography>
            <Slider
              value={data.gamma || 1}
              onChange={(e, v) => onUpdate({ gamma: v })}
              min={0.1}
              max={3}
              step={0.01}
              sx={{ mb: 2 }}
            />
          </>
        );

      case 'composite':
        return (
          <>
            <TextField
              fullWidth
              label="Label"
              value={data.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              size="small"
              sx={{ mb: 2 }}
            />
            <Select
              fullWidth
              value={data.mode || 'over'}
              onChange={(e) => onUpdate({ mode: e.target.value })}
              size="small"
              sx={{ mb: 2 }}
            >
              <MenuItem value="over">Over</MenuItem>
              <MenuItem value="add">Add</MenuItem>
              <MenuItem value="multiply">Multiply</MenuItem>
              <MenuItem value="screen">Screen</MenuItem>
              <MenuItem value="overlay">Overlay</MenuItem>
              <MenuItem value="difference">Difference</MenuItem>
            </Select>
            <Typography variant="caption">Opacity</Typography>
            <Slider
              value={data.opacity || 1}
              onChange={(e, v) => onUpdate({ opacity: v })}
              min={0}
              max={1}
              step={0.01}
              sx={{ mb: 2 }}
            />
          </>
        );

      case 'output':
        return (
          <>
            <TextField
              fullWidth
              label="Label"
              value={data.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              size="small"
              sx={{ mb: 2 }}
            />
            <Select
              fullWidth
              value={data.format || 'mp4'}
              onChange={(e) => onUpdate({ format: e.target.value })}
              size="small"
              sx={{ mb: 2 }}
            >
              <MenuItem value="mp4">MP4</MenuItem>
              <MenuItem value="mov">MOV</MenuItem>
              <MenuItem value="avi">AVI</MenuItem>
              <MenuItem value="webm">WebM</MenuItem>
              <MenuItem value="prores">ProRes</MenuItem>
            </Select>
            <Select
              fullWidth
              value={data.quality || 'high'}
              onChange={(e) => onUpdate({ quality: e.target.value })}
              size="small"
              sx={{ mb: 2 }}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="ultra">Ultra</MenuItem>
              <MenuItem value="lossless">Lossless</MenuItem>
            </Select>
            <TextField
              fullWidth
              label="Output Path"
              value={data.outputPath || ''}
              onChange={(e) => onUpdate({ outputPath: e.target.value })}
              size="small"
              sx={{ mb: 2 }}
            />
          </>
        );

      default:
        return (
          <TextField
            fullWidth
            label="Label"
            value={data.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            size="small"
          />
        );
    }
  };

  return (
    <Drawer
      anchor="right"
      open={true}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 320,
          backgroundColor: '#1a1a1a',
          borderLeft: '1px solid #3a3a3a',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Settings sx={{ mr: 1, color: '#00D9FF' }} />
          <Typography variant="h6" sx={{ flex: 1 }}>
            Node Properties
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        
        <Typography variant="caption" sx={{ color: '#888' }}>
          Type: {node.type}
        </Typography>
        <Typography variant="caption" sx={{ color: '#888', ml: 2 }}>
          ID: {node.id}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {renderProperties()}
      </Box>
    </Drawer>
  );
};

export default NodePropertiesPanel;