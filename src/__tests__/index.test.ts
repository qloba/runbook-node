import Runbook from '../index';
import getBooksQuery from '../queries/getBooks';
import { GetBooksQuery, GetBooksQueryVariables } from '../queries/types';

// Set environment variables BASE_URL and API_TOKEN before testing
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

  it('success', async () => {
    const runbook = initRunbook();
    const data = await runbook.query('getBooks', {});

    expect(data).not.toBe(null);
    expect(data.organization.books.nodes.length).toBeGreaterThan(0);
  });
});

describe('Custom query', function () {
  it('success', async () => {
    const runbook = initRunbook();
    const data = await runbook.graphql<
      any,
      GetBooksQuery,
      GetBooksQueryVariables
    >({
      query: getBooksQuery,
      variables: {
        q: 'test'
      }
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

// Unit tests with mocked fetch
describe('api()', function () {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('makes GET request correctly', async () => {
    const mockResponse = { data: 'test' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const runbook = new Runbook({
      baseUrl: 'https://example.com',
      apiToken: 'test-token'
    });

    const result = await runbook.api({
      path: '/users',
      method: 'GET'
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/users.json', {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: 'Bearer test-token'
      },
      body: null
    });
    expect(result).toEqual(mockResponse);
  });

  it('makes POST request with JSON body', async () => {
    const mockResponse = { success: true };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const runbook = new Runbook({
      baseUrl: 'https://example.com',
      apiToken: 'test-token'
    });

    const result = await runbook.api({
      path: 'articles',
      method: 'POST',
      data: { title: 'Test Article' }
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/articles.json', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: 'Test Article' })
    });
    expect(result).toEqual(mockResponse);
  });

  it('converts PUT/DELETE/PATCH to POST with X-Http-Method-Override header', async () => {
    const mockResponse = { success: true };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const runbook = new Runbook({
      baseUrl: 'https://example.com',
      apiToken: 'test-token'
    });

    await runbook.api({
      path: 'articles/123',
      method: 'PUT',
      data: { title: 'Updated' }
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/articles/123.json', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: 'Bearer test-token',
        'X-Http-Method-Override': 'PUT',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: 'Updated' })
    });
  });

  it('handles query parameters', async () => {
    const mockResponse = { data: [] };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const runbook = new Runbook({
      baseUrl: 'https://example.com',
      apiToken: 'test-token'
    });

    await runbook.api({
      path: 'search',
      method: 'GET',
      query: { q: 'test', page: 1 }
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/search.json?q=test&page=1',
      expect.any(Object)
    );
  });

  it('handles URLSearchParams body', async () => {
    const mockResponse = { success: true };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const runbook = new Runbook({
      baseUrl: 'https://example.com',
      apiToken: 'test-token'
    });

    const params = new URLSearchParams();
    params.append('name', 'test');

    await runbook.api({
      path: 'submit',
      method: 'POST',
      data: params
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/submit.json', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'name=test'
    });
  });

  it('handles string body', async () => {
    const mockResponse = { success: true };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const runbook = new Runbook({
      baseUrl: 'https://example.com',
      apiToken: 'test-token'
    });

    await runbook.api({
      path: 'raw',
      method: 'POST',
      data: 'plain text content'
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/raw.json', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: 'Bearer test-token',
        'Content-Type': 'text/plain'
      },
      body: 'plain text content'
    });
  });

  it('handles FormData body', async () => {
    const mockResponse = { success: true };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const runbook = new Runbook({
      baseUrl: 'https://example.com',
      apiToken: 'test-token'
    });

    const formData = new FormData();
    formData.append('field', 'value');

    await runbook.api({
      path: 'upload',
      method: 'POST',
      data: formData
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/upload.json', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: 'Bearer test-token'
      },
      body: formData
    });
  });

  it('throws RequestError on non-ok response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      text: () => Promise.resolve('Not Found')
    });

    const runbook = new Runbook({
      baseUrl: 'https://example.com',
      apiToken: 'test-token'
    });

    await expect(
      runbook.api({ path: 'missing', method: 'GET' })
    ).rejects.toThrow();
  });
});

describe('uploadFile()', function () {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('uploads file with FormData', async () => {
    const mockResponse = {
      articleAttachmentFile: {
        uid: 'file-123',
        filename: 'test.pdf',
        contentType: 'application/pdf',
        size: 1024
      }
    };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const runbook = new Runbook({
      baseUrl: 'https://example.com',
      apiToken: 'test-token'
    });

    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf'
    });
    const result = await runbook.uploadFile(
      file,
      'https://example.com/upload',
      'attachment'
    );

    expect(global.fetch).toHaveBeenCalledWith('https://example.com/upload', {
      method: 'POST',
      body: expect.any(FormData),
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: 'Bearer test-token'
      }
    });
    expect(result).toEqual(mockResponse);
  });

  it('throws RequestError on upload failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve('Upload failed')
    });

    const runbook = new Runbook({
      baseUrl: 'https://example.com',
      apiToken: 'test-token'
    });

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });

    await expect(
      runbook.uploadFile(file, 'https://example.com/upload', 'file')
    ).rejects.toThrow();
  });
});

describe('downloadFile()', function () {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('downloads file and returns Blob', async () => {
    const mockBlob = new Blob(['file content'], { type: 'text/plain' });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(mockBlob)
    });

    const runbook = new Runbook({
      baseUrl: 'https://example.com',
      apiToken: 'test-token'
    });

    const result = await runbook.downloadFile(
      'https://example.com/files/test.txt'
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/files/test.txt',
      {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Authorization: 'Bearer test-token'
        }
      }
    );
    expect(result).toBeInstanceOf(Blob);
  });

  it('throws RequestError on download failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 403,
      text: () => Promise.resolve('Forbidden')
    });

    const runbook = new Runbook({
      baseUrl: 'https://example.com',
      apiToken: 'test-token'
    });

    await expect(
      runbook.downloadFile('https://example.com/files/secret.txt')
    ).rejects.toThrow();
  });
});
