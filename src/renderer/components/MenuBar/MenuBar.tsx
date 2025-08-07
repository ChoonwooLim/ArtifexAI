import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  styled,
  Typography
} from '@mui/material';
import {
  Save as SaveIcon,
  FolderOpen as OpenIcon,
  Add as NewIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  ContentCut as CutIcon,
  ContentCopy as CopyIcon,
  ContentPaste as PasteIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  ExitToApp as ExitIcon,
} from '@mui/icons-material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'static',
  backgroundColor: '#151515',
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
  minHeight: 32,
  '& .MuiToolbar-root': {
    minHeight: 32,
    padding: 0,
  }
}));

const MenuButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  textTransform: 'none',
  borderRadius: 0,
  padding: '4px 16px',
  minHeight: 32,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: theme.palette.text.primary,
  }
}));

const MenuBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, menu: string) => {
    setAnchorEl(event.currentTarget);
    setActiveMenu(menu);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMenu(null);
  };

  const handleAction = (action: string) => {
    console.log(`Action: ${action}`);
    handleMenuClose();
  };

  return (
    <StyledAppBar>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Logo/Title */}
        <Box sx={{ 
          px: 2, 
          display: 'flex', 
          alignItems: 'center',
          borderRight: 1,
          borderColor: 'divider',
          height: 32
        }}>
          <Typography 
            variant="caption" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #00e5ff 30%, #ff4081 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Artifex.AI
          </Typography>
        </Box>

        {/* File Menu */}
        <MenuButton onClick={(e) => handleMenuOpen(e, 'file')}>
          File
        </MenuButton>

        {/* Edit Menu */}
        <MenuButton onClick={(e) => handleMenuOpen(e, 'edit')}>
          Edit
        </MenuButton>

        {/* Workspace Menu */}
        <MenuButton onClick={(e) => handleMenuOpen(e, 'workspace')}>
          Workspace
        </MenuButton>

        {/* Viewer Menu */}
        <MenuButton onClick={(e) => handleMenuOpen(e, 'viewer')}>
          Viewer
        </MenuButton>

        {/* Render Menu */}
        <MenuButton onClick={(e) => handleMenuOpen(e, 'render')}>
          Render
        </MenuButton>

        {/* Cache Menu */}
        <MenuButton onClick={(e) => handleMenuOpen(e, 'cache')}>
          Cache
        </MenuButton>

        {/* Help Menu */}
        <MenuButton onClick={(e) => handleMenuOpen(e, 'help')}>
          Help
        </MenuButton>
      </Box>

      {/* File Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={activeMenu === 'file'}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            minWidth: 200,
            mt: 0.5,
          }
        }}
      >
        <MenuItem onClick={() => handleAction('new')}>
          <ListItemIcon><NewIcon fontSize="small" /></ListItemIcon>
          <ListItemText>New Project</ListItemText>
          <Typography variant="caption" sx={{ ml: 2 }}>Ctrl+N</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleAction('open')}>
          <ListItemIcon><OpenIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Open...</ListItemText>
          <Typography variant="caption" sx={{ ml: 2 }}>Ctrl+O</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleAction('save')}>
          <ListItemIcon><SaveIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Save</ListItemText>
          <Typography variant="caption" sx={{ ml: 2 }}>Ctrl+S</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleAction('saveAs')}>
          <ListItemText sx={{ ml: 4 }}>Save As...</ListItemText>
          <Typography variant="caption" sx={{ ml: 2 }}>Ctrl+Shift+S</Typography>
        </MenuItem>
        <Divider sx={{ borderColor: '#2a2a2a' }} />
        <MenuItem onClick={() => handleAction('recent')}>
          <ListItemText>Recent Projects</ListItemText>
        </MenuItem>
        <Divider sx={{ borderColor: '#2a2a2a' }} />
        <MenuItem onClick={() => handleAction('exit')}>
          <ListItemIcon><ExitIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Exit</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={activeMenu === 'edit'}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            minWidth: 200,
            mt: 0.5,
          }
        }}
      >
        <MenuItem onClick={() => handleAction('undo')}>
          <ListItemIcon><UndoIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Undo</ListItemText>
          <Typography variant="caption" sx={{ ml: 2 }}>Ctrl+Z</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleAction('redo')}>
          <ListItemIcon><RedoIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Redo</ListItemText>
          <Typography variant="caption" sx={{ ml: 2 }}>Ctrl+Y</Typography>
        </MenuItem>
        <Divider sx={{ borderColor: '#2a2a2a' }} />
        <MenuItem onClick={() => handleAction('cut')}>
          <ListItemIcon><CutIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Cut</ListItemText>
          <Typography variant="caption" sx={{ ml: 2 }}>Ctrl+X</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleAction('copy')}>
          <ListItemIcon><CopyIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Copy</ListItemText>
          <Typography variant="caption" sx={{ ml: 2 }}>Ctrl+C</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleAction('paste')}>
          <ListItemIcon><PasteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Paste</ListItemText>
          <Typography variant="caption" sx={{ ml: 2 }}>Ctrl+V</Typography>
        </MenuItem>
        <Divider sx={{ borderColor: '#2a2a2a' }} />
        <MenuItem onClick={() => handleAction('preferences')}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Preferences</ListItemText>
        </MenuItem>
      </Menu>

      {/* Workspace Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={activeMenu === 'workspace'}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            minWidth: 200,
            mt: 0.5,
          }
        }}
      >
        <MenuItem onClick={() => handleAction('saveLayout')}>
          <ListItemText>Save Current Layout</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('loadLayout')}>
          <ListItemText>Load Layout...</ListItemText>
        </MenuItem>
        <Divider sx={{ borderColor: '#2a2a2a' }} />
        <MenuItem onClick={() => handleAction('layoutCompositing')}>
          <ListItemText>Compositing Layout</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('layout3D')}>
          <ListItemText>3D Layout</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('layoutAnimation')}>
          <ListItemText>Animation Layout</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('layoutAI')}>
          <ListItemText>AI Generation Layout</ListItemText>
        </MenuItem>
        <Divider sx={{ borderColor: '#2a2a2a' }} />
        <MenuItem onClick={() => handleAction('resetLayout')}>
          <ListItemText>Reset to Default</ListItemText>
        </MenuItem>
      </Menu>

      {/* Help Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={activeMenu === 'help'}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            minWidth: 200,
            mt: 0.5,
          }
        }}
      >
        <MenuItem onClick={() => handleAction('documentation')}>
          <ListItemText>Documentation</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('tutorials')}>
          <ListItemText>Tutorials</ListItemText>
        </MenuItem>
        <Divider sx={{ borderColor: '#2a2a2a' }} />
        <MenuItem onClick={() => handleAction('about')}>
          <ListItemIcon><InfoIcon fontSize="small" /></ListItemIcon>
          <ListItemText>About Artifex.AI</ListItemText>
        </MenuItem>
      </Menu>
    </StyledAppBar>
  );
};

export default MenuBar;