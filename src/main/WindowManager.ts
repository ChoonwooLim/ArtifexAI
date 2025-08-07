import { BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';

export interface PanelWindow {
  id: string;
  type: 'nodeGraph' | 'viewer' | 'properties' | 'timeline' | 'asset' | 'main';
  window: BrowserWindow;
  isDocked: boolean;
  dockedTo?: string;
  originalBounds?: Electron.Rectangle;
}

export class WindowManager {
  public windows: Map<string, PanelWindow> = new Map(); // public으로 변경
  private isDevelopment = process.env.NODE_ENV === 'development';

  constructor() {
    this.setupIPC();
  }

  private setupIPC() {
    // 새 패널 창 생성 요청
    ipcMain.handle('create-panel-window', async (event, panelType: string) => {
      return await this.createPanelWindow(panelType);
    });

    // 창 도킹/언도킹
    ipcMain.handle('dock-window', async (event, windowId: string, targetId?: string) => {
      return this.dockWindow(windowId, targetId);
    });

    // 창 닫기
    ipcMain.handle('close-panel-window', async (event, windowId: string) => {
      return this.closePanelWindow(windowId);
    });

    // 모든 창 정보 가져오기
    ipcMain.handle('get-all-windows', async () => {
      return Array.from(this.windows.entries()).map(([id, panel]) => ({
        id,
        type: panel.type,
        bounds: panel.window.getBounds(),
        isDocked: panel.isDocked,
        dockedTo: panel.dockedTo,
      }));
    });

    // 워크스페이스 레이아웃 저장
    ipcMain.handle('save-workspace-layout', async (event, layoutName: string) => {
      return this.saveWorkspaceLayout(layoutName);
    });

    // 워크스페이스 레이아웃 불러오기
    ipcMain.handle('load-workspace-layout', async (event, layoutName: string) => {
      return this.loadWorkspaceLayout(layoutName);
    });
  }

  // 메인 창 생성
  createMainWindow(): BrowserWindow {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    const mainWindow = new BrowserWindow({
      width: Math.min(1400, width - 100),
      height: Math.min(900, height - 100),
      minWidth: 800,
      minHeight: 600,
      show: false,
      frame: true, // Windows 표준 프레임 사용
      titleBarStyle: 'default',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: !this.isDevelopment,
      },
    });

    // 메인 창 등록
    this.windows.set('main', {
      id: 'main',
      type: 'main',
      window: mainWindow,
      isDocked: true,
    });

    // 메인 창 로드
    if (this.isDevelopment) {
      mainWindow.loadURL('http://localhost:3000?window=main');
      mainWindow.webContents.openDevTools();
    } else {
      mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'), {
        query: { window: 'main' }
      });
    }

    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });

    mainWindow.on('closed', () => {
      this.windows.delete('main');
      // 메인 창이 닫히면 모든 패널 창도 닫기
      this.closeAllPanelWindows();
    });

    return mainWindow;
  }

  // 패널 창 생성
  async createPanelWindow(panelType: string): Promise<string> {
    const windowId = `${panelType}_${Date.now()}`;
    const displays = screen.getAllDisplays();
    const primaryDisplay = displays[0];

    // 패널별 기본 크기 설정
    const defaultSizes = {
      nodeGraph: { width: 800, height: 600 },
      viewer: { width: 640, height: 480 },
      properties: { width: 320, height: 600 },
      timeline: { width: 800, height: 200 },
      asset: { width: 300, height: 500 },
    };

    const size = defaultSizes[panelType as keyof typeof defaultSizes] || { width: 400, height: 300 };

    const panelWindow = new BrowserWindow({
      width: size.width,
      height: size.height,
      minWidth: 250,
      minHeight: 150,
      show: false,
      frame: true, // Windows 표준 프레임
      titleBarStyle: 'default',
      parent: this.windows.get('main')?.window, // 메인 창의 자식 창으로 설정
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: !this.isDevelopment,
      },
    });

    // 창 제목 설정
    const titles = {
      nodeGraph: 'Node Graph',
      viewer: 'Viewer',
      properties: 'Properties',
      timeline: 'Timeline',
      asset: 'Asset Browser',
    };
    
    panelWindow.setTitle(titles[panelType as keyof typeof titles] || panelType);

    // 패널 창 등록
    this.windows.set(windowId, {
      id: windowId,
      type: panelType as any,
      window: panelWindow,
      isDocked: false,
    });

    // 패널 창 로드
    if (this.isDevelopment) {
      panelWindow.loadURL(`http://localhost:3000?window=${panelType}&id=${windowId}`);
    } else {
      panelWindow.loadFile(path.join(__dirname, '../renderer/index.html'), {
        query: { window: panelType, id: windowId }
      });
    }

    panelWindow.once('ready-to-show', () => {
      panelWindow.show();
      
      // 메인 창 근처에 위치시키기
      const mainWindow = this.windows.get('main')?.window;
      if (mainWindow) {
        const mainBounds = mainWindow.getBounds();
        panelWindow.setPosition(
          mainBounds.x + 50,
          mainBounds.y + 50
        );
      }
    });

    // 창이 닫힐 때 등록 해제
    panelWindow.on('closed', () => {
      this.windows.delete(windowId);
    });

    // 창 이동/크기 변경 시 다른 창들에 알림
    panelWindow.on('moved', () => {
      this.broadcastWindowUpdate(windowId);
    });

    panelWindow.on('resized', () => {
      this.broadcastWindowUpdate(windowId);
    });

    return windowId;
  }

  // 창 도킹/언도킹 (간소화된 버전)
  dockWindow(windowId: string, targetId?: string): boolean {
    const panel = this.windows.get(windowId);
    if (!panel) return false;

    if (panel.isDocked) {
      // 언도킹: 독립적인 창으로 만들기
      panel.isDocked = false;
      panel.dockedTo = undefined;
      
      if (panel.originalBounds) {
        panel.window.setBounds(panel.originalBounds);
      }
    } else {
      // 도킹: 플래그만 설정 (실제 도킹은 UI에서 처리)
      panel.originalBounds = panel.window.getBounds();
      panel.isDocked = true;
      panel.dockedTo = targetId || 'main';
      
      // 메인 창 근처로 이동
      const mainWindow = this.windows.get('main')?.window;
      if (mainWindow) {
        const mainBounds = mainWindow.getBounds();
        panel.window.setPosition(
          mainBounds.x + 10,
          mainBounds.y + 10
        );
      }
    }

    this.broadcastWindowUpdate(windowId);
    return true;
  }

  // 패널 창 닫기
  closePanelWindow(windowId: string): boolean {
    const panel = this.windows.get(windowId);
    if (!panel) return false;

    panel.window.close();
    return true;
  }

  // 모든 패널 창 닫기
  closeAllPanelWindows(): void {
    for (const [id, panel] of this.windows) {
      if (panel.type !== 'main') {
        panel.window.close();
      }
    }
  }

  // 창 업데이트를 모든 창에 브로드캐스트
  private broadcastWindowUpdate(windowId: string): void {
    const panel = this.windows.get(windowId);
    if (!panel) return;

    const updateData = {
      id: windowId,
      type: panel.type,
      bounds: panel.window.getBounds(),
      isDocked: panel.isDocked,
      dockedTo: panel.dockedTo,
    };

    // 모든 창에 업데이트 알림
    for (const [id, p] of this.windows) {
      p.window.webContents.send('window-updated', updateData);
    }
  }

  // 워크스페이스 레이아웃 저장
  private saveWorkspaceLayout(layoutName: string): boolean {
    try {
      const layout = {
        name: layoutName,
        created: new Date().toISOString(),
        windows: Array.from(this.windows.entries()).map(([id, panel]) => ({
          id,
          type: panel.type,
          bounds: panel.window.getBounds(),
          isDocked: panel.isDocked,
          dockedTo: panel.dockedTo,
        }))
      };

      // 로컬 스토리지나 파일에 저장 (간단히 로그로 출력)
      console.log('Workspace Layout Saved:', layout);
      return true;
    } catch (error) {
      console.error('Failed to save workspace layout:', error);
      return false;
    }
  }

  // 워크스페이스 레이아웃 불러오기
  private loadWorkspaceLayout(layoutName: string): boolean {
    try {
      // 실제로는 파일이나 데이터베이스에서 로드
      console.log('Loading workspace layout:', layoutName);
      return true;
    } catch (error) {
      console.error('Failed to load workspace layout:', error);
      return false;
    }
  }

  // 멀티 모니터 지원을 위한 디스플레이 정보 가져오기
  getDisplays() {
    return screen.getAllDisplays().map(display => ({
      id: display.id,
      bounds: display.bounds,
      workArea: display.workArea,
      scaleFactor: display.scaleFactor,
      isPrimary: display === screen.getPrimaryDisplay(),
    }));
  }
}