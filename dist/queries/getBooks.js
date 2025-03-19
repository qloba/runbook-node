"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `
query getBooks($q: String!) {
  organization {
    books(q: $q, first: 100) {
      nodes {
        uid
        name
        description
        pathname
        bookType
        workspace {
          uid
          name
        }
      }
    }
  }
}
`;
