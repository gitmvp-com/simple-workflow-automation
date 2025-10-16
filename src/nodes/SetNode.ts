export class SetNode {
  async execute(parameters: any, _inputData: any[]): Promise<any> {
    const { values } = parameters;

    if (!values || typeof values !== 'object') {
      throw new Error('Set node requires a values object');
    }

    // Return the transformed values
    return values;
  }
}
