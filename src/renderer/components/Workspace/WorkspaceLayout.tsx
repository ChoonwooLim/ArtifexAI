import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Allotment, 
  AllotmentHandle,
  LayoutPriority 
} from 'allotment';
import 'allotment/dist/style.css';
import { 
  Box, 
  Paper, 
  Tabs, 
  Tab, 
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  styled,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  DragIndicator as DragIcon,
  Fullscreen as MaximizeIcon,
  FullscreenExit as RestoreIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  ContentCopy as DuplicateIcon,
  PhotoSizeSelectSmall as FloatIcon
} from '@mui/icons-material';

// 패널 타입 정의
export type PanelType = 
  | 'nodeGraph' 
  | 'viewer' 
  | 'properties' 
  | 'timeline' 
  | 'curveEditor'
  | 'sceneGraph'
  | 'backgroundRenders'
  | 'asset';

// 패널 인터페이스
export interface Panel {
  id: string;
  type: PanelType;
  title: string;
  locked?: boolean;
  minimized?: boolean;
  maximized?: boolean;
  floating?: boolean;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

// 레이아웃 프리셋 인터페이스
export interface LayoutPreset {
  name: string;
  id: string;
  panels: Panel[];
  sizes?: number[];
  orientation?: 'horizontal' | 'vertical';
}

// 스타일 컴포넌트
const StyledPanelContainer = styled(Paper)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
  borderRadius: 0,
  border: `1px solid ${theme.palette.mode === 'dark' ? '#2a2a2a' : '#e0e0e0'}`,
  overflow: 'hidden',
  '&.floating': {
    position: 'fixed',
    boxShadow: theme.shadows[8],
    borderRadius: 4,
    zIndex: 1000,
  }
}));

const StyledPanelHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5, 1),
  backgroundColor: theme.palette.mode === 'dark' ? '#252525' : '#f5f5f5',
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#2a2a2a' : '#e0e0e0'}`,
  minHeight: 32,
  cursor: 'move',
  userSelect: 'none',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#eeeeee',
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 32,
  fontSize: '0.875rem',
  textTransform: 'none',
  color: theme.palette.mode === 'dark' ? '#b0b0b0' : '#666666',
  '&.Mui-selected': {
    color: theme.palette.mode === 'dark' ? '#00e5ff' : '#1976d2',
  }
}));

// 패널 컴포넌트
interface PanelComponentProps {
  panel: Panel;
  onClose?: (id: string) => void;
  onMaximize?: (id: string) => void;
  onFloat?: (id: string) => void;
  onLock?: (id: string) => void;
  children?: React.ReactNode;
}

