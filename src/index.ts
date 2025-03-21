import RequestError from './Error';
import getArticleQuery from './queries/getArticle';
import getArticlesQuery from './queries/getArticles';
import getBooksQuery from './queries/getBooks';
import getCategoriesQuery from './queries/getCategories';
import searchQuery from './queries/search';
import { ResponseType, VariablesType } from './queries/types';

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

export default class runbook {
  baseUrl: string;
  apiToken: string;

  constructor(config: Config) {
    this.baseUrl = config.baseUrl;
    this.apiToken = config.apiToken;
  }

  async postData<TQueryName extends keyof ResponseType>(data: {
    query: string;
    variables: VariablesType[TQueryName];
  }): Promise<ResponseType[TQueryName]> {
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
    return result.data as Promise<ResponseType[TQueryName]>;
  }

  getEndpoint() {
    return `${this.baseUrl}/api/graphql`;
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
    return await this.postData<TQueryName>(data);
  }
}
