export interface ErrorDetail {
  message: string;
  error: string;
}

export default class RequestError extends Error {
  json?: { [key: string]: any };
  status: number;
  messages: string[] = [];
  attributes: { [key: string]: ErrorDetail[] } = {};

  constructor(
    public data: string | object,
    status?: number
  ) {
    super(typeof data === 'string' ? data : JSON.stringify(data));
    if (typeof data === 'string') {
      try {
        this.json = JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
      }
    } else {
      this.json = data;
    }
    this.status = status || 0;
    this.name = this.constructor.name;
    this.parseErrorMessages();
  }

  addMessage(attr: string | null, message: string, error: string) {
    if (!message) return;
    if (!attr) {
      attr = 'base';
    }
    if (!this.attributes[attr]) {
      this.attributes[attr] = [];
    }
    this.attributes[attr].push({
      message,
      error
    });
    this.messages.push(message);
  }
  parseErrorMessages() {
    const response = this.json;
    switch (this.status) {
      case 401:
        this.addMessage(null, 'Unauthorized access.', 'unauthorized');
        return;
      case 500:
        this.addMessage(
          null,
          'Internal server error.',
          'internal_server_error'
        );
        return;
      case 400:
        this.addMessage(null, 'Bad request.', 'bad_request');
        return;
      case 403:
        this.addMessage(null, 'Forbidden.', 'forbidden');
        return;
      case 404:
        this.addMessage(null, 'Not found.', 'not_found');
        return;
      case 0:
        this.addMessage(null, 'Network error or CORS issue.', 'network_error');
        return;
    }
    if (Array.isArray(response)) {
      response.forEach((error) => {
        if (typeof error === 'string') {
          this.addMessage(null, error, error);
        } else if (isObject(error)) {
          this.addMessage(error.attribute, error.message, error.error);
        }
      });
    } else if (response?.errors && Array.isArray(response.errors)) {
      response.errors.forEach((error) => {
        if (typeof error === 'string') {
          this.addMessage(null, error, error);
        } else if (isObject(error)) {
          this.addMessage(error.attribute, error.message, error.error);
        }
      });
    } else if (response?.error) {
      this.addMessage(null, response.error, response.error);
    } else {
      this.addMessage(
        null,
        `An error occurred while requesting. status: ${this.status}`,
        'request_error'
      );
    }
  }
}

const isObject = (item: any): item is { [key: string]: any } => {
  return item && typeof item === 'object' && !Array.isArray(item);
};
