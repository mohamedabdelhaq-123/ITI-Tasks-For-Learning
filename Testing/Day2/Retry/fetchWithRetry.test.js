jest.mock('./apiClient', () => ({ getData: jest.fn() }));

const { getData } = require('./apiClient');
const { fetchWithRetry } = require('./fetchWithRetry');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fetchWithRetry', () => {

  test('returns data on the first attempt and calls getData exactly once', async () => {
    getData.mockResolvedValue({ id: 1, name: 'product' });

    const result = await fetchWithRetry('https://api.example.com/data');

    expect(result).toEqual({ id: 1, name: 'product' });
    expect(getData).toHaveBeenCalledTimes(1);
  });

  test('retries after one failure and returns data when the second attempt succeeds', async () => {
    getData
      .mockRejectedValueOnce(new Error('timeout'))
      .mockResolvedValueOnce({ id: 1, name: 'product' });

    const result = await fetchWithRetry('https://api.example.com/data');

    expect(result).toEqual({ id: 1, name: 'product' });
    expect(getData).toHaveBeenCalledTimes(2);
  });

  test('throws after all 3 attempts fail and includes the error message', async () => {
    getData
      .mockRejectedValueOnce(new Error('timeout'))
      .mockRejectedValueOnce(new Error('timeout'))
      .mockRejectedValueOnce(new Error('timeout'));

    await expect(fetchWithRetry('https://api.example.com/data'))
      .rejects.toThrow('Failed after 3 attempts: timeout');

    expect(getData).toHaveBeenCalledTimes(3);
  });

});
