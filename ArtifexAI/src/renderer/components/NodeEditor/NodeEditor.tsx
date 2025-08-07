/**
 * Artifex.AI - Node-Based Workflow Editor
 * Professional node graph editor similar to Nuke/Houdini
 */

import React, { useCallback, useRef, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  ConnectionMode,
  Panel,
  NodeTypes,
  EdgeTypes,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Box, Paper, IconButton, Menu, MenuItem, Tooltip, Chip } from '@mui/material';
import {
  Add,
  Search,
  Save,
  FolderOpen,
  PlayArrow,
  Stop,
  GridOn,
  ZoomIn,
  ZoomOut,
  CenterFocusStrong,
  Delete,
  ContentCopy,
  ContentPaste,
} from '@mui/icons-material';

import CustomNode from './nodes/CustomNode';
import InputNode from './nodes/InputNode';
import OutputNode from './nodes/OutputNode';
import ProcessNode from './nodes/ProcessNode';
import AIGeneratorNode from './nodes/AIGeneratorNode';
import CompositeNode from './nodes/CompositeNode';
import ColorCorrectionNode from './nodes/ColorCorrectionNode';
import AudioNode from './nodes/AudioNode';
import { useNodeLibrary } from './hooks/useNodeLibrary';
import { NodeProcessor } from './NodeProcessor';
import NodeContextMenu from './NodeContextMenu';
import NodePropertiesPanel from './NodePropertiesPanel';

// Custom node types
const nodeTypes: NodeTypes = {
  input: InputNode,
  output: OutputNode,
  process: ProcessNode,
  aiGenerator: AIGeneratorNode,
  composite: CompositeNode,
  colorCorrection: ColorCorrectionNode,
  audio: AudioNode,
  custom: CustomNode,
};

// Custom edge types
const edgeTypes: EdgeTypes = {
  default: {
    // Custom edge component if needed
  },
};

interface NodeEditorProps {
  projectId: string;
  onExecute?: (graph: any) => void;
}

