/**
 * Project Service - Handles project save/load operations
 * Manages .artifex project files and autosave functionality
 */

import { Node, Edge } from 'reactflow';

export interface ArtifexProject {
  id: string;
  name: string;
  version: string;
  created: string;
  modified: string;
  metadata: {
    description?: string;
    author?: string;
    tags?: string[];
    duration?: number;
    resolution?: string;
    fps?: number;
  };
  nodeGraph: {
    nodes: Node[];
    edges: Edge[];
  };
  timeline: {
    tracks: any[];
    clips: any[];
    markers: any[];
  };
  media: {
    files: any[];
    references: Record<string, string>;
  };
  preview: {
    quality: string;
    resolution: string;
    cache: any[];
  };
  settings: {
    autoSave: boolean;
    autoSaveInterval: number;
    backupCount: number;
    renderSettings: any;
  };
}

class ProjectService {
  private currentProject: ArtifexProject | null = null;
  private projectPath: string | null = null;
  private autoSaveInterval: number | null = null;
  private isDirty: boolean = false;

  /**
   * Create new project
   */
  async createNewProject(
    name: string = 'Untitled Project',
    template?: Partial<ArtifexProject>
  ): Promise<ArtifexProject> {
    const project: ArtifexProject = {
      id: `proj-${Date.now()}`,
      name,
      version: '1.0.0',
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      metadata: {
        description: '',
        author: '',
        tags: [],
        duration: 300,
        resolution: '1920x1080',
        fps: 30,
        ...template?.metadata,
      },
      nodeGraph: {
        nodes: [],
        edges: [],
        ...template?.nodeGraph,
      },
      timeline: {
        tracks: [],
        clips: [],
        markers: [],
        ...template?.timeline,
      },
      media: {
        files: [],
        references: {},
        ...template?.media,
      },
      preview: {
        quality: 'high',
        resolution: '1920x1080',
        cache: [],
        ...template?.preview,
      },
      settings: {
        autoSave: true,
        autoSaveInterval: 300000, // 5 minutes
        backupCount: 5,
        renderSettings: {
          quality: 'high',
          codec: 'h264',
          bitrate: '10M',
        },
        ...template?.settings,
      },
    };

    this.currentProject = project;
    this.isDirty = true;
    this.startAutoSave();

    return project;
  }

