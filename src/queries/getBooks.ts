export default `
query getBooks($q: String, $first: Int = 20, $offset: Int = 0) {
  organization {
    books(q: $q, first: $first, offset: $offset) {
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