const NodeEditor: React.FC<NodeEditorProps> = ({ projectId, onExecute }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    node?: Node;
  } | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [nodeMenu, setNodeMenu] = useState<{ x: number; y: number } | null>(null);

  const nodeLibrary = useNodeLibrary();
  const processor = useRef(new NodeProcessor());

  // Initialize with default nodes
  useEffect(() => {
    const initialNodes: Node[] = [
      {
        id: 'input-1',
        type: 'input',
        position: { x: 100, y: 200 },
        data: {
          label: 'Video Input',
          type: 'video',
          path: '',
        },
      },
      {
        id: 'ai-gen-1',
        type: 'aiGenerator',
        position: { x: 400, y: 100 },
        data: {
          label: 'Wan 2.2 T2V',
          model: 'wan2.2-t2v',
          prompt: '',
          settings: {
            resolution: '1280x720',
            fps: 24,
            duration: 5,
          },
        },
      },
      {
        id: 'composite-1',
        type: 'composite',
        position: { x: 700, y: 200 },
        data: {
          label: 'Composite',
          mode: 'over',
          opacity: 1.0,
        },
      },
      {
        id: 'color-1',
        type: 'colorCorrection',
        position: { x: 1000, y: 200 },
        data: {
          label: 'Color Correction',
          brightness: 0,
          contrast: 1,
          saturation: 1,
          hue: 0,
        },
      },
      {
        id: 'output-1',
        type: 'output',
        position: { x: 1300, y: 200 },
        data: {
          label: 'Output',
          format: 'mp4',
          quality: 'high',
        },
      },
    ];

    const initialEdges: Edge[] = [
      {
        id: 'e1-2',
        source: 'input-1',
        target: 'composite-1',
        sourceHandle: 'output',
        targetHandle: 'input1',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#0d7377', strokeWidth: 2 },
      },
      {
        id: 'e2-3',
        source: 'ai-gen-1',
        target: 'composite-1',
        sourceHandle: 'output',
        targetHandle: 'input2',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#0d7377', strokeWidth: 2 },
      },
      {
        id: 'e3-4',
        source: 'composite-1',
        target: 'color-1',
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'smoothstep',
        style: { stroke: '#666', strokeWidth: 2 },
      },
      {
        id: 'e4-5',
        source: 'color-1',
        target: 'output-1',
        sourceHandle: 'output',
        targetHandle: 'input',
        type: 'smoothstep',
        style: { stroke: '#666', strokeWidth: 2 },
      },
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

  // Connection handler
  const onConnect = useCallback(
    (params: any) => {
      const newEdge = {
        ...params,
        type: 'smoothstep',
        style: { stroke: '#666', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#666',
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Node selection handler
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Context menu handler
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        node,
      });
    },
    []
  );

  // Pane context menu (for adding nodes)
  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setNodeMenu({ x: event.clientX, y: event.clientY });
  }, []);

  // Add node handler
  const addNode = useCallback(
    (type: string, position?: { x: number; y: number }) => {
      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position: position || { x: 500, y: 300 },
        data: nodeLibrary.getNodeDefaults(type),
      };
      setNodes((nds) => [...nds, newNode]);
      setNodeMenu(null);
    },
    [nodeLibrary, setNodes]
  );

  // Delete selected nodes
  const deleteSelectedNodes = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          !nodes.find((n) => n.selected && (n.id === edge.source || n.id === edge.target))
      )
    );
  }, [nodes, setNodes, setEdges]);

  // Execute node graph
  const executeGraph = useCallback(async () => {
    setIsProcessing(true);
    try {
      const result = await processor.current.execute(nodes, edges);
      if (onExecute) {
        onExecute(result);
      }
    } catch (error) {
      console.error('Graph execution error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [nodes, edges, onExecute]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete') {
        deleteSelectedNodes();
      } else if (event.ctrlKey && event.key === 'c') {
        // Copy selected nodes
      } else if (event.ctrlKey && event.key === 'v') {
        // Paste nodes
      } else if (event.key === 'Tab') {
        event.preventDefault();
        setNodeMenu({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteSelectedNodes]);

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        ref={reactFlowWrapper}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-left"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
        }}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="#333"
        />
        <Controls />
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.type === 'input') return '#0d7377';
            if (n.type === 'output') return '#ff6b6b';
            if (n.type === 'aiGenerator') return '#4a90e2';
            return '#666';
          }}
          nodeColor={(n) => {
            if (n.type === 'input') return '#0d7377';
            if (n.type === 'output') return '#ff6b6b';
            if (n.type === 'aiGenerator') return '#4a90e2';
            return '#2d2d2d';
          }}
          pannable
          zoomable
        />

        {/* Top toolbar */}
        <Panel position="top-left">
          <Paper sx={{ p: 1, display: 'flex', gap: 1 }}>
            <Tooltip title="Add Node (Tab)">
              <IconButton
                size="small"
                onClick={() => setNodeMenu({ x: 400, y: 300 })}
              >
                <Add />
              </IconButton>
            </Tooltip>
            <Tooltip title="Execute Graph">
              <IconButton
                size="small"
                color={isProcessing ? 'error' : 'primary'}
                onClick={isProcessing ? undefined : executeGraph}
              >
                {isProcessing ? <Stop /> : <PlayArrow />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Save Graph">
              <IconButton size="small">
                <Save />
              </IconButton>
            </Tooltip>
            <Tooltip title="Load Graph">
              <IconButton size="small">
                <FolderOpen />
              </IconButton>
            </Tooltip>
          </Paper>
        </Panel>

        {/* Status panel */}
        <Panel position="top-right">
          <Paper sx={{ p: 1, minWidth: 200 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={isProcessing ? 'Processing...' : 'Ready'}
                color={isProcessing ? 'warning' : 'success'}
                size="small"
              />
              <Chip
                label={`Nodes: ${nodes.length}`}
                variant="outlined"
                size="small"
              />
              <Chip
                label={`Edges: ${edges.length}`}
                variant="outlined"
                size="small"
              />
            </Box>
          </Paper>
        </Panel>
      </ReactFlow>

      {/* Node menu */}
      {nodeMenu && (
        <NodeContextMenu
          position={nodeMenu}
          onClose={() => setNodeMenu(null)}
          onAddNode={(type) => {
            const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
            const position = project({
              x: nodeMenu.x - (reactFlowBounds?.left || 0),
              y: nodeMenu.y - (reactFlowBounds?.top || 0),
            });
            addNode(type, position);
          }}
        />
      )}

      {/* Context menu for existing nodes */}
      {contextMenu && (
        <Menu
          open={Boolean(contextMenu)}
          onClose={() => setContextMenu(null)}
          anchorReference="anchorPosition"
          anchorPosition={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <MenuItem onClick={() => {
            // Duplicate node
            if (contextMenu.node) {
              const newNode = {
                ...contextMenu.node,
                id: `${contextMenu.node.type}-${Date.now()}`,
                position: {
                  x: contextMenu.node.position.x + 50,
                  y: contextMenu.node.position.y + 50,
                },
              };
              setNodes((nds) => [...nds, newNode]);
            }
            setContextMenu(null);
          }}>
            Duplicate
          </MenuItem>
          <MenuItem onClick={() => {
            // Delete node
            if (contextMenu.node) {
              setNodes((nds) => nds.filter((n) => n.id !== contextMenu.node?.id));
              setEdges((eds) =>
                eds.filter(
                  (e) => e.source !== contextMenu.node?.id && e.target !== contextMenu.node?.id
                )
              );
            }
            setContextMenu(null);
          }}>
            Delete
          </MenuItem>
          <MenuItem onClick={() => {
            // Disconnect all
            if (contextMenu.node) {
              setEdges((eds) =>
                eds.filter(
                  (e) => e.source !== contextMenu.node?.id && e.target !== contextMenu.node?.id
                )
              );
            }
            setContextMenu(null);
          }}>
            Disconnect All
          </MenuItem>
        </Menu>
      )}

      {/* Properties panel */}
      {selectedNode && (
        <NodePropertiesPanel
          node={selectedNode}
          onUpdate={(updates) => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === selectedNode.id
                  ? { ...node, data: { ...node.data, ...updates } }
                  : node
              )
            );
          }}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </Box>
  );
};

// Wrap with ReactFlowProvider
const NodeEditorWithProvider: React.FC<NodeEditorProps> = (props) => {
  return (
    <ReactFlowProvider>
      <NodeEditor {...props} />
    </ReactFlowProvider>
  );
};

export default NodeEditorWithProvider;