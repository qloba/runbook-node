declare const _default: "\nquery getCategories($bookUid: ID!) {\n  node(id: $bookUid) {\n    ... on Book {\n      __typename\n      categories(first: 100) {\n        nodes {\n          uid\n          name\n        }\n      }\n    }\n  }\n}\n";
export default _default;
