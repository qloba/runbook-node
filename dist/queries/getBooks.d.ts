declare const _default: "\nquery getBooks($q: String!) {\n  organization {\n    books(q: $q, first: 100) {\n      nodes {\n        uid\n        name\n        description\n        pathname\n        bookType\n        workspace {\n          uid\n          name\n        }\n      }\n    }\n  }\n}\n";
export default _default;
