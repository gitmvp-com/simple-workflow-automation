import axios from 'axios';

export class HttpRequestNode {
  async execute(parameters: any, _inputData: any[]): Promise<any> {
    const { url, method = 'GET', headers = {}, body } = parameters;

    if (!url) {
      throw new Error('HTTP Request node requires a URL');
    }

    try {
      const response = await axios({
        url,
        method,
        headers,
        data: body,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `HTTP Request failed: ${error.response?.status} ${error.response?.statusText || error.message}`
        );
      }
      throw error;
    }
  }
}
