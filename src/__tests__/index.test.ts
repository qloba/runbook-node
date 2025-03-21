import Runbook from '../index';

// Set environment variables BASE_URL and API_TOKEN before tesging
// export BASE_URL='<BASE_URL>'
// export API_TOKEN='<API_TOKEN>'

function initRunbook() {
  const runbook = new Runbook({
    baseUrl: process.env.BASE_URL!,
    apiToken: process.env.API_TOKEN!
  });
  return runbook;
}

async function getBook() {
  const runbook = initRunbook();
  const data = await runbook.query('getBooks', {
    q: 'test'
  });

  return data.organization.books.nodes[0];
}

describe('List books', function () {
  it('success', async () => {
    const runbook = initRunbook();
    const data = await runbook.query('getBooks', {
      q: 'test'
    });

    expect(data).not.toBe(null);
    expect(data.organization.books.nodes.length).toBeGreaterThan(0);
  });
});

describe('Get articles', function () {
  it('success', async () => {
    const runbook = initRunbook();
    const book = await getBook();
    const data = await runbook.query('getArticles', {
      bookUid: book.uid,
      first: 10
    });
    expect(data).not.toBe(null);
    expect(data.node.articles.nodes.length).toBeGreaterThan(0);
  });
});

describe('Get article', function () {
  it('success', async () => {
    const runbook = initRunbook();
    const book = await getBook();
    const articles = await runbook.query('getArticles', {
      bookUid: book.uid,
      first: 1
    });

    const data = await runbook.query('getArticle', {
      articleUid: articles.node.articles.nodes[0].uid
    });

    expect(data).not.toBe(null);
    expect(data.node).not.toBe(null);
  });
});

describe('Get categories', function () {
  it('success', async () => {
    const runbook = initRunbook();
    const book = await getBook();
    const data = await runbook.query('getCategories', {
      bookUid: book.uid
    });

    expect(data).not.toBe(null);
    expect(data.node.categories.nodes.length).toBeGreaterThan(0);
  });
});

describe('Search', function () {
  it('success', async () => {
    const runbook = initRunbook();
    const data = await runbook.query('search', {
      scope: 'all',
      keywords: ''
    });

    expect(data).not.toBe(null);
    expect(data.searchResults.nodes.length).toBeGreaterThan(0);
  });
});
