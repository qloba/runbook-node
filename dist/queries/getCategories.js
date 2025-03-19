"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `
query getCategories($bookUid: ID!) {
  node(id: $bookUid) {
    ... on Book {
      __typename
      categories(first: 100) {
        nodes {
          uid
          name
        }
      }
    }
  }
}
`;
