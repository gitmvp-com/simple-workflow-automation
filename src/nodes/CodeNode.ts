export class CodeNode {
  async execute(parameters: any, inputData: any[]): Promise<any> {
    const { code } = parameters;

    if (!code || typeof code !== 'string') {
      throw new Error('Code node requires code string');
    }

    try {
      // Create function from code
      // The code should return the transformed data
      const items = inputData.length > 0 ? (Array.isArray(inputData[0]) ? inputData[0] : [inputData[0]]) : [];
      
      // eslint-disable-next-line no-new-func
      const fn = new Function('items', code);
      const result = fn(items);

      return result;
    } catch (error) {
      throw new Error(
        `Code execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
