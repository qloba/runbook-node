"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `
query getArticles(
    $bookUid: ID!
    $q: String
    $categoryUid: ID
    $orderBy: String = "createdAt"
    $first: Int
    $offset: Int
  ) {
  node(id: $bookUid) {
    ... on Book {
      __typename
      name
      articles(
          first: $first
          offset: $offset
          q: $q
          categoryUid: $categoryUid
          orderBy: $orderBy
      ) {
        totalCount
        nodes {
          uid
          name
          slug
          id
          bodyText
          createdAt
          updatedAt
        }
      }
    }
  }
}
`;
