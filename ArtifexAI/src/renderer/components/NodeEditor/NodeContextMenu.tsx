import React from 'react';
import { Menu, MenuItem, ListSubheader, Divider, InputBase, Box } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNodeLibrary } from './hooks/useNodeLibrary';

interface NodeContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onAddNode: (type: string) => void;
}

const NodeContextMenu: React.FC<NodeContextMenuProps> = ({ position, onClose, onAddNode }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { getNodesByCategory } = useNodeLibrary();
  const categories = getNodesByCategory();

  const filteredCategories = React.useMemo(() => {
    if (!searchTerm) return categories;
    
    const filtered: typeof categories = {};
    Object.entries(categories).forEach(([category, nodes]) => {
      const filteredNodes = nodes.filter(
        (node) =>
          node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredNodes.length > 0) {
        filtered[category] = filteredNodes;
      }
    });
    return filtered;
  }, [categories, searchTerm]);

  return (
    <Menu
      open={true}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: position.y, left: position.x }}
      PaperProps={{
        sx: {
          maxHeight: 500,
          width: 280,
          backgroundColor: '#1a1a1a',
          border: '1px solid #3a3a3a',
        },
      }}
    >
      <Box sx={{ p: 1, borderBottom: '1px solid #3a3a3a' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
          <Search sx={{ color: '#666', mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            sx={{
              flex: 1,
              color: 'white',
              '& input': { padding: 0 },
            }}
          />
        </Box>
      </Box>
      
      {Object.entries(filteredCategories).map(([category, nodes]) => (
        <React.Fragment key={category}>
          <ListSubheader
            sx={{
              backgroundColor: '#1a1a1a',
              color: '#00D9FF',
              fontSize: 11,
              lineHeight: '24px',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {category}
          </ListSubheader>
          {nodes.map((node) => (
            <MenuItem
              key={node.type}
              onClick={() => {
                onAddNode(node.type);
                onClose();
              }}
              sx={{
                fontSize: 13,
                py: 0.75,
                '&:hover': {
                  backgroundColor: '#2a2a2a',
                },
              }}
            >
              <Box>
                <Box sx={{ fontWeight: 500 }}>{node.label}</Box>
                <Box sx={{ fontSize: 11, color: '#888' }}>{node.description}</Box>
              </Box>
            </MenuItem>
          ))}
          <Divider sx={{ my: 0.5, borderColor: '#2a2a2a' }} />
        </React.Fragment>
      ))}
    </Menu>
  );
};

export default NodeContextMenu;