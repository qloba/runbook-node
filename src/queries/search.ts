export default `
query search(
  $scope: ID = "all"
  $keywords: String!
  $offset: Int = 0
  $limit: Int = 20
  $orderBy: String = "score"
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