  /**
   * Save project to file
   */
  async saveProject(filePath?: string): Promise<string> {
    if (!this.currentProject) {
      throw new Error('No project to save');
    }

    // If no path provided, open save dialog
    if (!filePath && !this.projectPath) {
      const result = await window.electronAPI.showSaveDialog({
        title: 'Save Artifex.AI Project',
        defaultPath: `${this.currentProject.name}.artifex`,
        filters: [
          { name: 'Artifex.AI Project', extensions: ['artifex'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      });

      if (result.canceled || !result.filePath) {
        throw new Error('Save cancelled');
      }

      filePath = result.filePath;
    }

    const targetPath = filePath || this.projectPath;
    if (!targetPath) {
      throw new Error('No file path specified');
    }

    // Update modified timestamp
    this.currentProject.modified = new Date().toISOString();

    // Create project data with relative paths
    const projectData = await this.createProjectData();

    // Write to file
    await window.electronAPI.writeFile(targetPath, JSON.stringify(projectData, null, 2));

    this.projectPath = targetPath;
    this.isDirty = false;

    return targetPath;
  }

  /**
   * Save project as (force save dialog)
   */
  async saveProjectAs(): Promise<string> {
    const result = await window.electronAPI.showSaveDialog({
      title: 'Save Artifex.AI Project As',
      defaultPath: `${this.currentProject?.name || 'Untitled'}.artifex`,
      filters: [
        { name: 'Artifex.AI Project', extensions: ['artifex'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (result.canceled || !result.filePath) {
      throw new Error('Save cancelled');
    }

    return this.saveProject(result.filePath);
  }

  /**
   * Load project from file
   */
  async loadProject(filePath?: string): Promise<ArtifexProject> {
    // If no path provided, open file dialog
    if (!filePath) {
      const result = await window.electronAPI.showOpenDialog({
        title: 'Open Artifex.AI Project',
        filters: [
          { name: 'Artifex.AI Project', extensions: ['artifex'] },
          { name: 'All Files', extensions: ['*'] },
        ],
        properties: ['openFile'],
      });

      if (result.canceled || !result.filePaths?.length) {
        throw new Error('Load cancelled');
      }

      filePath = result.filePaths[0];
    }

    if (!filePath) {
      throw new Error('No file path specified');
    }

    // Read project file
    const fileContent = await window.electronAPI.readFile(filePath);
    const projectData: ArtifexProject = JSON.parse(fileContent);

    // Resolve relative paths
    await this.resolveProjectPaths(projectData, filePath);

    // Validate project structure
    this.validateProject(projectData);

    this.currentProject = projectData;
    this.projectPath = filePath;
    this.isDirty = false;

    this.startAutoSave();

    return projectData;
  }

  /**
   * Create project data with relative paths
   */
  private async createProjectData(): Promise<ArtifexProject> {
    if (!this.currentProject || !this.projectPath) {
      return this.currentProject!;
    }

    const projectDir = await window.electronAPI.dirname(this.projectPath);
    const projectData = JSON.parse(JSON.stringify(this.currentProject));

    // Convert absolute paths to relative
    projectData.media.files = await Promise.all(
      projectData.media.files.map(async (file: any) => {
        if (file.path && await window.electronAPI.isAbsolutePath(file.path)) {
          const relativePath = await window.electronAPI.relative(projectDir, file.path);
          return { ...file, path: relativePath };
        }
        return file;
      })
    );

    return projectData;
  }

  /**
   * Resolve relative paths to absolute
   */
  private async resolveProjectPaths(project: ArtifexProject, projectPath: string): Promise<void> {
    const projectDir = await window.electronAPI.dirname(projectPath);

    // Resolve media file paths
    project.media.files = await Promise.all(
      project.media.files.map(async (file: any) => {
        if (file.path && !await window.electronAPI.isAbsolutePath(file.path)) {
          const absolutePath = await window.electronAPI.resolve(projectDir, file.path);
          return { ...file, path: absolutePath };
        }
        return file;
      })
    );
  }

  /**
   * Validate project structure
   */
  private validateProject(project: ArtifexProject): void {
    if (!project.id || !project.name || !project.version) {
      throw new Error('Invalid project file: missing required fields');
    }

    if (!project.nodeGraph) {
      project.nodeGraph = { nodes: [], edges: [] };
    }

    if (!project.timeline) {
      project.timeline = { tracks: [], clips: [], markers: [] };
    }

    if (!project.media) {
      project.media = { files: [], references: {} };
    }
  }

  /**
   * Auto-save functionality
   */
  private startAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    if (!this.currentProject?.settings.autoSave) {
      return;
    }

    this.autoSaveInterval = window.setInterval(async () => {
      if (this.isDirty && this.projectPath) {
        try {
          await this.autoSave();
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    }, this.currentProject.settings.autoSaveInterval);
  }

  /**
   * Auto-save to backup file
   */
  private async autoSave(): Promise<void> {
    if (!this.currentProject || !this.projectPath) return;

    const backupPath = `${this.projectPath}.backup`;
    await this.saveProject(backupPath);
    console.log('Auto-saved to:', backupPath);
  }

  /**
   * Export project data for store updates
   */
  updateProjectData(updates: Partial<ArtifexProject>): void {
    if (!this.currentProject) return;

    this.currentProject = {
      ...this.currentProject,
      ...updates,
      modified: new Date().toISOString(),
    };
    
    this.isDirty = true;
  }

  /**
   * Get current project
   */
  getCurrentProject(): ArtifexProject | null {
    return this.currentProject;
  }

  /**
   * Get project path
   */
  getCurrentProjectPath(): string | null {
    return this.projectPath;
  }

  /**
   * Check if project has unsaved changes
   */
  isDirtyProject(): boolean {
    return this.isDirty;
  }

  /**
   * Create project backup
   */
  async createBackup(): Promise<string> {
    if (!this.currentProject || !this.projectPath) {
      throw new Error('No project to backup');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${this.projectPath}.backup-${timestamp}`;
    
    await this.saveProject(backupPath);
    return backupPath;
  }

  /**
   * Export project to different format
   */
  async exportProject(format: 'json' | 'xml' | 'csv'): Promise<string> {
    if (!this.currentProject) {
      throw new Error('No project to export');
    }

    const result = await window.electronAPI.showSaveDialog({
      title: 'Export Project',
      defaultPath: `${this.currentProject.name}.${format}`,
      filters: [
        { name: format.toUpperCase(), extensions: [format] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (result.canceled || !result.filePath) {
      throw new Error('Export cancelled');
    }

    let exportData: string;
    
    switch (format) {
      case 'json':
        exportData = JSON.stringify(this.currentProject, null, 2);
        break;
      case 'xml':
        exportData = this.projectToXML(this.currentProject);
        break;
      case 'csv':
        exportData = this.projectToCSV(this.currentProject);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

    await window.electronAPI.writeFile(result.filePath, exportData);
    return result.filePath;
  }

  /**
   * Convert project to XML
   */
  private projectToXML(project: ArtifexProject): string {
    // Simple XML conversion - would need proper XML library in production
    return `<?xml version="1.0" encoding="UTF-8"?>
<project>
  <id>${project.id}</id>
  <name>${project.name}</name>
  <version>${project.version}</version>
  <created>${project.created}</created>
  <modified>${project.modified}</modified>
  <!-- Additional XML structure would go here -->
</project>`;
  }

  /**
   * Convert project to CSV
   */
  private projectToCSV(project: ArtifexProject): string {
    // Simple CSV export for project metadata
    const rows = [
      ['Property', 'Value'],
      ['ID', project.id],
      ['Name', project.name],
      ['Version', project.version],
      ['Created', project.created],
      ['Modified', project.modified],
      ['Node Count', project.nodeGraph.nodes.length.toString()],
      ['Edge Count', project.nodeGraph.edges.length.toString()],
      ['Track Count', project.timeline.tracks.length.toString()],
      ['Clip Count', project.timeline.clips.length.toString()],
      ['Media Files', project.media.files.length.toString()],
    ];

    return rows.map(row => row.join(',')).join('\n');
  }

  /**
   * Close current project
   */
  async closeProject(): Promise<boolean> {
    if (this.isDirty) {
      const result = await window.electronAPI.showMessageBox({
        type: 'warning',
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Do you want to save before closing?',
        buttons: ['Save', "Don't Save", 'Cancel'],
        defaultId: 0,
        cancelId: 2,
      });

      if (result.response === 2) {
        return false; // Cancelled
      }

      if (result.response === 0) {
        await this.saveProject();
      }
    }

    // Clear auto-save
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }

    this.currentProject = null;
    this.projectPath = null;
    this.isDirty = false;

    return true;
  }
}

export default new ProjectService();