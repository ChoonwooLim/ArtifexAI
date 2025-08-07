/**
 * AI Service - Handles AI model integration
 * Manages communication with Wan 2.2 T2V/I2V and other AI models
 */

import axios from 'axios';

const API_BASE_URL = process.env.AI_API_URL || 'http://localhost:5000/api';

export interface AIGenerationParams {
  model: 'wan2.2-t2v' | 'wan2.2-i2v' | 'stable-diffusion' | 'music-gen' | 'voice-gen';
  prompt?: string;
  image?: string | Blob;
  settings?: {
    resolution?: string;
    fps?: number;
    duration?: number;
    quality?: 'low' | 'medium' | 'high' | 'ultra';
    style?: string;
    seed?: number;
  };
}

export interface AIGenerationResult {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  output?: {
    url: string;
    format: string;
    duration?: number;
    resolution?: string;
  };
  error?: string;
}

class AIService {
  private apiKey: string | null = null;
  private activeJobs: Map<string, AIGenerationResult> = new Map();

  /**
   * Initialize AI service with API key
   */
  async initialize(apiKey?: string): Promise<void> {
    if (apiKey) {
      this.apiKey = apiKey;
    }
    
    // Test connection to AI server
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      if (response.data.status !== 'ok') {
        throw new Error('AI server is not healthy');
      }
    } catch (error) {
      console.error('Failed to connect to AI server:', error);
      throw new Error('AI server connection failed');
    }
  }

  /**
   * Generate video from text using Wan 2.2 T2V
   */
  async textToVideo(params: {
    prompt: string;
    resolution?: string;
    fps?: number;
    duration?: number;
    seed?: number;
  }): Promise<AIGenerationResult> {
    const formData = new FormData();
    formData.append('prompt', params.prompt);
    formData.append('resolution', params.resolution || '1280x720');
    formData.append('fps', String(params.fps || 24));
    formData.append('duration', String(params.duration || 5));
    if (params.seed) formData.append('seed', String(params.seed));

    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate/text-to-video`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(this.apiKey && { 'X-API-Key': this.apiKey }),
          },
        }
      );

      const result: AIGenerationResult = {
        id: response.data.job_id,
        status: 'queued',
        progress: 0,
      };

      this.activeJobs.set(result.id, result);
      this.pollJobStatus(result.id);

      return result;
    } catch (error) {
      console.error('Text to video generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate video from image using Wan 2.2 I2V
   */
  async imageToVideo(params: {
    image: string | Blob;
    prompt?: string;
    resolution?: string;
    fps?: number;
    duration?: number;
    motion_strength?: number;
  }): Promise<AIGenerationResult> {
    const formData = new FormData();
    
    if (typeof params.image === 'string') {
      // Convert base64 to blob if needed
      const response = await fetch(params.image);
      const blob = await response.blob();
      formData.append('image', blob, 'input.jpg');
    } else {
      formData.append('image', params.image, 'input.jpg');
    }
    
    if (params.prompt) formData.append('prompt', params.prompt);
    formData.append('resolution', params.resolution || '1280x720');
    formData.append('fps', String(params.fps || 24));
    formData.append('duration', String(params.duration || 5));
    formData.append('motion_strength', String(params.motion_strength || 0.5));

    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate/image-to-video`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(this.apiKey && { 'X-API-Key': this.apiKey }),
          },
        }
      );

      const result: AIGenerationResult = {
        id: response.data.job_id,
        status: 'queued',
        progress: 0,
      };

      this.activeJobs.set(result.id, result);
      this.pollJobStatus(result.id);

      return result;
    } catch (error) {
      console.error('Image to video generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate image using Stable Diffusion
   */
  async textToImage(params: {
    prompt: string;
    negative_prompt?: string;
    width?: number;
    height?: number;
    steps?: number;
    seed?: number;
  }): Promise<AIGenerationResult> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate/text-to-image`,
        params,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(this.apiKey && { 'X-API-Key': this.apiKey }),
          },
        }
      );

      const result: AIGenerationResult = {
        id: response.data.job_id,
        status: 'queued',
        progress: 0,
      };

      this.activeJobs.set(result.id, result);
      this.pollJobStatus(result.id);

      return result;
    } catch (error) {
      console.error('Text to image generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate music
   */
  async generateMusic(params: {
    prompt: string;
    duration?: number;
    genre?: string;
    tempo?: number;
  }): Promise<AIGenerationResult> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate/music`,
        params,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(this.apiKey && { 'X-API-Key': this.apiKey }),
          },
        }
      );

      const result: AIGenerationResult = {
        id: response.data.job_id,
        status: 'queued',
        progress: 0,
      };

      this.activeJobs.set(result.id, result);
      this.pollJobStatus(result.id);

      return result;
    } catch (error) {
      console.error('Music generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate voice/speech
   */
  async generateVoice(params: {
    text: string;
    voice?: string;
    language?: string;
    speed?: number;
  }): Promise<AIGenerationResult> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate/voice`,
        params,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(this.apiKey && { 'X-API-Key': this.apiKey }),
          },
        }
      );

      const result: AIGenerationResult = {
        id: response.data.job_id,
        status: 'queued',
        progress: 0,
      };

      this.activeJobs.set(result.id, result);
      this.pollJobStatus(result.id);

      return result;
    } catch (error) {
      console.error('Voice generation failed:', error);
      throw error;
    }
  }

  /**
   * Poll job status
   */
  private async pollJobStatus(jobId: string): Promise<void> {
    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/jobs/${jobId}`,
          {
            headers: {
              ...(this.apiKey && { 'X-API-Key': this.apiKey }),
            },
          }
        );

        const job = this.activeJobs.get(jobId);
        if (job) {
          job.status = response.data.status;
          job.progress = response.data.progress;
          
          if (response.data.status === 'completed') {
            job.output = response.data.output;
            clearInterval(pollInterval);
          } else if (response.data.status === 'failed') {
            job.error = response.data.error;
            clearInterval(pollInterval);
          }
        }
      } catch (error) {
        console.error('Failed to poll job status:', error);
        clearInterval(pollInterval);
      }
    }, 2000); // Poll every 2 seconds
  }

  /**
   * Get job status
   */
  getJobStatus(jobId: string): AIGenerationResult | undefined {
    return this.activeJobs.get(jobId);
  }

  /**
   * Cancel job
   */
  async cancelJob(jobId: string): Promise<void> {
    try {
      await axios.delete(
        `${API_BASE_URL}/jobs/${jobId}`,
        {
          headers: {
            ...(this.apiKey && { 'X-API-Key': this.apiKey }),
          },
        }
      );
      this.activeJobs.delete(jobId);
    } catch (error) {
      console.error('Failed to cancel job:', error);
      throw error;
    }
  }

  /**
   * Download generated content
   */
  async downloadOutput(jobId: string, outputPath: string): Promise<void> {
    const job = this.activeJobs.get(jobId);
    if (!job || !job.output) {
      throw new Error('Job not found or not completed');
    }

    try {
      const response = await axios.get(job.output.url, {
        responseType: 'blob',
      });

      // Save to file using Electron's file system APIs
      const blob = response.data;
      const buffer = await blob.arrayBuffer();
      
      // This would need to be implemented with Electron's fs module
      // For now, return the blob URL for browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = outputPath;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download output:', error);
      throw error;
    }
  }
}

export default new AIService();