import { z } from 'zod';

// Node schema
export const nodeSchema = z.object({
  id: z.string(),
  type: z.enum(['httpRequest', 'set', 'code']),
  parameters: z.record(z.any()),
});

export type WorkflowNode = z.infer<typeof nodeSchema>;

// Connection schema
export const connectionSchema = z.object({
  from: z.string(),
  to: z.string(),
});

export type Connection = z.infer<typeof connectionSchema>;

// Workflow schema
export const workflowSchema = z.object({
  nodes: z.array(nodeSchema).min(1),
  connections: z.array(connectionSchema).default([]),
});

export type Workflow = z.infer<typeof workflowSchema>;

// Node execution context
export interface NodeExecutionContext {
  node: WorkflowNode;
  inputData: any[];
}

// Workflow execution result
export interface WorkflowExecutionResult {
  success: boolean;
  data: any;
  executionTime: number;
  nodesExecuted: number;
}
