import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Tabs,
  Tab,
  styled,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Folder as FolderIcon,
  Movie as VideoIcon,
  Image as ImageIcon,
  AudioFile as AudioIcon,
  ThreeDRotation as Model3DIcon,
  AutoAwesome as AIIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

const BrowserContainer = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
}));

const HeaderBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1),
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 32,
  fontSize: '0.75rem',
  textTransform: 'none',
}));

const AssetCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main,
  },
  border: '1px solid transparent',
}));

const AssetThumbnail = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingTop: '75%',
  position: 'relative',
  backgroundColor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

interface Asset {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio' | '3d' | 'ai';
  thumbnail?: string;
  size?: string;
  duration?: string;
  tags?: string[];
}

const AssetBrowser: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [assets] = useState<Asset[]>([
    { id: '1', name: 'Sample Video.mp4', type: 'video', size: '124 MB', duration: '00:02:34', tags: ['sample', 'test'] },
    { id: '2', name: 'Background.jpg', type: 'image', size: '2.4 MB', tags: ['background'] },
    { id: '3', name: 'Music Track.mp3', type: 'audio', size: '8.2 MB', duration: '00:03:12', tags: ['music'] },
    { id: '4', name: 'Logo Animation.mp4', type: 'video', size: '45 MB', duration: '00:00:05', tags: ['logo', 'animation'] },
    { id: '5', name: '3D Model.obj', type: '3d', size: '12 MB', tags: ['3d', 'model'] },
    { id: '6', name: 'AI Generated.mp4', type: 'ai', size: '67 MB', duration: '00:00:10', tags: ['ai', 'generated'] },
  ]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'video': return <VideoIcon sx={{ fontSize: 40, color: '#00e5ff' }} />;
      case 'image': return <ImageIcon sx={{ fontSize: 40, color: '#4caf50' }} />;
      case 'audio': return <AudioIcon sx={{ fontSize: 40, color: '#ffc107' }} />;
      case '3d': return <Model3DIcon sx={{ fontSize: 40, color: '#9c27b0' }} />;
      case 'ai': return <AIIcon sx={{ fontSize: 40, color: '#ff4081' }} />;
      default: return <FolderIcon sx={{ fontSize: 40, color: '#808080' }} />;
    }
  };

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <BrowserContainer>
      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 36 }}
      >
        <StyledTab label="All" />
        <StyledTab label="Videos" />
        <StyledTab label="Images" />
        <StyledTab label="Audio" />
        <StyledTab label="3D" />
        <StyledTab label="AI Assets" />
      </Tabs>

      <HeaderBar>
        <TextField
          size="small"
          placeholder="Search assets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        <IconButton size="small">
          <FilterIcon fontSize="small" />
        </IconButton>
        <IconButton size="small">
          <RefreshIcon fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          onClick={() => setViewMode('grid')}
          color={viewMode === 'grid' ? 'primary' : 'default'}
        >
          <GridViewIcon fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          onClick={() => setViewMode('list')}
          color={viewMode === 'list' ? 'primary' : 'default'}
        >
          <ListViewIcon fontSize="small" />
        </IconButton>
      </HeaderBar>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {viewMode === 'grid' ? (
          <Grid container spacing={2}>
            {filteredAssets.map(asset => (
              <Grid item xs={12} sm={6} md={4} key={asset.id}>
                <AssetCard>
                  <AssetThumbnail>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      {getIconForType(asset.type)}
                    </Box>
                    {asset.duration && (
                      <Chip
                        label={asset.duration}
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          fontSize: '0.7rem',
                          height: 20,
                        }}
                      />
                    )}
                  </AssetThumbnail>
                  <CardContent sx={{ p: 1 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: 500,
                      }}
                    >
                      {asset.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {asset.size}
                    </Typography>
                    {asset.tags && (
                      <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {asset.tags.map(tag => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{ 
                              fontSize: '0.65rem', 
                              height: 16,
                              '& .MuiChip-label': { px: 0.5 }
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </AssetCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box>
            {filteredAssets.map(asset => (
              <Box
                key={asset.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  borderBottom: 1,
                  borderColor: 'divider',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ mr: 2 }}>
                  {getIconForType(asset.type)}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">{asset.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {asset.size} {asset.duration && `• ${asset.duration}`}
                  </Typography>
                </Box>
                {asset.tags && (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {asset.tags.map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{ 
                          fontSize: '0.65rem', 
                          height: 16,
                          '& .MuiChip-label': { px: 0.5 }
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </BrowserContainer>
  );
};

export default AssetBrowser;