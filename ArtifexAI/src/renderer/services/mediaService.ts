/**
 * Media Service - Handles media file import/export
 * Manages video, audio, and image file operations
 */

import { ipcRenderer } from 'electron';

export interface MediaFile {
  id: string;
  name: string;
  path: string;
  type: 'video' | 'audio' | 'image' | 'sequence';
  format: string;
  size: number;
  duration?: number;
  resolution?: { width: number; height: number };
  fps?: number;
  thumbnail?: string;
  metadata?: Record<string, any>;
}

export interface ExportOptions {
  format: 'mp4' | 'mov' | 'avi' | 'webm' | 'prores' | 'dnxhd';
  codec?: string;
  quality: 'low' | 'medium' | 'high' | 'ultra' | 'lossless';
  resolution?: string;
  fps?: number;
  bitrate?: string;
  audioCodec?: string;
  audioBitrate?: string;
}

class MediaService {
  private mediaFiles: Map<string, MediaFile> = new Map();
  private thumbnailCache: Map<string, string> = new Map();

  /**
   * Import media files
   */
  async importMedia(paths?: string[]): Promise<MediaFile[]> {
    try {
      // If no paths provided, open file dialog
      if (!paths) {
        const result = await window.electronAPI.openFileDialog({
          properties: ['openFile', 'multiSelections'],
          filters: [
            { name: 'Media Files', extensions: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'mp3', 'wav', 'aac', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'exr'] },
            { name: 'Video Files', extensions: ['mp4', 'mov', 'avi', 'mkv', 'webm'] },
            { name: 'Audio Files', extensions: ['mp3', 'wav', 'aac', 'flac', 'm4a'] },
            { name: 'Image Files', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'exr'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        });
        
        if (result.canceled || !result.filePaths) {
          return [];
        }
        
        paths = result.filePaths;
      }

      const importedFiles: MediaFile[] = [];

      for (const filePath of paths) {
        const fileInfo = await this.analyzeMediaFile(filePath);
        if (fileInfo) {
          this.mediaFiles.set(fileInfo.id, fileInfo);
          importedFiles.push(fileInfo);
          
          // Generate thumbnail for video/image files
          if (fileInfo.type === 'video' || fileInfo.type === 'image') {
            this.generateThumbnail(fileInfo);
          }
        }
      }

      return importedFiles;
    } catch (error) {
      console.error('Failed to import media:', error);
      throw error;
    }
  }

  /**
   * Analyze media file and extract metadata
   */
  private async analyzeMediaFile(filePath: string): Promise<MediaFile | null> {
    try {
      const stats = await window.electronAPI.getFileStats(filePath);
      const extension = filePath.split('.').pop()?.toLowerCase() || '';
      const fileName = filePath.split(/[\\/]/).pop() || '';
      
      // Determine media type
      let type: MediaFile['type'] = 'video';
      if (['mp3', 'wav', 'aac', 'flac', 'm4a'].includes(extension)) {
        type = 'audio';
      } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'exr'].includes(extension)) {
        type = 'image';
      }

      const mediaFile: MediaFile = {
        id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: fileName,
        path: filePath,
        type,
        format: extension,
        size: stats.size,
      };

      // Get detailed metadata using ffprobe or similar
      if (type === 'video' || type === 'audio') {
        const metadata = await window.electronAPI.getMediaMetadata(filePath);
        if (metadata) {
          mediaFile.duration = metadata.duration;
          mediaFile.fps = metadata.fps;
          if (metadata.width && metadata.height) {
            mediaFile.resolution = {
              width: metadata.width,
              height: metadata.height,
            };
          }
          mediaFile.metadata = metadata;
        }
      } else if (type === 'image') {
        const dimensions = await window.electronAPI.getImageDimensions(filePath);
        if (dimensions) {
          mediaFile.resolution = dimensions;
        }
      }

      return mediaFile;
    } catch (error) {
      console.error('Failed to analyze media file:', error);
      return null;
    }
  }

  /**
   * Generate thumbnail for media file
   */
  private async generateThumbnail(mediaFile: MediaFile): Promise<void> {
    try {
      let thumbnailData: string | null = null;

      if (mediaFile.type === 'video') {
        // Extract frame from video
        thumbnailData = await window.electronAPI.extractVideoFrame(
          mediaFile.path,
          mediaFile.duration ? mediaFile.duration / 2 : 0
        );
      } else if (mediaFile.type === 'image') {
        // Create thumbnail from image
        thumbnailData = await window.electronAPI.createImageThumbnail(
          mediaFile.path,
          { width: 320, height: 180 }
        );
      }

      if (thumbnailData) {
        mediaFile.thumbnail = thumbnailData;
        this.thumbnailCache.set(mediaFile.id, thumbnailData);
      }
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
    }
  }

  /**
   * Export project to video file
   */
  async exportVideo(
    timeline: any,
    outputPath: string,
    options: ExportOptions,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      // Prepare export configuration
      const exportConfig = {
        timeline,
        output: outputPath,
        format: options.format,
        codec: options.codec || this.getDefaultCodec(options.format),
        quality: options.quality,
        resolution: options.resolution || '1920x1080',
        fps: options.fps || 30,
        bitrate: options.bitrate || this.getDefaultBitrate(options.quality),
        audioCodec: options.audioCodec || 'aac',
        audioBitrate: options.audioBitrate || '192k',
      };

      // Start export process
      const exportId = await window.electronAPI.startExport(exportConfig);

      // Monitor progress
      return new Promise((resolve, reject) => {
        const progressInterval = setInterval(async () => {
          try {
            const status = await window.electronAPI.getExportStatus(exportId);
            
            if (status.progress && onProgress) {
              onProgress(status.progress);
            }

            if (status.status === 'completed') {
              clearInterval(progressInterval);
              resolve(status.outputPath);
            } else if (status.status === 'failed') {
              clearInterval(progressInterval);
              reject(new Error(status.error || 'Export failed'));
            }
          } catch (error) {
            clearInterval(progressInterval);
            reject(error);
          }
        }, 500);
      });
    } catch (error) {
      console.error('Failed to export video:', error);
      throw error;
    }
  }

  /**
   * Get default codec for format
   */
  private getDefaultCodec(format: string): string {
    const codecMap: Record<string, string> = {
      mp4: 'h264',
      mov: 'h264',
      webm: 'vp9',
      avi: 'xvid',
      prores: 'prores_ks',
      dnxhd: 'dnxhd',
    };
    return codecMap[format] || 'h264';
  }

  /**
   * Get default bitrate for quality
   */
  private getDefaultBitrate(quality: string): string {
    const bitrateMap: Record<string, string> = {
      low: '2M',
      medium: '5M',
      high: '10M',
      ultra: '20M',
      lossless: '50M',
    };
    return bitrateMap[quality] || '5M';
  }

  /**
   * Import image sequence
   */
  async importImageSequence(pattern: string, fps: number = 24): Promise<MediaFile> {
    try {
      const sequenceInfo = await window.electronAPI.analyzeImageSequence(pattern);
      
      const mediaFile: MediaFile = {
        id: `sequence-${Date.now()}`,
        name: `Image Sequence`,
        path: pattern,
        type: 'sequence',
        format: 'sequence',
        size: sequenceInfo.totalSize,
        duration: sequenceInfo.frameCount / fps,
        fps,
        resolution: sequenceInfo.resolution,
        metadata: {
          frameCount: sequenceInfo.frameCount,
          firstFrame: sequenceInfo.firstFrame,
          lastFrame: sequenceInfo.lastFrame,
        },
      };

      this.mediaFiles.set(mediaFile.id, mediaFile);
      return mediaFile;
    } catch (error) {
      console.error('Failed to import image sequence:', error);
      throw error;
    }
  }

  /**
   * Get all imported media files
   */
  getMediaFiles(): MediaFile[] {
    return Array.from(this.mediaFiles.values());
  }

  /**
   * Get media file by ID
   */
  getMediaFile(id: string): MediaFile | undefined {
    return this.mediaFiles.get(id);
  }

  /**
   * Remove media file
   */
  removeMediaFile(id: string): void {
    this.mediaFiles.delete(id);
    this.thumbnailCache.delete(id);
  }

  /**
   * Clear all media files
   */
  clearMediaFiles(): void {
    this.mediaFiles.clear();
    this.thumbnailCache.clear();
  }

  /**
   * Get supported formats
   */
  getSupportedFormats(): {
    import: string[];
    export: string[];
  } {
    return {
      import: [
        'mp4', 'mov', 'avi', 'mkv', 'webm',
        'mp3', 'wav', 'aac', 'flac', 'm4a',
        'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'exr',
      ],
      export: ['mp4', 'mov', 'avi', 'webm', 'prores', 'dnxhd'],
    };
  }

  /**
   * Transcode media file
   */
  async transcodeMedia(
    inputPath: string,
    outputPath: string,
    options: Partial<ExportOptions>
  ): Promise<string> {
    try {
      const transcodeConfig = {
        input: inputPath,
        output: outputPath,
        ...options,
      };

      return await window.electronAPI.transcodeMedia(transcodeConfig);
    } catch (error) {
      console.error('Failed to transcode media:', error);
      throw error;
    }
  }
}

export default new MediaService();