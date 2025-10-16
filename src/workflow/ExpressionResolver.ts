import { get } from 'lodash-es';

export class ExpressionResolver {
  /**
   * Resolve expressions in the format ={{expression}}
   * Example: ={{$json.name}} -> value from input data
   */
  resolve(value: string, data: any): any {
    if (typeof value !== 'string') {
      return value;
    }

    // Check if it's an expression
    const expressionMatch = value.match(/^={{(.+)}}$/);
    if (!expressionMatch) {
      return value;
    }

    const expression = expressionMatch[1].trim();

    try {
      // Create context for expression evaluation
      const context = {
        $json: data,
        $data: data,
      };

      // Evaluate the expression
      return this.evaluateExpression(expression, context);
    } catch (error) {
      console.error(`Failed to resolve expression: ${expression}`, error);
      return value;
    }
  }

  private evaluateExpression(expression: string, context: any): any {
    // Handle property access like $json.name or $json.user.email
    if (expression.startsWith('$json.') || expression.startsWith('$data.')) {
      const path = expression.substring(expression.indexOf('.') + 1);
      return get(context, expression.split('.')[0])[path] || get(context.$json, path);
    }

    // For more complex expressions, use Function constructor
    // Create function with context variables
    const contextKeys = Object.keys(context);
    const contextValues = contextKeys.map(key => context[key]);

    // eslint-disable-next-line no-new-func
    const fn = new Function(...contextKeys, `return ${expression}`);
    return fn(...contextValues);
  }
}
