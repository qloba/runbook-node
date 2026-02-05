import RequestError from './Error';
import getArticleQuery from './queries/getArticle';
import getArticlesQuery from './queries/getArticles';
import getBooksQuery from './queries/getBooks';
import getCategoriesQuery from './queries/getCategories';
import searchQuery from './queries/search';
import { ResponseType, VariablesType } from './queries/types';
import { deepSnakeCase, deepCamelCase } from './lib/string';

const queries: { [key: string]: string } = {
  getArticle: getArticleQuery,
  getArticles: getArticlesQuery,
  getBooks: getBooksQuery,
  getCategories: getCategoriesQuery,
  search: searchQuery
};

interface Config {
  baseUrl: string;
  apiToken: string;
}

interface GraphQlResponse {
  errors?: { message: string; extensions: { code: string } }[];
  data?: { [key: string]: any };
}

function isMutation(query: string): boolean {
  return query.match(/^\s*mutation\s+\w+\(/m) !== null;
}

export { RequestError };

interface ApiParams {
  path: string;
  method: Method;
  headers?: { [key: string]: any };
  data?: any;
  query?: { [key: string]: any };
}
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface UploadResponse {
  [key: string]: {
    uid: string;
    filename: string;
    contentType: string;
    size: number;
  };
}

function buildQuery(query: { [key: string]: any }): string {
  const result: string[] = [];
  Object.keys(query).forEach((key) => {
    if (query[key] === undefined) return;
    result.push(`${key}=${encodeURIComponent(query[key])}`);
  });
  return result.join('&');
}

export default class runbook {
  baseUrl: string;
  apiToken: string;

  constructor(config: Config) {
    this.baseUrl = config.baseUrl;
    this.apiToken = config.apiToken;
  }

  async graphql<
    TQueryName extends keyof ResponseType = keyof ResponseType,
    TResponse = ResponseType[TQueryName],
    TVariables = VariablesType[TQueryName]
  >(data: { query: string; variables: TVariables }): Promise<TResponse> {
    const response = await fetch(this.getEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiToken}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new RequestError(error, response.status);
    }

    const result = (await response.json()) as GraphQlResponse;

    if (result.errors) {
      throw new RequestError(result.errors, 422);
    }
    if (
      isMutation(data.query) &&
      result.data &&
      typeof result.data === 'object'
    ) {
      for (const key in result.data) {
        const item = result.data[key];
        if (item && typeof item === 'object' && Array.isArray(item.errors)) {
          if (item.errors.length > 0) {
            throw new RequestError(item.errors, 422);
          } else if (item.success === false) {
            throw new RequestError(
              { error: 'An error occurred while requesting.' },
              422
            );
          }
        }
      }
    }
    return result.data as TResponse;
  }

  getEndpoint() {
    return `${this.baseUrl}/api/graphql`;
  }

  async api<T>(params: ApiParams): Promise<T> {
    let path = params.path;
    if (path.charAt(0) === '/') {
      path = path.slice(1);
    }
    let url = `${this.baseUrl}/api/${path}.json`;
    if (params.query) {
      url = `${url}?${buildQuery(deepSnakeCase(params.query))}`;
    }
    const headers: { [key: string]: string } = {
      ...params.headers,
      'X-Requested-With': 'XMLHttpRequest',
      Authorization: `Bearer ${this.apiToken}`
    };
    let method = params.method.toUpperCase();
    if (['GET', 'POST'].indexOf(params.method) < 0) {
      headers['X-Http-Method-Override'] = method;
      method = 'POST';
    }

    let body = null;
    if (params.data) {
      if (params.data instanceof FormData) {
        body = params.data;
      } else if (params.data instanceof URLSearchParams) {
        body = params.data.toString();
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else if (typeof params.data === 'string') {
        body = params.data;
        headers['Content-Type'] = 'text/plain';
      } else {
        body = JSON.stringify(deepSnakeCase(params.data));
        headers['Content-Type'] = 'application/json';
      }
    }

    const options: RequestInit = {
      method,
      headers,
      body
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.text();
      throw new RequestError(error, response.status);
    }
    const result = await response.json();
    return deepCamelCase(result) as T;
  }

  async uploadFile(
    file: File,
    path: string,
    paramName: string
  ): Promise<UploadResponse | null> {
    const formData = new FormData();
    formData.append(paramName, file);
    const options = {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${this.apiToken}`
      }
    };
    const url = `${this.baseUrl}/api/${path}`;
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.text();
      throw new RequestError(error, response.status);
    }
    const result: any = await response.json();
    return deepCamelCase(result) as UploadResponse;
  }

  async downloadFile(
    path: string,
    query?: { [key: string]: any }
  ): Promise<Blob> {
    const options = {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${this.apiToken}`
      }
    };

    // Add proxy=1 to the query parameters
    if (!query) {
      query = {};
    }
    query['proxy'] = 1;
    const url = `${this.baseUrl}/api/${path}?${buildQuery(deepSnakeCase(query))}`;
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.text();
      throw new RequestError(error, response.status);
    }
    const blob = await response.blob();
    return blob;
  }

  async query<TQueryName extends keyof ResponseType>(
    name: TQueryName,
    variables: VariablesType[TQueryName]
  ) {
    if (!(name in queries)) {
      throw new Error(`Query ${name} not found`);
    }
    const data = {
      query: queries[name]!,
      variables
    };
    return await this.graphql<TQueryName>(data);
  }
}