const PanelComponent: React.FC<PanelComponentProps> = ({
  panel,
  onClose,
  onMaximize,
  onFloat,
  onLock,
  children
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledPanelContainer 
      className={panel.floating ? 'floating' : ''}
      style={panel.floating ? {
        left: panel.position?.x || 100,
        top: panel.position?.y || 100,
        width: panel.size?.width || 400,
        height: panel.size?.height || 300,
      } : undefined}
    >
      <StyledPanelHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DragIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {panel.title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title={panel.locked ? "Unlock" : "Lock"}>
            <IconButton size="small" onClick={() => onLock?.(panel.id)}>
              {panel.locked ? 
                <LockIcon sx={{ fontSize: 14 }} /> : 
                <UnlockIcon sx={{ fontSize: 14 }} />
              }
            </IconButton>
          </Tooltip>
          <Tooltip title="Float/Dock">
            <IconButton size="small" onClick={() => onFloat?.(panel.id)}>
              <FloatIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={panel.maximized ? "Restore" : "Maximize"}>
            <IconButton size="small" onClick={() => onMaximize?.(panel.id)}>
              {panel.maximized ? 
                <RestoreIcon sx={{ fontSize: 14 }} /> : 
                <MaximizeIcon sx={{ fontSize: 14 }} />
              }
            </IconButton>
          </Tooltip>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon sx={{ fontSize: 14 }} />
          </IconButton>
          <IconButton size="small" onClick={() => onClose?.(panel.id)}>
            <CloseIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>
      </StyledPanelHeader>
      
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        {children}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.mode === 'dark' ? '#252525' : '#ffffff',
            fontSize: '0.875rem'
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <DuplicateIcon sx={{ mr: 1, fontSize: 16 }} />
          Duplicate Panel
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>Split Horizontal</MenuItem>
        <MenuItem onClick={handleMenuClose}>Split Vertical</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>Save Layout</MenuItem>
        <MenuItem onClick={handleMenuClose}>Reset Layout</MenuItem>
      </Menu>
    </StyledPanelContainer>
  );
};

// 메인 워크스페이스 레이아웃
interface WorkspaceLayoutProps {
  children?: React.ReactNode;
  defaultLayout?: LayoutPreset;
  onLayoutChange?: (layout: LayoutPreset) => void;
}

const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  children,
  defaultLayout,
  onLayoutChange
}) => {
  const [panels, setPanels] = useState<Panel[]>([
    { id: '1', type: 'nodeGraph', title: 'Node Graph' },
    { id: '2', type: 'viewer', title: 'Viewer1' },
    { id: '3', type: 'properties', title: 'Properties' },
    { id: '4', type: 'timeline', title: 'Timeline' },
  ]);

  const [activeTab, setActiveTab] = useState<{ [key: string]: number }>({});
  const allotmentRef = useRef<AllotmentHandle>(null);

  // 패널 액션 핸들러
  const handleClosePanel = useCallback((id: string) => {
    setPanels(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleMaximizePanel = useCallback((id: string) => {
    setPanels(prev => prev.map(p => 
      p.id === id ? { ...p, maximized: !p.maximized } : p
    ));
  }, []);

  const handleFloatPanel = useCallback((id: string) => {
    setPanels(prev => prev.map(p => 
      p.id === id ? { ...p, floating: !p.floating } : p
    ));
  }, []);

  const handleLockPanel = useCallback((id: string) => {
    setPanels(prev => prev.map(p => 
      p.id === id ? { ...p, locked: !p.locked } : p
    ));
  }, []);

  // 레이아웃 저장
  const saveLayout = useCallback(() => {
    const currentLayout: LayoutPreset = {
      id: `layout_${Date.now()}`,
      name: 'Custom Layout',
      panels: panels,
      orientation: 'horizontal'
    };
    
    localStorage.setItem('workspace_layout', JSON.stringify(currentLayout));
    onLayoutChange?.(currentLayout);
  }, [panels, onLayoutChange]);

  // 레이아웃 불러오기
  const loadLayout = useCallback((preset: LayoutPreset) => {
    setPanels(preset.panels);
  }, []);

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100vh',
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 메인 레이아웃 - Allotment 사용 */}
      <Allotment 
        ref={allotmentRef}
        defaultSizes={[300, 600, 300]}
      >
        {/* 왼쪽 패널 영역 */}
        <Allotment.Pane minSize={200} priority={LayoutPriority.Low}>
          <PanelComponent
            panel={panels.find(p => p.type === 'asset') || panels[0]}
            onClose={handleClosePanel}
            onMaximize={handleMaximizePanel}
            onFloat={handleFloatPanel}
            onLock={handleLockPanel}
          >
            {/* Asset Browser 컨텐츠 */}
            <Typography variant="body2">Asset Browser Content</Typography>
          </PanelComponent>
        </Allotment.Pane>

        {/* 중앙 영역 - 수직 분할 */}
        <Allotment.Pane>
          <Allotment vertical defaultSizes={[400, 200]}>
            {/* 상단: Viewer/Node Graph */}
            <Allotment.Pane minSize={200}>
              <Tabs 
                value={activeTab['center'] || 0}
                onChange={(e, v) => setActiveTab(prev => ({ ...prev, center: v }))}
                variant="scrollable"
                sx={{ minHeight: 32, borderBottom: 1, borderColor: 'divider' }}
              >
                <StyledTab label="Node Graph" />
                <StyledTab label="Viewer" />
                <StyledTab label="3D View" />
              </Tabs>
              <Box sx={{ height: 'calc(100% - 32px)' }}>
                {activeTab['center'] === 0 && (
                  <PanelComponent
                    panel={panels.find(p => p.type === 'nodeGraph')!}
                    onClose={handleClosePanel}
                    onMaximize={handleMaximizePanel}
                    onFloat={handleFloatPanel}
                    onLock={handleLockPanel}
                  >
                    <Typography variant="body2">Node Graph Content</Typography>
                  </PanelComponent>
                )}
                {activeTab['center'] === 1 && (
                  <PanelComponent
                    panel={panels.find(p => p.type === 'viewer')!}
                    onClose={handleClosePanel}
                    onMaximize={handleMaximizePanel}
                    onFloat={handleFloatPanel}
                    onLock={handleLockPanel}
                  >
                    <Typography variant="body2">Viewer Content</Typography>
                  </PanelComponent>
                )}
              </Box>
            </Allotment.Pane>

            {/* 하단: Timeline/Curve Editor */}
            <Allotment.Pane minSize={150}>
              <PanelComponent
                panel={panels.find(p => p.type === 'timeline')!}
                onClose={handleClosePanel}
                onMaximize={handleMaximizePanel}
                onFloat={handleFloatPanel}
                onLock={handleLockPanel}
              >
                <Typography variant="body2">Timeline Content</Typography>
              </PanelComponent>
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>

        {/* 오른쪽 패널 영역 */}
        <Allotment.Pane minSize={250} priority={LayoutPriority.Low}>
          <PanelComponent
            panel={panels.find(p => p.type === 'properties')!}
            onClose={handleClosePanel}
            onMaximize={handleMaximizePanel}
            onFloat={handleFloatPanel}
            onLock={handleLockPanel}
          >
            <Typography variant="body2">Properties Content</Typography>
          </PanelComponent>
        </Allotment.Pane>
      </Allotment>
    </Box>
  );
};

export default WorkspaceLayout;