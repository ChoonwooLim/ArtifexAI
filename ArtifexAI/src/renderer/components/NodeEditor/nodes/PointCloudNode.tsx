/**
 * Point Cloud Processing Node - For LiDAR, photogrammetry, and volumetric data
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Paper, Typography, Chip, LinearProgress, Grid, IconButton } from '@mui/material';
import { 
  ScatterPlot,
  CloudQueue,
  FilterAlt,
  Compress,
  Timeline,
  CropFree,
  Layers,
  AutoFixHigh,
  Gradient,
  ViewInAr
} from '@mui/icons-material';

interface PointCloudNodeData {
  label: string;
  source: 'lidar' | 'photogrammetry' | 'depth_camera' | 'nerf' | 'gaussian_splatting';
  format: 'ply' | 'pcd' | 'las' | 'laz' | 'e57' | 'xyz' | 'pts';
  statistics: {
    pointCount: number;
    bounds: {
      min: [number, number, number];
      max: [number, number, number];
    };
    density: number;
    hasColors: boolean;
    hasNormals: boolean;
    hasIntensity: boolean;
    hasClassification: boolean;
  };
  processing: {
    downsampling: {
      enabled: boolean;
      method: 'random' | 'uniform' | 'voxel' | 'poisson';
      targetPoints: number;
      voxelSize?: number;
    };
    filtering: {
      outlierRemoval: boolean;
      radiusOutlier: { radius: number; minNeighbors: number };
      statisticalOutlier: { meanK: number; stdDev: number };
      passThroughFilter: { axis: string; min: number; max: number };
    };
    normals: {
      compute: boolean;
      searchRadius: number;
      flipViewpoint: boolean;
      orient: boolean;
    };
    meshing: {
      enabled: boolean;
      algorithm: 'poisson' | 'ball_pivoting' | 'alpha_shapes' | 'marching_cubes';
      depth: number;
      scale: number;
    };
    segmentation: {
      enabled: boolean;
      method: 'euclidean' | 'region_growing' | 'ransac' | 'semantic';
      minClusterSize: number;
      maxClusterSize: number;
    };
  };
  visualization: {
    pointSize: number;
    colorMode: 'rgb' | 'intensity' | 'height' | 'classification' | 'normal';
    colorMap: string;
    opacity: number;
    lod: boolean;
  };
  gaussianSplatting?: {
    splats: number;
    shDegree: number;
    opacity: number;
    scale: number;
  };
  nerf?: {
    resolution: number;
    samples: number;
    bounds: number[];
  };
}

const PointCloudNode: React.FC<NodeProps<PointCloudNodeData>> = ({ data, selected }) => {
  const getSourceIcon = () => {
    switch (data.source) {
      case 'lidar': return <Timeline sx={{ fontSize: 16 }} />;
      case 'photogrammetry': return <ViewInAr sx={{ fontSize: 16 }} />;
      case 'gaussian_splatting': return <ScatterPlot sx={{ fontSize: 16 }} />;
      case 'nerf': return <Gradient sx={{ fontSize: 16 }} />;
      default: return <CloudQueue sx={{ fontSize: 16 }} />;
    }
  };

  const formatPointCount = (count: number) => {
    if (count < 1000) return count.toString();
    if (count < 1000000) return (count / 1000).toFixed(1) + 'K';
    if (count < 1000000000) return (count / 1000000).toFixed(1) + 'M';
    return (count / 1000000000).toFixed(1) + 'B';
  };

  const getColorModeColor = () => {
    const colors: Record<string, string> = {
      'rgb': '#4caf50',
      'intensity': '#ff9800',
      'height': '#2196f3',
      'classification': '#9c27b0',
      'normal': '#e91e63'
    };
    return colors[data.visualization?.colorMode || 'rgb'] || '#666';
  };

  return (
    <Paper
      sx={{
        p: 1.5,
        minWidth: 280,
        bgcolor: selected ? '#00838f' : '#2d2d2d',
        border: selected ? '2px solid #00acc1' : '1px solid #006064',
        borderRadius: 2,
        background: selected
          ? 'linear-gradient(135deg, #00838f 0%, #006064 100%)'
          : 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
      }}
      elevation={selected ? 8 : 2}
    >
      {/* Input handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="points"
        style={{
          background: '#00acc1',
          width: 12,
          height: 12,
          top: '20%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="depth"
        style={{
          background: '#2196f3',
          width: 10,
          height: 10,
          top: '40%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="color"
        style={{
          background: '#4caf50',
          width: 10,
          height: 10,
          top: '60%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="mask"
        style={{
          background: '#fff',
          width: 10,
          height: 10,
          top: '80%',
        }}
      />

      {/* Node header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {getSourceIcon()}
        <Typography variant="subtitle2" fontWeight={600}>
          {data.label || 'Point Cloud'}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <IconButton size="small" sx={{ p: 0.5 }}>
          <AutoFixHigh sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      {/* Source and format */}
      <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
        <Chip
          label={data.source}
          size="small"
          color="primary"
          sx={{ fontSize: 10 }}
        />
        <Chip
          label={data.format?.toUpperCase()}
          size="small"
          variant="outlined"
          sx={{ fontSize: 10 }}
        />
      </Box>

      {/* Statistics */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ScatterPlot sx={{ fontSize: 12, color: '#b0b0b0' }} />
          <Typography variant="caption" sx={{ fontSize: 10 }}>
            {formatPointCount(data.statistics?.pointCount || 0)} points
          </Typography>
          <Chip
            label={`${data.statistics?.density || 0} pts/m³`}
            size="small"
            sx={{ fontSize: 9, height: 16 }}
          />
        </Box>
        
        {/* Data attributes */}
        <Box sx={{ display: 'flex', gap: 0.3, mt: 0.5 }}>
          {data.statistics?.hasColors && (
            <Chip label="RGB" size="small" sx={{ fontSize: 9, height: 16 }} />
          )}
          {data.statistics?.hasNormals && (
            <Chip label="Normals" size="small" sx={{ fontSize: 9, height: 16 }} />
          )}
          {data.statistics?.hasIntensity && (
            <Chip label="Intensity" size="small" sx={{ fontSize: 9, height: 16 }} />
          )}
          {data.statistics?.hasClassification && (
            <Chip label="Class" size="small" sx={{ fontSize: 9, height: 16 }} />
          )}
        </Box>
      </Box>

      {/* Processing status */}
      {data.processing?.downsampling?.enabled && (
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Compress sx={{ fontSize: 12, color: '#b0b0b0' }} />
            <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
              Downsampling: {data.processing.downsampling.method}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={
              ((data.processing.downsampling.targetPoints || 0) / 
              (data.statistics?.pointCount || 1)) * 100
            }
            sx={{ height: 2, borderRadius: 1, mt: 0.5 }}
          />
        </Box>
      )}

      {/* Active filters */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
          Processing Pipeline
        </Typography>
        <Grid container spacing={0.3} sx={{ mt: 0.5 }}>
          {data.processing?.filtering?.outlierRemoval && (
            <Grid item>
              <Chip
                icon={<FilterAlt sx={{ fontSize: 10 }} />}
                label="Outlier"
                size="small"
                sx={{ fontSize: 9, height: 18 }}
              />
            </Grid>
          )}
          {data.processing?.normals?.compute && (
            <Grid item>
              <Chip
                label="Normals"
                size="small"
                sx={{ fontSize: 9, height: 18 }}
              />
            </Grid>
          )}
          {data.processing?.meshing?.enabled && (
            <Grid item>
              <Chip
                icon={<Layers sx={{ fontSize: 10 }} />}
                label={data.processing.meshing.algorithm}
                size="small"
                sx={{ fontSize: 9, height: 18 }}
              />
            </Grid>
          )}
          {data.processing?.segmentation?.enabled && (
            <Grid item>
              <Chip
                label="Segment"
                size="small"
                sx={{ fontSize: 9, height: 18 }}
              />
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Gaussian Splatting specific */}
      {data.source === 'gaussian_splatting' && data.gaussianSplatting && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
            Gaussian Splatting
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.3, mt: 0.5 }}>
            <Chip
              label={`${formatPointCount(data.gaussianSplatting.splats)} splats`}
              size="small"
              sx={{ fontSize: 9, height: 16 }}
            />
            <Chip
              label={`SH ${data.gaussianSplatting.shDegree}`}
              size="small"
              sx={{ fontSize: 9, height: 16 }}
            />
          </Box>
        </Box>
      )}

      {/* NeRF specific */}
      {data.source === 'nerf' && data.nerf && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
            NeRF Volume
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.3, mt: 0.5 }}>
            <Chip
              label={`${data.nerf.resolution}³`}
              size="small"
              sx={{ fontSize: 9, height: 16 }}
            />
            <Chip
              label={`${data.nerf.samples} samples`}
              size="small"
              sx={{ fontSize: 9, height: 16 }}
            />
          </Box>
        </Box>
      )}

      {/* Visualization settings */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ fontSize: 10, color: '#b0b0b0' }}>
          Viz: {data.visualization?.colorMode}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.3 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: getColorModeColor(),
            }}
          />
          {data.visualization?.lod && (
            <Chip label="LOD" size="small" sx={{ fontSize: 9, height: 16 }} />
          )}
        </Box>
      </Box>

      {/* Output handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="points_out"
        style={{
          background: '#00acc1',
          width: 12,
          height: 12,
          top: '20%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="mesh"
        style={{
          background: '#7e57c2',
          width: 10,
          height: 10,
          top: '35%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="clusters"
        style={{
          background: '#ff9800',
          width: 10,
          height: 10,
          top: '50%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="normals_out"
        style={{
          background: '#4caf50',
          width: 10,
          height: 10,
          top: '65%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="volume"
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

export default memo(PointCloudNode);