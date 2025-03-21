# runbook-node
`runbook-node` is an SDK for Node.js to interact with the Runbook API.

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

- GetBooks
- GetArticles
- GetArticle
- GetCategores
- search

## License

MIT