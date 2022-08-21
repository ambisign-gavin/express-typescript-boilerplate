import { ApiError } from 'src/errors/apiError';
import logger from 'src/utilities/logger';
import errorHandler from './errorHandler';

jest.mock('src/utilities/logger');

describe('errorHandler', () => {
  const mockReq = {
    originalUrl: '/test',
  };
  const mockResStatusReturn = {
    json: jest.fn(),
  };
  const mockRes = {
    status: jest.fn().mockReturnValue(mockResStatusReturn),
  };

  const mockLogger = jest.spyOn(logger, 'error');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('unknow error', () => {
    const mockApiError = jest.spyOn(ApiError, 'create');

    errorHandler(
      new Error('non-api-error') as any,
      mockReq as any,
      mockRes as any,
    );
    expect(mockApiError).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(500);
    expect(mockResStatusReturn.json).toBeCalledTimes(1);
    expect(mockResStatusReturn.json.mock.calls[0][0]).toHaveProperty('code');
    expect(mockResStatusReturn.json.mock.calls[0][0]).toHaveProperty('message');
    expect(mockLogger).toBeCalledTimes(1);
    expect(mockLogger).toBeCalledWith(
      '/test [server-error]: Error: non-api-error',
    );
  });

  test('api error', () => {
    errorHandler(ApiError.create(), mockReq as any, mockRes as any);

    expect(mockRes.status).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(500);
    expect(mockResStatusReturn.json).toBeCalledTimes(1);
    expect(mockResStatusReturn.json.mock.calls[0][0]).toHaveProperty('code');
    expect(mockResStatusReturn.json.mock.calls[0][0]).toHaveProperty('message');
    expect(mockLogger).toBeCalledTimes(1);
    expect(mockLogger).toBeCalledWith('/test [api-error]: Error: unknow error');
  });
});
