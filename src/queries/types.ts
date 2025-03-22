export type GetBooksQuery = {
  organization: {
    books: {
      nodes: Array<{
        uid: string;
        name: string;
        description: string;
        pathname: string;
        bookType: string;
        workspace: {
          uid: string;
          name: string;
        };
      }>;
    };
  };
};

export type GetArticlesQuery = {
  node: {
    __typename: 'Book';
    name: string;
    articles: {
      totalCount: number;
      nodes: Array<{
        uid: string;
        name: string;
        slug: string;
        id: string;
        bodyText: string;
        createdAt: string;
        updatedAt: string;
      }>;
    };
  };
};

export type GetArticleQuery = {
  node: {
    __typename: 'Article';
    uid: string;
    name: string;
    slug: string;
    id: string;
    bodyText: string;
    createdAt: string;
    updatedAt: string;
    allCategories: Array<{
      uid: string;
      name: string;
    }>;
    folder: {
      uid: string;
      name: string;
    };
    book: {
      uid: string;
      name: string;
    };
  };
};

export type GetCategoriesQuery = {
  node: {
    __typename: 'Book';
    categories: {
      nodes: Array<{
        uid: string;
        name: string;
      }>;
    };
  };
};

export type searchQuery = {
  searchResults: {
    totalCount: number;
    nodes: Array<{
      uid: string;
      nodeType: string;
      name: string;
      bookUid: string;
      bookName: string;
      url: string;
      bodySnippet: string;
    }>;
  };
};

export type GetBooksQueryVariables = {
  q: string;
  first?: number;
  offset?: number;
};

export type GetArticlesQueryVariables = {
  bookUid: string;
  q?: string;
  categoryUid?: string;
  orderBy?: string;
  first?: number;
  offset?: number;
};

export type GetArticleQueryVariables = {
  articleUid: string;
};

export type GetCategoriesQueryVariables = {
  bookUid: string;
  first?: number;
  offset?: number;
};

export type searchQueryVariables = {
  scope: string;
  keywords: string;
  offset?: number;
  limit?: number;
  orderBy?: string;
};

export type ResponseType = {
  getBooks: GetBooksQuery;
  getArticles: GetArticlesQuery;
  getArticle: GetArticleQuery;
  getCategories: GetCategoriesQuery;
  search: searchQuery;
};

export type VariablesType = {
  getBooks: GetBooksQueryVariables;
  getArticles: GetArticlesQueryVariables;
  getArticle: GetArticleQueryVariables;
  getCategories: GetCategoriesQueryVariables;
  search: searchQueryVariables;
};
