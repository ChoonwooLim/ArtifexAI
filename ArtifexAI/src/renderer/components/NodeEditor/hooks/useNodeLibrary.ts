import { useMemo } from 'react';

export interface NodeDefinition {
  type: string;
  category: string;
  label: string;
  description: string;
  defaultData: any;
}

export const useNodeLibrary = () => {
  const nodeDefinitions = useMemo<NodeDefinition[]>(() => [
    // Input/Output
    {
      type: 'input',
      category: 'IO',
      label: 'Input',
      description: 'Media input node',
      defaultData: {
        label: 'Input',
        type: 'video',
        path: '',
      },
    },
    {
      type: 'output',
      category: 'IO',
      label: 'Output',
      description: 'Export node',
      defaultData: {
        label: 'Output',
        format: 'mp4',
        quality: 'high',
      },
    },
    // AI Generation
    {
      type: 'aiGenerator',
      category: 'AI',
      label: 'AI Generator',
      description: 'AI content generation',
      defaultData: {
        label: 'AI Generator',
        model: 't2v',
        prompt: '',
        status: 'ready',
      },
    },
    {
      type: 'universalAI',
      category: 'AI',
      label: 'Universal AI',
      description: 'Multi-modal AI processing',
      defaultData: {
        label: 'Universal AI',
        mode: 'auto',
      },
    },
    // Processing
    {
      type: 'process',
      category: 'Process',
      label: 'Process',
      description: 'Generic processing node',
      defaultData: {
        label: 'Process',
        processType: 'blur',
        intensity: 50,
      },
    },
    {
      type: 'composite',
      category: 'Process',
      label: 'Composite',
      description: 'Layer compositing',
      defaultData: {
        label: 'Composite',
        mode: 'over',
        opacity: 1.0,
      },
    },
    {
      type: 'colorCorrection',
      category: 'Process',
      label: 'Color Correction',
      description: 'Color grading and correction',
      defaultData: {
        label: 'Color Correction',
        brightness: 0,
        contrast: 1,
        saturation: 1,
        hue: 0,
        gamma: 1,
      },
    },
    {
      type: 'colorSuite',
      category: 'Process',
      label: 'Color Suite',
      description: 'Advanced color grading',
      defaultData: {
        label: 'Color Suite',
        lut: 'none',
      },
    },
    // Audio
    {
      type: 'audio',
      category: 'Audio',
      label: 'Audio',
      description: 'Audio processing',
      defaultData: {
        label: 'Audio',
        volume: 1.0,
        mode: 'stereo',
      },
    },
    {
      type: 'audioMixer',
      category: 'Audio',
      label: 'Audio Mixer',
      description: 'Multi-channel audio mixing',
      defaultData: {
        label: 'Audio Mixer',
        channels: [],
      },
    },
    // 3D
    {
      type: 'model3D',
      category: '3D',
      label: '3D Model',
      description: '3D model import and manipulation',
      defaultData: {
        label: '3D Model',
        modelPath: '',
      },
    },
    {
      type: 'render3D',
      category: '3D',
      label: '3D Render',
      description: '3D rendering engine',
      defaultData: {
        label: '3D Render',
        renderer: 'webgl',
      },
    },
    {
      type: 'pointCloud',
      category: '3D',
      label: 'Point Cloud',
      description: 'Point cloud processing',
      defaultData: {
        label: 'Point Cloud',
        density: 1.0,
      },
    },
    // Effects
    {
      type: 'anamorphic',
      category: 'Effects',
      label: 'Anamorphic',
      description: 'Anamorphic lens effects',
      defaultData: {
        label: 'Anamorphic',
        squeeze: 2.0,
      },
    },
    {
      type: 'stereoConversion',
      category: 'Effects',
      label: 'Stereo 3D',
      description: 'Stereoscopic 3D conversion',
      defaultData: {
        label: 'Stereo 3D',
        depth: 1.0,
      },
    },
    // Advanced
    {
      type: 'interactive',
      category: 'Advanced',
      label: 'Interactive',
      description: 'Interactive elements',
      defaultData: {
        label: 'Interactive',
        triggers: [],
      },
    },
    {
      type: 'mediaFacade',
      category: 'Advanced',
      label: 'Media Facade',
      description: 'Media facade mapping',
      defaultData: {
        label: 'Media Facade',
        mapping: [],
      },
    },
    {
      type: 'projectionMapping',
      category: 'Advanced',
      label: 'Projection Mapping',
      description: 'Projection mapping tools',
      defaultData: {
        label: 'Projection Mapping',
        surfaces: [],
      },
    },
  ], []);

  const getNodeDefaults = (type: string) => {
    const definition = nodeDefinitions.find((def) => def.type === type);
    return definition?.defaultData || { label: type };
  };

  const getNodesByCategory = () => {
    const categories: Record<string, NodeDefinition[]> = {};
    nodeDefinitions.forEach((def) => {
      if (!categories[def.category]) {
        categories[def.category] = [];
      }
      categories[def.category].push(def);
    });
    return categories;
  };

  return {
    nodeDefinitions,
    getNodeDefaults,
    getNodesByCategory,
  };
};