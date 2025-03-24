export default `
query getArticles(
    $bookUid: ID!
    $q: String
    $categoryUid: ID
    $orderBy: String = "createdAt"
    $first: Int = 20
    $offset: Int = 0
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
          bodySnippet
          createdAt
          updatedAt
        }
      }
    }
  }
}
`;
