/**
 * Node Graph Processor
 * Handles execution and data flow between nodes
 */

import { Node, Edge } from 'reactflow';

export interface ProcessingResult {
  nodeId: string;
  output: any;
  error?: string;
}

export class NodeProcessor {
  private nodes: Map<string, Node> = new Map();
  private edges: Edge[] = [];
  private outputs: Map<string, any> = new Map();
  private executionOrder: string[] = [];

  /**
   * Execute the node graph
   */
  async execute(nodes: Node[], edges: Edge[]): Promise<Map<string, any>> {
    this.nodes.clear();
    this.outputs.clear();
    
    // Build node map
    nodes.forEach(node => this.nodes.set(node.id, node));
    this.edges = edges;
    
    // Calculate execution order (topological sort)
    this.executionOrder = this.topologicalSort(nodes, edges);
    
    // Execute nodes in order
    for (const nodeId of this.executionOrder) {
      const node = this.nodes.get(nodeId);
      if (!node) continue;
      
      try {
        const inputs = this.getNodeInputs(nodeId);
        const output = await this.processNode(node, inputs);
        this.outputs.set(nodeId, output);
      } catch (error) {
        console.error(`Error processing node ${nodeId}:`, error);
        this.outputs.set(nodeId, { error: error.message });
      }
    }
    
    return this.outputs;
  }

  /**
   * Topological sort for determining execution order
   */
  private topologicalSort(nodes: Node[], edges: Edge[]): string[] {
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    
    // Initialize
    nodes.forEach(node => {
      graph.set(node.id, []);
      inDegree.set(node.id, 0);
    });
    
    // Build graph
    edges.forEach(edge => {
      const sourceList = graph.get(edge.source) || [];
      sourceList.push(edge.target);
      graph.set(edge.source, sourceList);
      
      const targetDegree = inDegree.get(edge.target) || 0;
      inDegree.set(edge.target, targetDegree + 1);
    });
    
    // Find nodes with no dependencies
    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) queue.push(nodeId);
    });
    
    const result: string[] = [];
    
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      result.push(nodeId);
      
      const neighbors = graph.get(nodeId) || [];
      neighbors.forEach(neighbor => {
        const degree = inDegree.get(neighbor)! - 1;
        inDegree.set(neighbor, degree);
        if (degree === 0) queue.push(neighbor);
      });
    }
    
    return result;
  }

  /**
   * Get inputs for a node from connected nodes
   */
  private getNodeInputs(nodeId: string): Map<string, any> {
    const inputs = new Map<string, any>();
    
    // Find edges where this node is the target
    const incomingEdges = this.edges.filter(edge => edge.target === nodeId);
    
    incomingEdges.forEach(edge => {
      const sourceOutput = this.outputs.get(edge.source);
      if (sourceOutput) {
        const handle = edge.targetHandle || 'input';
        inputs.set(handle, sourceOutput);
      }
    });
    
    return inputs;
  }

  /**
   * Process a single node
   */
  private async processNode(node: Node, inputs: Map<string, any>): Promise<any> {
    const { type, data } = node;
    
    switch (type) {
      case 'input':
        return this.processInputNode(data);
      
      case 'output':
        return this.processOutputNode(data, inputs);
      
      case 'aiGenerator':
        return this.processAIGeneratorNode(data, inputs);
      
      case 'composite':
        return this.processCompositeNode(data, inputs);
      
      case 'colorCorrection':
        return this.processColorCorrectionNode(data, inputs);
      
      case 'audio':
        return this.processAudioNode(data, inputs);
      
      default:
        return { type, data, inputs: Object.fromEntries(inputs) };
    }
  }

  private async processInputNode(data: any): Promise<any> {
    return {
      type: 'media',
      path: data.path || null,
      mediaType: data.type || 'video',
      metadata: data.metadata || {},
    };
  }

  private async processOutputNode(data: any, inputs: Map<string, any>): Promise<any> {
    const input = inputs.get('input');
    return {
      type: 'output',
      format: data.format || 'mp4',
      quality: data.quality || 'high',
      input: input,
    };
  }

  private async processAIGeneratorNode(data: any, inputs: Map<string, any>): Promise<any> {
    return {
      type: 'ai_generation',
      model: data.model,
      prompt: data.prompt,
      settings: data.settings,
      status: 'pending',
    };
  }

  private async processCompositeNode(data: any, inputs: Map<string, any>): Promise<any> {
    const input1 = inputs.get('input1');
    const input2 = inputs.get('input2');
    
    return {
      type: 'composite',
      mode: data.mode || 'over',
      opacity: data.opacity || 1.0,
      inputs: [input1, input2],
    };
  }

  private async processColorCorrectionNode(data: any, inputs: Map<string, any>): Promise<any> {
    const input = inputs.get('input');
    
    return {
      type: 'color_correction',
      brightness: data.brightness || 0,
      contrast: data.contrast || 1,
      saturation: data.saturation || 1,
      hue: data.hue || 0,
      input: input,
    };
  }

  private async processAudioNode(data: any, inputs: Map<string, any>): Promise<any> {
    const input = inputs.get('input');
    
    return {
      type: 'audio',
      volume: data.volume || 1.0,
      effects: data.effects || [],
      input: input,
    };
  }
}