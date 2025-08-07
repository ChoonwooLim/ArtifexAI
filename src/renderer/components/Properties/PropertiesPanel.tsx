import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Divider,
  styled,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  Tune as TuneIcon,
  ColorLens as ColorIcon,
} from '@mui/icons-material';

const PropertiesContainer = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  overflow: 'auto',
}));

const PropertyGroup = styled(Accordion)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  '&:before': {
    display: 'none',
  },
  '& .MuiAccordionSummary-root': {
    minHeight: 36,
    backgroundColor: theme.palette.mode === 'dark' ? '#252525' : '#f5f5f5',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#eeeeee',
    },
  },
  '& .MuiAccordionSummary-content': {
    margin: '8px 0',
  },
  '& .MuiAccordionDetails-root': {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
  },
}));

const PropertyRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
  gap: theme.spacing(1),
}));

const PropertyLabel = styled(Typography)(({ theme }) => ({
  minWidth: 100,
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    fontSize: '0.875rem',
    padding: '4px 8px',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 32,
  fontSize: '0.75rem',
  textTransform: 'none',
}));

interface NodeProperties {
  name: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  opacity: number;
  blendMode: string;
  colorCorrection: {
    brightness: number;
    contrast: number;
    saturation: number;
    hue: number;
  };
}

const PropertiesPanel: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [properties, setProperties] = useState<NodeProperties>({
    name: 'ColorCorrect1',
    type: 'ColorCorrection',
    position: { x: 320, y: 180 },
    size: { width: 1920, height: 1080 },
    opacity: 100,
    blendMode: 'normal',
    colorCorrection: {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      hue: 0,
    },
  });

  const handlePropertyChange = (property: string, value: any) => {
    setProperties(prev => ({
      ...prev,
      [property]: value,
    }));
  };

  const handleColorCorrectionChange = (property: string, value: number) => {
    setProperties(prev => ({
      ...prev,
      colorCorrection: {
        ...prev.colorCorrection,
        [property]: value,
      },
    }));
  };

  return (
    <PropertiesContainer>
      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 36 }}
      >
        <StyledTab label="Node" />
        <StyledTab label="Project" />
        <StyledTab label="Viewer" />
      </Tabs>

      <Box sx={{ p: 2 }}>
        {tabValue === 0 && (
          <>
            {/* Basic Properties */}
            <PropertyGroup defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="caption" fontWeight={500}>
                  Basic Properties
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PropertyRow>
                  <PropertyLabel>Name</PropertyLabel>
                  <StyledTextField
                    value={properties.name}
                    onChange={(e) => handlePropertyChange('name', e.target.value)}
                    size="small"
                    fullWidth
                  />
                </PropertyRow>
                <PropertyRow>
                  <PropertyLabel>Type</PropertyLabel>
                  <StyledTextField
                    value={properties.type}
                    size="small"
                    fullWidth
                    disabled
                  />
                </PropertyRow>
                <PropertyRow>
                  <PropertyLabel>Position X</PropertyLabel>
                  <StyledTextField
                    type="number"
                    value={properties.position.x}
                    size="small"
                    fullWidth
                  />
                </PropertyRow>
                <PropertyRow>
                  <PropertyLabel>Position Y</PropertyLabel>
                  <StyledTextField
                    type="number"
                    value={properties.position.y}
                    size="small"
                    fullWidth
                  />
                </PropertyRow>
              </AccordionDetails>
            </PropertyGroup>

            {/* Transform */}
            <PropertyGroup>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="caption" fontWeight={500}>
                  Transform
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PropertyRow>
                  <PropertyLabel>Width</PropertyLabel>
                  <StyledTextField
                    type="number"
                    value={properties.size.width}
                    size="small"
                    fullWidth
                  />
                </PropertyRow>
                <PropertyRow>
                  <PropertyLabel>Height</PropertyLabel>
                  <StyledTextField
                    type="number"
                    value={properties.size.height}
                    size="small"
                    fullWidth
                  />
                </PropertyRow>
                <PropertyRow>
                  <PropertyLabel>Scale</PropertyLabel>
                  <Slider
                    value={100}
                    min={0}
                    max={200}
                    valueLabelDisplay="auto"
                    sx={{ flex: 1 }}
                  />
                </PropertyRow>
                <PropertyRow>
                  <PropertyLabel>Rotation</PropertyLabel>
                  <Slider
                    value={0}
                    min={-180}
                    max={180}
                    valueLabelDisplay="auto"
                    sx={{ flex: 1 }}
                  />
                </PropertyRow>
              </AccordionDetails>
            </PropertyGroup>

            {/* Color Correction */}
            <PropertyGroup defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="caption" fontWeight={500}>
                  Color Correction
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PropertyRow>
                  <PropertyLabel>Brightness</PropertyLabel>
                  <Slider
                    value={properties.colorCorrection.brightness}
                    onChange={(e, v) => handleColorCorrectionChange('brightness', v as number)}
                    min={-100}
                    max={100}
                    valueLabelDisplay="auto"
                    sx={{ flex: 1 }}
                  />
                </PropertyRow>
                <PropertyRow>
                  <PropertyLabel>Contrast</PropertyLabel>
                  <Slider
                    value={properties.colorCorrection.contrast}
                    onChange={(e, v) => handleColorCorrectionChange('contrast', v as number)}
                    min={-100}
                    max={100}
                    valueLabelDisplay="auto"
                    sx={{ flex: 1 }}
                  />
                </PropertyRow>
                <PropertyRow>
                  <PropertyLabel>Saturation</PropertyLabel>
                  <Slider
                    value={properties.colorCorrection.saturation}
                    onChange={(e, v) => handleColorCorrectionChange('saturation', v as number)}
                    min={-100}
                    max={100}
                    valueLabelDisplay="auto"
                    sx={{ flex: 1 }}
                  />
                </PropertyRow>
                <PropertyRow>
                  <PropertyLabel>Hue</PropertyLabel>
                  <Slider
                    value={properties.colorCorrection.hue}
                    onChange={(e, v) => handleColorCorrectionChange('hue', v as number)}
                    min={-180}
                    max={180}
                    valueLabelDisplay="auto"
                    sx={{ flex: 1 }}
                  />
                </PropertyRow>
              </AccordionDetails>
            </PropertyGroup>

            {/* Compositing */}
            <PropertyGroup>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="caption" fontWeight={500}>
                  Compositing
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PropertyRow>
                  <PropertyLabel>Opacity</PropertyLabel>
                  <Slider
                    value={properties.opacity}
                    onChange={(e, v) => handlePropertyChange('opacity', v)}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                    sx={{ flex: 1 }}
                  />
                </PropertyRow>
                <PropertyRow>
                  <PropertyLabel>Blend Mode</PropertyLabel>
                  <Select
                    value={properties.blendMode}
                    onChange={(e) => handlePropertyChange('blendMode', e.target.value)}
                    size="small"
                    fullWidth
                  >
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="multiply">Multiply</MenuItem>
                    <MenuItem value="screen">Screen</MenuItem>
                    <MenuItem value="overlay">Overlay</MenuItem>
                    <MenuItem value="add">Add</MenuItem>
                    <MenuItem value="subtract">Subtract</MenuItem>
                  </Select>
                </PropertyRow>
                <PropertyRow>
                  <PropertyLabel>Premultiply</PropertyLabel>
                  <FormControlLabel
                    control={<Switch size="small" />}
                    label=""
                  />
                </PropertyRow>
              </AccordionDetails>
            </PropertyGroup>
          </>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography variant="body2" color="text.secondary">
              Project Settings
            </Typography>
          </Box>
        )}

        {tabValue === 2 && (
          <Box>
            <Typography variant="body2" color="text.secondary">
              Viewer Settings
            </Typography>
          </Box>
        )}
      </Box>
    </PropertiesContainer>
  );
};

export default PropertiesPanel;