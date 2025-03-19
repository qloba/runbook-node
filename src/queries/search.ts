export default `
query search(
  $scope: ID
  $keywords: String!
  $offset: Int
  $limit: Int
  $orderBy: String
) {
  searchResults(
    scope: $scope
    keywords: $keywords
    offset: $offset
    limit: $limit
    orderBy: $orderBy
  ) {
    totalCount
    nodes {
      uid
      nodeType
      name
      bookUid
      bookName
      url
      bodySnippet
    }
  }
}
`;
