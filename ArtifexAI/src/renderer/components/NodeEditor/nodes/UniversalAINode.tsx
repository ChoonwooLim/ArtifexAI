/**
 * Universal AI Node - Integrates best-in-class AI models
 */

import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Paper, Typography, Select, MenuItem, Chip, Grid, IconButton, LinearProgress, Tabs, Tab } from '@mui/material';
import { 
  AutoAwesome,
  VideoCall,
  Image,
  MusicNote,
  RecordVoiceOver,
  Description,
  Face,
  Animation,
  TrendingUp,
  Api,
  Cloud,
  Speed,
  AttachMoney,
  CheckCircle,
  Warning
} from '@mui/icons-material';

interface UniversalAINodeData {
  label: string;
  mode: 'video' | 'image' | 'audio' | 'text' | 'voice' | 'avatar' | 'enhance';
  
  // Video Generation
  videoProviders: {
    runway_gen3: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    pika_labs: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    luma_dream: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    kling: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    moonvalley: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    haiper: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    stability_video: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    cogvideo: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
  };
  
  // Image Generation
  imageProviders: {
    midjourney: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    dalle3: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    sdxl: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    flux_pro: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    leonardo: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    ideogram: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
  };
  
  // Audio/Music Generation
  audioProviders: {
    suno: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    udio: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    musicgen: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    audiocraft: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    riffusion: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
  };
  
  // Voice Synthesis
  voiceProviders: {
    elevenlabs: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    playht: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    murf: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    resemble: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    descript: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
  };
  
  // Text/Script Generation
  textProviders: {
    claude3_opus: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    gpt4_turbo: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    gemini_ultra: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    llama3_405b: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
  };
  
  // Avatar & Motion
  avatarProviders: {
    heygen: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    d_id: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    synthesia: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    wonder_dynamics: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    deepmotion: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    move_ai: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
  };
  
  // Enhancement
  enhanceProviders: {
    topaz: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    realesrgan: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    flowframes: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
    deoldify: { enabled: boolean; priority: number; status: 'ready' | 'processing' | 'error'; };
  };
  
  // Current Task
  currentTask: {
    prompt: string;
    negative_prompt?: string;
    style?: string;
    duration?: number;
    resolution?: string;
    quality?: 'draft' | 'standard' | 'high' | 'ultra';
    provider?: string;
    status: 'idle' | 'processing' | 'completed' | 'error';
    progress: number;
    result?: {
      url?: string;
      urls?: string[];
      cost: number;
      time: number;
      provider: string;
    };
  };
  
  // Settings
  settings: {
    autoSelectBest: boolean;
    fallbackEnabled: boolean;
    parallelProcessing: boolean;
    maxRetries: number;
    costLimit: number;
    qualityPriority: 'speed' | 'quality' | 'cost' | 'balanced';
    cacheResults: boolean;
  };
  
  // Metrics
  metrics: {
    totalRequests: number;
    successRate: number;
    averageTime: number;
    totalCost: number;
    providerUsage: Record<string, number>;
  };
}

