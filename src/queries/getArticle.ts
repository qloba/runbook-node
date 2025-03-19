export default `
query getArticle($articleUid: ID!) {
  node(id: $articleUid) {
    ... on Article {
      __typename
      uid
      name
      slug
      id
      bodyText
      createdAt
      updatedAt
      allCategories {
        uid
        name
      }
      folder {
        uid
        name
      }
      book {
        uid
        name
      }
    }
  }
}
`;
