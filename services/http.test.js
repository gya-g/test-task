const { Http } = require('./http');
require('jest-fetch-mock').enableMocks();

describe('Http', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('should return JSON data when fetch is successful', async () => {
    const mockData = { key: 'value' };
    fetch.mockResponseOnce(JSON.stringify(mockData));

    const url = 'https://api.example.com/data';
    const data = await Http.get(url);

    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(url);
  });

  test('should log error when fetch fails', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const mockError = new Error('Network error');
    fetch.mockRejectOnce(mockError);

    const url = 'https://api.example.com/data';
    const data = await Http.get(url);

    expect(data).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(mockError);

    consoleSpy.mockRestore();
  });
});
