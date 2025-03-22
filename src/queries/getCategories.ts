export default `
query getCategories($bookUid: ID!, $first: Int = 20, $offset: Int = 0) {
  node(id: $bookUid) {
    ... on Book {
      __typename
      categories(first: $first, offset: $offset) {
        nodes {
          uid
          name
        }
      }
    }
  }
}
`;
