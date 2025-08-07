import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Menu actions
  onMenuAction: (callback: (event: any, action: string) => void) => 
    ipcRenderer.on('menu-action', callback),
  removeMenuActionListener: (callback: (event: any, action: string) => void) => 
    ipcRenderer.removeListener('menu-action', callback),
  
  // Window management
  createPanelWindow: (panelType: string) => ipcRenderer.invoke('create-panel-window', panelType),
  closePanelWindow: (windowId: string) => ipcRenderer.invoke('close-panel-window', windowId),
  dockWindow: (windowId: string, targetId?: string) => ipcRenderer.invoke('dock-window', windowId, targetId),
  getAllWindows: () => ipcRenderer.invoke('get-all-windows'),
  
  // Window updates
  onWindowUpdated: (callback: (event: any, windowData: any) => void) =>
    ipcRenderer.on('window-updated', callback),
  removeWindowUpdatedListener: (callback: (event: any, windowData: any) => void) =>
    ipcRenderer.removeListener('window-updated', callback),
  
  // Workspace layout
  saveWorkspaceLayout: (layoutName: string) => ipcRenderer.invoke('save-workspace-layout', layoutName),
  loadWorkspaceLayout: (layoutName: string) => ipcRenderer.invoke('load-workspace-layout', layoutName),
  
  // File system operations
  openFile: () => ipcRenderer.invoke('open-file'),
  saveFile: (data: any) => ipcRenderer.invoke('save-file', data),
  
  // Application info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Window controls
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
  
  // AI service communication
  connectAI: () => ipcRenderer.invoke('connect-ai'),
  disconnectAI: () => ipcRenderer.invoke('disconnect-ai'),
  generateVideo: (params: any) => ipcRenderer.invoke('generate-video', params),
});