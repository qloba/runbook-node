import getArticleQuery from "./queries/getArticles.js";
import getArticlesQuery from "./queries/getArticle.js";
import getBooksQuery from "./queries/getBooks.js";
import getCategoriesQuery from "./queries/getCategories.js";
import searchQuery from "./queries/search.js";

const queries: { [key: string]: string } = {
  getArticle: getArticleQuery,
  getArticles: getArticlesQuery,
  getBooks: getBooksQuery,
  getCategories: getCategoriesQuery,
  search: searchQuery,
};

interface Config {
  baseUrl: string;
  apiToken: string;
}

export default class runbook {
  baseUrl: string;
  apiToken: string;

  constructor(config: Config) {
    this.baseUrl = config.baseUrl;
    this.apiToken = config.apiToken;
  }

  async postData(data: object) {
    try {
      const response = await fetch(this.getEndpoint(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return JSON.stringify(result);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  }

  getEndpoint() {
    return `https://${this.baseUrl}/api/graphql`;
  }

  async query(name: string, variables: object) {
    if (!(name in queries)) {
      throw new Error(`Query ${name} not found`);
    }
    const data = {
      query: queries[name]!,
      variables,
    };
    return await this.postData(data);
  }
}
