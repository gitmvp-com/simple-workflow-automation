import { NodeExecutionContext } from '../types/workflow.js';
import { HttpRequestNode } from '../nodes/HttpRequestNode.js';
import { SetNode } from '../nodes/SetNode.js';
import { CodeNode } from '../nodes/CodeNode.js';
import { ExpressionResolver } from './ExpressionResolver.js';

export class NodeExecutor {
  private expressionResolver: ExpressionResolver;
  private nodes: Map<string, any>;

  constructor() {
    this.expressionResolver = new ExpressionResolver();
    this.nodes = new Map();
    
    // Register available nodes
    this.nodes.set('httpRequest', new HttpRequestNode());
    this.nodes.set('set', new SetNode());
    this.nodes.set('code', new CodeNode());
  }

  async execute(context: NodeExecutionContext): Promise<any> {
    const { node, inputData } = context;
    
    // Get the node implementation
    const nodeImpl = this.nodes.get(node.type);
    if (!nodeImpl) {
      throw new Error(`Unknown node type: ${node.type}`);
    }

    // Resolve expressions in parameters
    const resolvedParameters = this.resolveParameters(
      node.parameters,
      inputData.length > 0 ? inputData[0] : {}
    );

    // Execute the node
    return await nodeImpl.execute(resolvedParameters, inputData);
  }

  private resolveParameters(parameters: any, inputData: any): any {
    if (typeof parameters === 'string') {
      return this.expressionResolver.resolve(parameters, inputData);
    }

    if (Array.isArray(parameters)) {
      return parameters.map(item => this.resolveParameters(item, inputData));
    }

    if (parameters && typeof parameters === 'object') {
      const resolved: any = {};
      for (const [key, value] of Object.entries(parameters)) {
        resolved[key] = this.resolveParameters(value, inputData);
      }
      return resolved;
    }

    return parameters;
  }
}
