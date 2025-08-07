import { app, BrowserWindow, Menu, shell } from 'electron';
import * as path from 'path';
import { WindowManager } from './WindowManager';

const isDevelopment = process.env.NODE_ENV === 'development';
let windowManager: WindowManager | null = null;

const createWindow = (): void => {
  // WindowManager를 사용하여 메인 창 생성
  windowManager = new WindowManager();
  const mainWindow = windowManager.createMainWindow();

  // GPU acceleration
  app.commandLine.appendSwitch('enable-gpu-rasterization');
  app.commandLine.appendSwitch('enable-zero-copy');
  app.commandLine.appendSwitch('ignore-gpu-blocklist');
  app.commandLine.appendSwitch('enable-hardware-acceleration');

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
};

// Application event handlers
app.whenReady().then(() => {
  createWindow();

  // macOS specific behavior
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent navigation to external URLs
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (navigationEvent, url) => {
    const parsedUrl = new URL(url);
    
    if (parsedUrl.origin !== 'http://localhost:3000' && parsedUrl.origin !== 'file://') {
      navigationEvent.preventDefault();
    }
  });
});

// Menu template
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Project',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          windowManager?.windows.get('main')?.window.webContents.send('menu-action', 'new-project');
        },
      },
      {
        label: 'Open Project...',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
          windowManager?.windows.get('main')?.window.webContents.send('menu-action', 'open-project');
        },
      },
      { type: 'separator' },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: () => {
          windowManager?.windows.get('main')?.window.webContents.send('menu-action', 'save');
        },
      },
      { type: 'separator' },
      {
        role: 'quit',
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
    ],
  },
  {
    label: 'Workspace',
    submenu: [
      {
        label: 'New Panel',
        submenu: [
          {
            label: 'Node Graph',
            click: () => windowManager?.createPanelWindow('nodeGraph'),
          },
          {
            label: 'Viewer',
            click: () => windowManager?.createPanelWindow('viewer'),
          },
          {
            label: 'Properties',
            click: () => windowManager?.createPanelWindow('properties'),
          },
          {
            label: 'Timeline',
            click: () => windowManager?.createPanelWindow('timeline'),
          },
          {
            label: 'Asset Browser',
            click: () => windowManager?.createPanelWindow('asset'),
          },
        ],
      },
      { type: 'separator' },
      {
        label: 'Save Layout...',
        click: () => {
          // 레이아웃 저장 다이얼로그 표시
          windowManager?.windows.get('main')?.window.webContents.send('menu-action', 'save-layout');
        },
      },
      {
        label: 'Load Layout...',
        click: () => {
          // 레이아웃 불러오기 다이얼로그 표시
          windowManager?.windows.get('main')?.window.webContents.send('menu-action', 'load-layout');
        },
      },
      { type: 'separator' },
      {
        label: 'Default Layout',
        click: () => {
          // 기본 레이아웃으로 복원
          windowManager?.createPanelWindow('nodeGraph');
          windowManager?.createPanelWindow('viewer');
          windowManager?.createPanelWindow('properties');
          windowManager?.createPanelWindow('timeline');
        },
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' },
      { type: 'separator' },
      {
        label: 'Bring All to Front',
        role: 'front',
      },
    ],
  },
];

// Set application menu
Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate as any));