const UniversalAINode: React.FC<NodeProps<UniversalAINodeData>> = ({ data, selected }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showProviders, setShowProviders] = useState(false);

  const getModeIcon = () => {
    switch (data.mode) {
      case 'video': return <VideoCall sx={{ fontSize: 16 }} />;
      case 'image': return <Image sx={{ fontSize: 16 }} />;
      case 'audio': return <MusicNote sx={{ fontSize: 16 }} />;
      case 'text': return <Description sx={{ fontSize: 16 }} />;
      case 'voice': return <RecordVoiceOver sx={{ fontSize: 16 }} />;
      case 'avatar': return <Face sx={{ fontSize: 16 }} />;
      case 'enhance': return <TrendingUp sx={{ fontSize: 16 }} />;
      default: return <AutoAwesome sx={{ fontSize: 16 }} />;
    }
  };

  const getProviderList = () => {
    switch (data.mode) {
      case 'video': return data.videoProviders;
      case 'image': return data.imageProviders;
      case 'audio': return data.audioProviders;
      case 'voice': return data.voiceProviders;
      case 'text': return data.textProviders;
      case 'avatar': return data.avatarProviders;
      case 'enhance': return data.enhanceProviders;
      default: return {};
    }
  };

  const getProviderDisplayName = (key: string) => {
    const names: Record<string, string> = {
      'runway_gen3': 'Runway Gen-3',
      'pika_labs': 'Pika Labs',
      'luma_dream': 'Luma Dream Machine',
      'kling': 'KLING',
      'moonvalley': 'Moonvalley',
      'haiper': 'Haiper',
      'stability_video': 'Stable Video',
      'cogvideo': 'CogVideoX',
      'midjourney': 'Midjourney v6',
      'dalle3': 'DALL-E 3',
      'sdxl': 'Stable Diffusion XL',
      'flux_pro': 'FLUX.1 Pro',
      'leonardo': 'Leonardo.AI',
      'ideogram': 'Ideogram',
      'suno': 'Suno AI v3.5',
      'udio': 'Udio',
      'musicgen': 'MusicGen',
      'audiocraft': 'AudioCraft',
      'elevenlabs': 'ElevenLabs',
      'playht': 'Play.ht',
      'claude3_opus': 'Claude 3 Opus',
      'gpt4_turbo': 'GPT-4 Turbo',
      'gemini_ultra': 'Gemini Ultra',
      'llama3_405b': 'Llama 3 405B',
      'heygen': 'HeyGen',
      'd_id': 'D-ID',
      'synthesia': 'Synthesia',
      'wonder_dynamics': 'Wonder Dynamics',
      'topaz': 'Topaz Video AI',
      'realesrgan': 'Real-ESRGAN'
    };
    return names[key] || key;
  };

  const getProviderStatus = (provider: any) => {
    if (provider.status === 'processing') return <Speed sx={{ fontSize: 12, color: '#ff9800' }} />;
    if (provider.status === 'error') return <Warning sx={{ fontSize: 12, color: '#f44336' }} />;
    if (provider.enabled) return <CheckCircle sx={{ fontSize: 12, color: '#4caf50' }} />;
    return null;
  };

  const getQualityColor = () => {
    switch (data.settings?.qualityPriority) {
      case 'speed': return '#ff9800';
      case 'quality': return '#4caf50';
      case 'cost': return '#2196f3';
      default: return '#9c27b0';
    }
  };

  return (
    <Paper
      sx={{
        p: 1.5,
        minWidth: 340,
        bgcolor: selected ? '#6a1b9a' : '#2d2d2d',
        border: selected ? '2px solid #8e24aa' : '1px solid #4a148c',
        borderRadius: 2,
        background: selected
          ? 'linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%)'
          : 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
      }}
      elevation={selected ? 8 : 2}
    >
      {/* Input handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="prompt"
        style={{
          background: '#8e24aa',
          width: 12,
          height: 12,
          top: '20%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="image"
        style={{
          background: '#4caf50',
          width: 10,
          height: 10,
          top: '35%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="audio"
        style={{
          background: '#ff9800',
          width: 10,
          height: 10,
          top: '50%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="video"
        style={{
          background: '#2196f3',
          width: 10,
          height: 10,
          top: '65%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="config"
        style={{
          background: '#e91e63',
          width: 10,
          height: 10,
          top: '80%',
        }}
      />

      {/* Node header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <AutoAwesome sx={{ fontSize: 18, color: '#8e24aa' }} />
        <Typography variant="subtitle2" fontWeight={600}>
          {data.label || 'Universal AI'}
        </Typography>
        <Box sx={{ flex: 1 }} />
        {getModeIcon()}
        <IconButton size="small" sx={{ p: 0.5 }} onClick={() => setShowProviders(!showProviders)}>
          <Api sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      {/* Mode selection */}
      <Select
        value={data.mode}
        size="small"
        fullWidth
        sx={{
          fontSize: 11,
          height: 28,
          mb: 1,
          '& .MuiSelect-select': {
            py: 0.5,
          },
        }}
      >
        <MenuItem value="video" sx={{ fontSize: 11 }}>🎬 Video Generation</MenuItem>
        <MenuItem value="image" sx={{ fontSize: 11 }}>🖼️ Image Generation</MenuItem>
        <MenuItem value="audio" sx={{ fontSize: 11 }}>🎵 Music/Audio</MenuItem>
        <MenuItem value="text" sx={{ fontSize: 11 }}>📝 Script/Text</MenuItem>
        <MenuItem value="voice" sx={{ fontSize: 11 }}>🎙️ Voice Synthesis</MenuItem>
        <MenuItem value="avatar" sx={{ fontSize: 11 }}>👤 Avatar/Motion</MenuItem>
        <MenuItem value="enhance" sx={{ fontSize: 11 }}>✨ Enhancement</MenuItem>
      </Select>

      {/* Current task status */}
      {data.currentTask?.status !== 'idle' && (
        <Box sx={{ mb: 1, p: 1, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0', display: 'block' }}>
            {data.currentTask.prompt?.substring(0, 50)}...
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <LinearProgress
              variant="determinate"
              value={data.currentTask.progress || 0}
              sx={{ flex: 1, height: 3, borderRadius: 1 }}
            />
            <Typography variant="caption" sx={{ fontSize: 9 }}>
              {data.currentTask.progress || 0}%
            </Typography>
          </Box>
          {data.currentTask.provider && (
            <Chip
              label={getProviderDisplayName(data.currentTask.provider)}
              size="small"
              sx={{ fontSize: 9, height: 16, mt: 0.5 }}
            />
          )}
        </Box>
      )}

      {/* Tabs for different views */}
      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        variant="fullWidth"
        sx={{
          minHeight: 24,
          mb: 1,
          '& .MuiTab-root': {
            minHeight: 24,
            fontSize: 10,
            p: 0.5,
          },
        }}
      >
        <Tab label="Providers" />
        <Tab label="Settings" />
        <Tab label="Metrics" />
      </Tabs>

      {/* Tab content */}
      <Box sx={{ minHeight: 100 }}>
        {activeTab === 0 && (
          // Providers list
          <Box>
            <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
              Active Providers ({Object.values(getProviderList()).filter((p: any) => p.enabled).length})
            </Typography>
            <Grid container spacing={0.3} sx={{ mt: 0.5 }}>
              {Object.entries(getProviderList()).slice(0, 6).map(([key, provider]: [string, any]) => (
                <Grid item xs={6} key={key}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      p: 0.5,
                      bgcolor: provider.enabled ? 'rgba(76,175,80,0.1)' : 'transparent',
                      borderRadius: 0.5,
                      border: '1px solid',
                      borderColor: provider.enabled ? '#4caf50' : '#333',
                    }}
                  >
                    {getProviderStatus(provider)}
                    <Typography variant="caption" sx={{ fontSize: 9, flex: 1 }}>
                      {getProviderDisplayName(key)}
                    </Typography>
                    {provider.priority && (
                      <Chip
                        label={`P${provider.priority}`}
                        size="small"
                        sx={{ fontSize: 8, height: 14 }}
                      />
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
            {showProviders && (
              <Box sx={{ mt: 1 }}>
                <Chip
                  label="+ Configure Providers"
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: 9, height: 18 }}
                />
              </Box>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          // Settings
          <Box>
            <Grid container spacing={0.5}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="caption" sx={{ fontSize: 9 }}>
                    Quality:
                  </Typography>
                  <Chip
                    label={data.settings?.qualityPriority}
                    size="small"
                    sx={{
                      fontSize: 8,
                      height: 14,
                      bgcolor: getQualityColor(),
                      color: '#fff',
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AttachMoney sx={{ fontSize: 10, color: '#b0b0b0' }} />
                  <Typography variant="caption" sx={{ fontSize: 9 }}>
                    Limit: ${data.settings?.costLimit || 100}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 1 }}>
              <Grid container spacing={0.3}>
                {data.settings?.autoSelectBest && (
                  <Grid item>
                    <Chip label="Auto-Select" size="small" color="primary" sx={{ fontSize: 8, height: 14 }} />
                  </Grid>
                )}
                {data.settings?.fallbackEnabled && (
                  <Grid item>
                    <Chip label="Fallback" size="small" sx={{ fontSize: 8, height: 14 }} />
                  </Grid>
                )}
                {data.settings?.parallelProcessing && (
                  <Grid item>
                    <Chip label="Parallel" size="small" sx={{ fontSize: 8, height: 14 }} />
                  </Grid>
                )}
                {data.settings?.cacheResults && (
                  <Grid item>
                    <Chip label="Cache" size="small" sx={{ fontSize: 8, height: 14 }} />
                  </Grid>
                )}
              </Grid>
            </Box>
            
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" sx={{ fontSize: 9, color: '#b0b0b0' }}>
                Max Retries: {data.settings?.maxRetries || 3}
              </Typography>
            </Box>
          </Box>
        )}

        {activeTab === 2 && (
          // Metrics
          <Box>
            <Grid container spacing={0.5}>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontSize: 9, color: '#b0b0b0' }}>
                  Total Requests
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                  {data.metrics?.totalRequests || 0}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontSize: 9, color: '#b0b0b0' }}>
                  Success Rate
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600, color: '#4caf50' }}>
                  {data.metrics?.successRate || 0}%
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontSize: 9, color: '#b0b0b0' }}>
                  Avg Time
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                  {(data.metrics?.averageTime || 0).toFixed(1)}s
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontSize: 9, color: '#b0b0b0' }}>
                  Total Cost
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600, color: '#ff9800' }}>
                  ${(data.metrics?.totalCost || 0).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
            
            {data.metrics?.providerUsage && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ fontSize: 9, color: '#b0b0b0' }}>
                  Top Providers
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {Object.entries(data.metrics.providerUsage)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([provider, count]) => (
                      <Box key={provider} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ fontSize: 9 }}>
                          {getProviderDisplayName(provider)}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: 9 }}>
                          {count}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Result preview */}
      {data.currentTask?.result && (
        <Box sx={{ mt: 1, p: 0.5, bgcolor: 'rgba(76,175,80,0.1)', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontSize: 9, color: '#4caf50' }}>
              ✓ Completed
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Chip
                label={data.currentTask.result.provider}
                size="small"
                sx={{ fontSize: 8, height: 14 }}
              />
              <Chip
                label={`$${data.currentTask.result.cost.toFixed(3)}`}
                size="small"
                sx={{ fontSize: 8, height: 14 }}
              />
              <Chip
                label={`${data.currentTask.result.time}s`}
                size="small"
                sx={{ fontSize: 8, height: 14 }}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* API Status indicator */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Cloud sx={{ fontSize: 12, color: '#b0b0b0' }} />
          <Typography variant="caption" sx={{ fontSize: 9, color: '#b0b0b0' }}>
            API Status
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.25 }}>
          {[...Array(5)].map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: i < 3 ? '#4caf50' : '#333',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Output handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="result"
        style={{
          background: '#8e24aa',
          width: 12,
          height: 12,
          top: '20%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="video_out"
        style={{
          background: '#2196f3',
          width: 10,
          height: 10,
          top: '35%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="image_out"
        style={{
          background: '#4caf50',
          width: 10,
          height: 10,
          top: '50%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="audio_out"
        style={{
          background: '#ff9800',
          width: 10,
          height: 10,
          top: '65%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="metadata"
        style={{
          background: '#e91e63',
          width: 10,
          height: 10,
          top: '80%',
        }}
      />
    </Paper>
  );
};

export default memo(UniversalAINode);