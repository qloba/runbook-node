# runbook-node
`runbook-node` is an SDK for Node.js to interact with the [Runbook API](https://developers.runbookdocs.com/).

## Installation

```sh
npm install runbook-node
```

## Usage

```javascript
import Runbook from '../index';

const runbook = new Runbook({
  baseUrl: process.env.BASE_URL!,
  apiToken: process.env.API_TOKEN!
});

const data = await runbook.query('getBooks', {
  q: 'test'
});
console.log(data);
```

## Supported Queries

- getBooks
- getArticles
- getArticle
- getCategores
- search

## Custom Queries

You can define and use custom GraphQL queries by creating a `runbook.graphql` file in your project.

```graphql
# runbook.graphql
query GetCustomBooks($q: String) {
  organization {
    books(q: $q) {
      nodes {
        uid
        name
      }
    }
  }
}
```

Use the `graphql()` method to execute your custom queries.

```javascript
import Runbook from 'runbook-node';
import getCustomBooksQuery from './runbook.graphql';

const runbook = new Runbook({
  baseUrl: process.env.BASE_URL!,
  apiToken: process.env.API_TOKEN!
});

const data = await runbook.graphql({
  query: getCustomBooksQuery,
  variables: {
    q: 'test'
  }
});
console.log(data);
```

## File Upload and Download

### Upload File

Use the `uploadFile()` method to upload files.

```javascript
const file = new File(['Hello, world!'], 'hello.txt', {
  type: 'text/plain'
});

const response = await runbook.uploadFile(
  file,
  `articles/${articleUid}/article_attachment_files`,
  'article_attachment_file[blob]'
);
console.log(response.articleAttachmentFile.uid);
```

### Download File

Use the `downloadFile()` method to download files as a Blob.

```javascript
const blob = await runbook.downloadFile(`articles/${articleUid}/article_attachment_files/${fileUid}/download`);
```

## License

MIT
