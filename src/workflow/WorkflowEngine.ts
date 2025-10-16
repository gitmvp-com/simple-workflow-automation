import { Workflow, WorkflowNode, WorkflowExecutionResult } from '../types/workflow.js';
import { NodeExecutor } from './NodeExecutor.js';

export class WorkflowEngine {
  private nodeExecutor: NodeExecutor;

  constructor() {
    this.nodeExecutor = new NodeExecutor();
  }

  async execute(workflow: Workflow): Promise<WorkflowExecutionResult> {
    const startTime = Date.now();
    const { nodes, connections } = workflow;

    // Build execution order using topological sort
    const executionOrder = this.buildExecutionOrder(nodes, connections);
    
    // Execute nodes in order
    const nodeResults = new Map<string, any>();
    let lastResult: any = null;

    for (const nodeId of executionOrder) {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) {
        throw new Error(`Node ${nodeId} not found`);
      }

      // Get input data from previous nodes
      const inputData = this.getInputData(node, connections, nodeResults);

      // Execute node
      const result = await this.nodeExecutor.execute({
        node,
        inputData,
      });

      nodeResults.set(nodeId, result);
      lastResult = result;
    }

    const executionTime = Date.now() - startTime;

    return {
      success: true,
      data: lastResult,
      executionTime,
      nodesExecuted: executionOrder.length,
    };
  }

  private buildExecutionOrder(
    nodes: WorkflowNode[],
    connections: { from: string; to: string }[]
  ): string[] {
    // Simple topological sort
    const visited = new Set<string>();
    const order: string[] = [];
    const adjacencyList = new Map<string, string[]>();

    // Build adjacency list
    nodes.forEach(node => adjacencyList.set(node.id, []));
    connections.forEach(conn => {
      const neighbors = adjacencyList.get(conn.from) || [];
      neighbors.push(conn.to);
      adjacencyList.set(conn.from, neighbors);
    });

    // Find nodes with no incoming edges (starting nodes)
    const incomingEdges = new Map<string, number>();
    nodes.forEach(node => incomingEdges.set(node.id, 0));
    connections.forEach(conn => {
      incomingEdges.set(conn.to, (incomingEdges.get(conn.to) || 0) + 1);
    });

    const queue: string[] = [];
    nodes.forEach(node => {
      if (incomingEdges.get(node.id) === 0) {
        queue.push(node.id);
      }
    });

    // Process queue
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      order.push(nodeId);

      const neighbors = adjacencyList.get(nodeId) || [];
      neighbors.forEach(neighbor => {
        const count = incomingEdges.get(neighbor)! - 1;
        incomingEdges.set(neighbor, count);
        if (count === 0) {
          queue.push(neighbor);
        }
      });
    }

    if (order.length !== nodes.length) {
      throw new Error('Circular dependency detected in workflow');
    }

    return order;
  }

  private getInputData(
    node: WorkflowNode,
    connections: { from: string; to: string }[],
    nodeResults: Map<string, any>
  ): any[] {
    // Find all nodes that connect to this node
    const inputConnections = connections.filter(conn => conn.to === node.id);
    
    if (inputConnections.length === 0) {
      return [];
    }

    // Get results from connected nodes
    return inputConnections.map(conn => {
      const result = nodeResults.get(conn.from);
      return result;
    });
  }
}
