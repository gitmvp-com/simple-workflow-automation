import express, { Request, Response } from 'express';
import { WorkflowEngine } from './workflow/WorkflowEngine.js';
import { workflowSchema, type Workflow } from './types/workflow.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Simple Workflow Automation is running' });
});

// Execute workflow endpoint
app.post('/api/workflows/execute', async (req: Request, res: Response) => {
  try {
    // Validate workflow structure
    const workflow: Workflow = workflowSchema.parse(req.body);
    
    // Create workflow engine and execute
    const engine = new WorkflowEngine();
    const result = await engine.execute(workflow);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Workflow execution failed:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple Workflow Automation running on http://localhost:${PORT}`);
  console.log(`📖 API: POST http://localhost:${PORT}/api/workflows/execute`);
});
