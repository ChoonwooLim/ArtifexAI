const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Menu actions
  onMenuAction: (callback) => ipcRenderer.on('menu-action', callback),
  removeMenuActionListener: (callback) => ipcRenderer.removeListener('menu-action', callback),
  
  // File system operations
  openFile: () => ipcRenderer.invoke('open-file'),
  saveFile: (data) => ipcRenderer.invoke('save-file', data),
  
  // Application info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Window controls
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
  
  // AI service communication
  connectAI: () => ipcRenderer.invoke('connect-ai'),
  disconnectAI: () => ipcRenderer.invoke('disconnect-ai'),
  generateVideo: (params) => ipcRenderer.invoke('generate-video', params),
});