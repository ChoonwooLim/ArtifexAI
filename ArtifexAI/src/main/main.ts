/**
 * Artifex.AI - Electron Main Process
 */

import { app, BrowserWindow, Menu, ipcMain, dialog, shell } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';

// Enable GPU acceleration
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Create a simple HTML splash screen
  const splashHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #0A0A0F 0%, #151521 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .logo {
          text-align: center;
          animation: fadeIn 1s ease-out;
        }
        .logo h1 {
          font-size: 48px;
          font-weight: 800;
          background: linear-gradient(135deg, #7C3AED 0%, #00D9FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }
        .logo p {
          color: rgba(255, 255, 255, 0.6);
          margin-top: 10px;
          font-size: 14px;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      </style>
    </head>
    <body>
      <div class="logo">
        <h1>Artifex.AI</h1>
        <p>Professional AI Video Production Suite</p>
      </div>
    </body>
    </html>
  `;

  splashWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(splashHTML)}`);
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1280,
    minHeight: 720,
    frame: true,  // 표준 Windows 프레임 활성화
    titleBarStyle: 'default',  // 기본 타이틀바 사용
    title: 'Artifex.AI - Professional AI Video Production Suite',
    backgroundColor: '#0A0A0F',
    show: false,
    icon: path.join(__dirname, '../../assets/icon.png'), // 아이콘 추가
    autoHideMenuBar: false,  // 메뉴바 항상 표시
    menuBarVisible: true,  // 메뉴바 가시성
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: !isDev,
      devTools: isDev,  // 개발 모드에서만 DevTools 허용
    },
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3456');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      if (splashWindow) {
        splashWindow.close();
        splashWindow = null;
      }
      mainWindow?.show();
    }, 1500);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create app menu
function createMenu() {
  const template: any[] = [
    ...(isMac ? [{
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'new-project');
          }
        },
        {
          label: 'Open Project',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'open-project');
          }
        },
        {
          label: 'Save Project',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'save-project');
          }
        },
        { type: 'separator' },
        {
          label: 'Import Media',
          accelerator: 'CmdOrCtrl+I',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'import-media');
          }
        },
        {
          label: 'Export Video',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'export-video');
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
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
        { role: 'selectAll' }
      ]
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
        { type: 'separator' },
        {
          label: 'Always on Top',
          type: 'checkbox',
          click: () => {
            const isAlwaysOnTop = mainWindow?.isAlwaysOnTop();
            mainWindow?.setAlwaysOnTop(!isAlwaysOnTop);
          }
        }
      ]
    },
    {
      label: 'AI Studio',
      submenu: [
        {
          label: 'Generate Video from Text',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'generate-t2v');
          }
        },
        {
          label: 'Generate Video from Image',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'generate-i2v');
          }
        },
        { type: 'separator' },
        {
          label: 'Generate Music',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'generate-music');
          }
        },
        {
          label: 'Generate Voice',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'generate-voice');
          }
        },
        {
          label: 'Generate Sound Effects',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'generate-sfx');
          }
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'maximize' },
        { role: 'close' },
        { type: 'separator' },
        {
          label: 'Center Window',
          click: () => {
            mainWindow?.center();
          }
        },
        {
          label: 'Reset Window Size',
          click: () => {
            mainWindow?.setSize(1920, 1080);
            mainWindow?.center();
          }
        },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [])
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://artifex-ai.docs.com');
          }
        },
        {
          label: 'Report Issue',
          click: () => {
            shell.openExternal('https://github.com/artifex-ai/issues');
          }
        },
        { type: 'separator' },
        {
          label: 'About Artifex.AI',
          click: () => {
            dialog.showMessageBox(mainWindow!, {
              type: 'info',
              title: 'About Artifex.AI',
              message: 'Artifex.AI Professional Suite',
              detail: 'Version 2.0.0\n\nThe world\'s most advanced AI-powered video production suite.\n\n© 2024 Artifex.AI',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(() => {
  createSplashWindow();
  createMainWindow();
  createMenu();
  
  // Set application name
  app.setName('Artifex.AI');
});

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// IPC handlers
ipcMain.handle('app:version', () => {
  return app.getVersion();
});

ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: [
      { name: 'Video Files', extensions: ['mp4', 'avi', 'mov', 'mkv'] },
      { name: 'Image Files', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] },
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'flac', 'aac'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  return result;
});

ipcMain.handle('dialog:saveFile', async () => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    filters: [
      { name: 'Video Files', extensions: ['mp4', 'avi', 'mov'] },
      { name: 'Project Files', extensions: ['artifex'] }
    ]
  });
  return result;
});